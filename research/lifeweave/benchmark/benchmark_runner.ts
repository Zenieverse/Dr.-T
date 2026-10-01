import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface BenchmarkTask {
  id: string;
  category: string;
  issue: string;
  repository_fixture: string;
  expected_relevant_location: string;
  validation_command: string;
  expected_invariant: string;
}

interface BenchmarkExecutionResult {
  taskId: string;
  category: string;
  command: string;
  exitCode: number;
  durationMs: number;
  stdout: string;
  passed: boolean;
}

export function runLocalBenchmark(): {
  totalTasks: number;
  passedTasks: number;
  results: BenchmarkExecutionResult[];
} {
  const tasksPath = path.resolve(process.cwd(), 'research/lifeweave/benchmark/benchmark_tasks.json');
  const tasks: BenchmarkTask[] = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));

  const results: BenchmarkExecutionResult[] = [];
  let passedCount = 0;

  for (const task of tasks) {
    const startTime = Date.now();
    let exitCode = 0;
    let stdout = '';
    let passed = false;

    try {
      stdout = execSync(task.validation_command, {
        cwd: process.cwd(),
        encoding: 'utf8',
        timeout: 15000
      }).trim();
      exitCode = 0;
      passed = true;
      passedCount++;
    } catch (err: any) {
      exitCode = err.status || 1;
      stdout = (err.stdout || '') + (err.stderr || err.message);
      passed = false;
    }

    const durationMs = Date.now() - startTime;
    results.push({
      taskId: task.id,
      category: task.category,
      command: task.validation_command,
      exitCode,
      durationMs,
      stdout,
      passed
    });
  }

  // Write actual execution results to research directory
  const resultsOut = {
    executedAt: new Date().toISOString(),
    totalTasks: tasks.length,
    passedTasks: passedCount,
    passRate: `${((passedCount / tasks.length) * 100).toFixed(1)}%`,
    tasks: results
  };

  fs.writeFileSync(
    path.resolve(process.cwd(), 'research/lifeweave/benchmark/benchmark_results.json'),
    JSON.stringify(resultsOut, null, 2)
  );

  return {
    totalTasks: tasks.length,
    passedTasks: passedCount,
    results
  };
}

if (import.meta.url.endsWith(process.argv[1])) {
  console.log('🧪 Executing LIFEWEAVE Local Benchmark Test Suite (10 Tasks)...\n');
  const res = runLocalBenchmark();
  res.results.forEach(r => {
    const icon = r.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`  ${icon}: [${r.taskId}] ${r.category} (${r.durationMs}ms)`);
  });
  console.log(`\n==========================================`);
  console.log(`Benchmark Summary: ${res.passedTasks}/${res.totalTasks} Passed (${((res.passedTasks / res.totalTasks) * 100).toFixed(1)}%)`);
  console.log(`==========================================`);
}
