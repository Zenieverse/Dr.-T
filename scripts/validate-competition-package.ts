// ==========================================
// LIFEWEAVE: COMPETITION PACKAGE & HARNESS VALIDATOR
// Validates submission.zip against HARNESS_README.md and Competition Harness Rules
// ==========================================

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ALLOWED_COMPETITION_TOOLS = new Set([
  'run_command',
  'read_file',
  'write_file',
  'edit_file',
  'get_status',
  'submit_patch',
  'search_similar_code',
  'get_code_neighbors',
  'get_code_subgraph'
]);

const TARGET_MODEL = 'gemma-4-31b-it-qat-w4a16-ct';

export function validateCompetitionPackage(zipPath: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
  inspectedFiles: string[];
  manifest: any;
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const inspectedFiles: string[] = [];
  let manifest: any = null;

  if (!fs.existsSync(zipPath)) {
    errors.push(`Zip archive not found at ${zipPath}`);
    return { valid: false, errors, warnings, inspectedFiles, manifest };
  }

  // 1. Inspect ZIP file tree using python zipfile
  try {
    const listPy = `import zipfile, json
with zipfile.ZipFile(r'${zipPath}', 'r') as zf:
    print(json.dumps(zf.namelist()))
`;
    const filesJson = execSync(`python3 -c "${listPy.replace(/"/g, '\\"')}"`).toString().trim();
    const filesInZip: string[] = JSON.parse(filesJson);
    inspectedFiles.push(...filesInZip);

    // Rule 1: agent.yaml MUST be at the root of the ZIP
    if (!filesInZip.includes('agent.yaml')) {
      errors.push('CRITICAL: agent.yaml is NOT at the root of the ZIP archive');
    }

    // Rule 2: Check required file paths in zip
    const requiredFiles = [
      'agent.yaml',
      'configs/sampling.yaml',
      'prompts/system.md',
      'prompts/analyzer.md',
      'skills/lifeweave/SKILL.md'
    ];

    for (const reqFile of requiredFiles) {
      if (!filesInZip.includes(reqFile)) {
        errors.push(`Missing required file in ZIP: ${reqFile}`);
      }
    }

    // Read files from zip
    const readPy = `import zipfile, json
result = {}
with zipfile.ZipFile(r'${zipPath}', 'r') as zf:
    for name in zf.namelist():
        if not name.endswith('/'):
            result[name] = zf.read(name).decode('utf-8', errors='replace')
print(json.dumps(result))
`;
    const contentsJson = execSync(`python3 -c "${readPy.replace(/"/g, '\\"')}"`).toString().trim();
    const contents: Record<string, string> = JSON.parse(contentsJson);

    // Rule 3: Validate agent.yaml content
    const agentYaml = contents['agent.yaml'] || '';
    
    // Parse model
    const modelMatch = agentYaml.match(/model:\s*([^\s\r\n]+)/);
    const model = modelMatch ? modelMatch[1].trim() : '';
    if (model !== TARGET_MODEL) {
      errors.push(`Target model mismatch: expected "${TARGET_MODEL}", got "${model}"`);
    }

    // Parse tools list
    const toolsBlock = agentYaml.match(/tools:\s*\n((?:\s*-\s*[^\r\n]+\n?)+)/);
    if (!toolsBlock) {
      errors.push('No tools defined in agent.yaml');
    } else {
      const declaredTools = toolsBlock[1]
        .split('\n')
        .map(line => line.replace(/^\s*-\s*/, '').trim())
        .filter(Boolean);

      for (const t of declaredTools) {
        if (!ALLOWED_COMPETITION_TOOLS.has(t)) {
          errors.push(`Tool "${t}" in agent.yaml is not an allowed competition tool!`);
        }
      }

      for (const reqTool of ['run_command', 'read_file', 'edit_file', 'submit_patch', 'search_similar_code']) {
        if (!declaredTools.includes(reqTool)) {
          errors.push(`Core tool "${reqTool}" missing from agent.yaml tools list`);
        }
      }
    }

    // Rule 4: Validate sampling.yaml
    const samplingYaml = contents['configs/sampling.yaml'] || '';
    if (!samplingYaml.includes('temperature:')) {
      errors.push('configs/sampling.yaml missing temperature field');
    }
    if (!samplingYaml.includes('max_output_tokens:')) {
      errors.push('configs/sampling.yaml missing max_output_tokens field');
    }

    // Rule 5: Validate prompts/system.md
    const systemPrompt = contents['prompts/system.md'] || '';
    if (!systemPrompt.includes('ORIENT') || !systemPrompt.includes('RECOVER')) {
      errors.push('prompts/system.md missing 9-stage engineering loop');
    }
    if (!systemPrompt.includes('search_similar_code') || !systemPrompt.includes('submit_patch')) {
      errors.push('prompts/system.md missing required tool specifications');
    }
    if (!systemPrompt.includes('EVIDENCE HIERARCHY') && !systemPrompt.includes('Evidence Hierarchy')) {
      errors.push('prompts/system.md missing Evidence Hierarchy specification');
    }

    // Rule 6: Validate prompts/analyzer.md
    const analyzerPrompt = contents['prompts/analyzer.md'] || '';
    if (!analyzerPrompt.includes('Candidate Discovery') || !analyzerPrompt.includes('Evidence Profile')) {
      warnings.push('prompts/analyzer.md should explicitly define Candidate Discovery and Evidence Profile computation');
    }

    // Rule 7: Validate skills/lifeweave/SKILL.md
    const skillMd = contents['skills/lifeweave/SKILL.md'] || '';
    if (!skillMd.startsWith('---') || !skillMd.includes('name: lifeweave')) {
      errors.push('skills/lifeweave/SKILL.md missing standard YAML frontmatter with name: lifeweave');
    }

    manifest = {
      model,
      fileCount: filesInZip.length,
      byteSize: fs.statSync(zipPath).size,
      contentsOverview: Object.keys(contents).map(k => ({ file: k, length: contents[k].length }))
    };

  } catch (err: any) {
    errors.push(`Package reading failed: ${err.message}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    inspectedFiles,
    manifest
  };
}

async function runCli() {
  console.log('🏆 Validating submission.zip against HARNESS_README.md...\n');
  const zipPath = path.resolve(process.cwd(), 'submission.zip');
  const result = validateCompetitionPackage(zipPath);

  console.log(`Inspected files in archive (${result.inspectedFiles.length}):`);
  result.inspectedFiles.forEach(f => console.log(`  - ${f}`));
  console.log('');

  if (result.warnings.length > 0) {
    console.log('⚠️ Warnings:');
    result.warnings.forEach(w => console.log(`  - ${w}`));
    console.log('');
  }

  if (result.valid) {
    console.log('==========================================');
    console.log('✅ VALIDATION PASSED: Package strictly conforms to Kaggle Gemma 4 Harness');
    console.log(`Target Model: ${result.manifest?.model}`);
    console.log(`File Count: ${result.manifest?.fileCount} files`);
    console.log(`Archive Size: ${result.manifest?.byteSize} bytes`);
    console.log('==========================================');
    process.exit(0);
  } else {
    console.error('==========================================');
    console.error('❌ VALIDATION FAILED:');
    result.errors.forEach(e => console.error(`  - ${e}`));
    console.error('==========================================');
    process.exit(1);
  }
}

runCli().catch(err => {
  console.error('Fatal validation execution error:', err);
  process.exit(1);
});
