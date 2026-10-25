import React, { useState, useEffect } from 'react';
import { BuildWithAiProject, ProjectDocument } from '../types';
import { BuildWithAiService } from '../services/buildWithAiService';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Download, 
  Sparkles, 
  Eye, 
  Edit3, 
  Save, 
  RefreshCw, 
  Share2, 
  ShieldCheck,
  Check,
  PackageCheck
} from 'lucide-react';

interface DocumentEditorViewProps {
  project: BuildWithAiProject;
  onUpdateProject: (updated: BuildWithAiProject) => void;
}

type DocKey = 'scope.md' | 'prd.md' | 'spec.md' | 'README.md';

export const DocumentEditorView: React.FC<DocumentEditorViewProps> = ({
  project,
  onUpdateProject
}) => {
  const [activeDocKey, setActiveDocKey] = useState<DocKey>('scope.md');
  const [content, setContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const activeDoc: ProjectDocument = project.documents[activeDocKey];

  useEffect(() => {
    setContent(project.documents[activeDocKey]?.content || '');
    setHasUnsavedChanges(false);
  }, [activeDocKey, project]);

  const handleContentChange = (newText: string) => {
    setContent(newText);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    const validationErrors = BuildWithAiService.validateDocumentSections({
      ...activeDoc,
      content
    });

    const updatedDoc: ProjectDocument = {
      ...activeDoc,
      content,
      lastUpdated: new Date().toISOString(),
      validationErrors,
      isApproved: validationErrors.length === 0 ? activeDoc.isApproved : false
    };

    const updatedProject: BuildWithAiProject = {
      ...project,
      documents: {
        ...project.documents,
        [activeDocKey]: updatedDoc
      },
      updatedAt: new Date().toISOString()
    };

    onUpdateProject(updatedProject);
    setHasUnsavedChanges(false);
    setSaveStatus('Document saved successfully.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleToggleApproval = () => {
    const validationErrors = BuildWithAiService.validateDocumentSections({
      ...activeDoc,
      content
    });

    if (validationErrors.length > 0 && !activeDoc.isApproved) {
      alert(`Cannot approve document. Please resolve missing sections first:\n${validationErrors.join('\n')}`);
      return;
    }

    const updatedDoc: ProjectDocument = {
      ...activeDoc,
      isApproved: !activeDoc.isApproved,
      lastUpdated: new Date().toISOString()
    };

    onUpdateProject({
      ...project,
      documents: {
        ...project.documents,
        [activeDocKey]: updatedDoc
      },
      updatedAt: new Date().toISOString()
    });
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopiedKey(activeDocKey);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadFile = () => {
    BuildWithAiService.downloadMarkdownFile(activeDocKey, content);
  };

  const handleExportManifest = () => {
    BuildWithAiService.exportProjectManifest(project);
  };

  const handleRefineWithAi = async () => {
    setIsRefining(true);
    setSaveStatus(null);
    try {
      const res = await fetch('/api/build-with-ai/draft-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType: activeDocKey,
          projectName: project.name,
          brief: project.brief
        })
      });
      const data = await res.json();
      if (data.success && data.content) {
        setContent(data.content);
        setHasUnsavedChanges(true);
        setSaveStatus(`Refined via ${data.telemetry?.engine} (${data.telemetry?.latencyMs}ms). Click "Save Changes" to commit.`);
      } else {
        throw new Error(data.error || 'Refinement failed');
      }
    } catch (err: any) {
      console.warn('AI refinement failed:', err);
      setSaveStatus('AI refinement timed out. Retaining local content.');
    } finally {
      setIsRefining(false);
    }
  };

  // Cross-document consistency validation
  const consistency = BuildWithAiService.validateCrossDocumentConsistency(project);

  return (
    <div className="space-y-6">
      {/* Top Document Selector Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {(['scope.md', 'prd.md', 'spec.md', 'README.md'] as DocKey[]).map(docKey => {
            const doc = project.documents[docKey];
            const isSelected = activeDocKey === docKey;
            const isApproved = doc?.isApproved;
            const hasErrors = doc?.validationErrors && doc.validationErrors.length > 0;

            return (
              <button
                key={docKey}
                onClick={() => {
                  if (hasUnsavedChanges) {
                    if (confirm('You have unsaved edits. Discard changes and switch document?')) {
                      setActiveDocKey(docKey);
                    }
                  } else {
                    setActiveDocKey(docKey);
                  }
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-2 border ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{docKey}</span>
                {isApproved && <span className="text-emerald-400 font-bold">✓</span>}
                {hasErrors && <span className="text-amber-400 font-bold">!</span>}
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportManifest}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center space-x-1.5"
            title="Export all 4 Markdown documents and manifest"
          >
            <PackageCheck className="w-4 h-4 text-slate-600" />
            <span>Export Manifest Bundle</span>
          </button>
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor & Preview Area (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-slate-900">{activeDocKey}</span>
                {hasUnsavedChanges && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                    Unsaved Edits
                  </span>
                )}
                {activeDoc.isApproved && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                    Approved ✓
                  </span>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center space-x-2">
                {/* Edit / Preview Toggle */}
                <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${isEditing ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${!isEditing ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Preview
                  </button>
                </div>

                {/* AI Refine Action */}
                <button
                  onClick={handleRefineWithAi}
                  disabled={isRefining}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center space-x-1 border border-indigo-200 disabled:opacity-50"
                  title="Refine this document using Gemini 3.8 Flash based on your project brief"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isRefining ? 'Drafting...' : 'Refine with AI'}</span>
                </button>

                {/* Copy to Clipboard */}
                <button
                  onClick={handleCopyClipboard}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title="Copy Markdown to Clipboard"
                >
                  {copiedKey === activeDocKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>

                {/* Download File */}
                <button
                  onClick={handleDownloadFile}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>

                {/* Save Changes */}
                <button
                  onClick={handleSave}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center space-x-1 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {saveStatus && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                {saveStatus}
              </div>
            )}

            {/* Editor or Preview Pane */}
            {isEditing ? (
              <textarea
                value={content}
                onChange={e => handleContentChange(e.target.value)}
                rows={22}
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-indigo-500 focus:bg-white transition resize-y"
                placeholder="Enter markdown content..."
              />
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 max-h-[550px] overflow-y-auto prose prose-slate text-xs leading-relaxed">
                <pre className="whitespace-pre-wrap font-sans text-slate-800">
                  {content}
                </pre>
              </div>
            )}

            {/* Approval Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                {content.split(/\s+/).filter(Boolean).length} words • {content.length} characters
              </span>
              <button
                onClick={handleToggleApproval}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-2xs ${
                  activeDoc.isApproved
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{activeDoc.isApproved ? 'Revoke Approval' : 'Approve Document'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar: Required Sections Validation & Consistency (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Section Checklist */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Required Sections for {activeDocKey}
              </h4>
            </div>

            <ul className="space-y-1.5 text-xs">
              {activeDoc.requiredSections.map(section => {
                const cleaned = section.replace(/^[0-9]+\.\s*/, '').toLowerCase();
                const isPresent = content.toLowerCase().includes(cleaned);
                return (
                  <li 
                    key={section}
                    className={`p-2 rounded-xl border flex items-center justify-between text-xs transition ${
                      isPresent
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 font-medium'
                        : 'bg-amber-50/60 border-amber-200 text-amber-900'
                    }`}
                  >
                    <span>{section}</span>
                    <span className="font-bold text-[10px]">
                      {isPresent ? '✓ Valid' : 'Missing'}
                    </span>
                  </li>
                );
              })}
            </ul>

            {activeDoc.validationErrors.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-900 space-y-1">
                <span className="font-bold block flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Validation Alerts:</span>
                </span>
                <ul className="list-disc list-inside space-y-0.5">
                  {activeDoc.validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Cross-Document Consistency Card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Cross-Document Consistency
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              {consistency.strengths.map((str, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200 text-teal-900 flex items-start space-x-2 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </div>
              ))}

              {consistency.issues.map((iss, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start space-x-2 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{iss}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 italic">
              Consistency verification guarantees that goals defined in scope.md match the requirements in prd.md and architecture in spec.md.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
