import React, { useState, useEffect } from 'react';
import { NavTab } from '../../types';
import { BuildWithAiProject, ProjectTask } from './types';
import { BuildWithAiService } from './services/buildWithAiService';
import { HEALTHALERT_MINI_TEMPLATE } from './data/templateProject';
import { DashboardView } from './views/DashboardView';
import { LifecycleView } from './views/LifecycleView';
import { IntakeBriefView } from './views/IntakeBriefView';
import { DocumentEditorView } from './views/DocumentEditorView';
import { TaskBoardView } from './views/TaskBoardView';
import { CodingAssistantView } from './views/CodingAssistantView';
import { LearnAiBasicsView } from './views/LearnAiBasicsView';
import { 
  Hammer, 
  Sparkles, 
  Plus, 
  Copy, 
  Trash2, 
  FolderKanban, 
  Layers, 
  FileText, 
  Kanban, 
  Code2, 
  Trophy, 
  ChevronDown,
  Info,
  ExternalLink,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface BuildWithAiModuleProps {
  setActiveTab?: (tab: NavTab) => void;
}

export const BuildWithAiModule: React.FC<BuildWithAiModuleProps> = ({ setActiveTab }) => {
  const [projects, setProjects] = useState<BuildWithAiProject[]>([HEALTHALERT_MINI_TEMPLATE]);
  const [activeProjectId, setActiveProjectId] = useState<string>(HEALTHALERT_MINI_TEMPLATE.id);
  const [activeSubtab, setActiveSubtab] = useState<string>('dashboard');
  const [selectedTaskForAssist, setSelectedTaskForAssist] = useState<ProjectTask | null>(null);

  // New Project Modal State
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newProjectTagline, setNewProjectTagline] = useState<string>('');
  const [newProjectProblem, setNewProjectProblem] = useState<string>('');
  const [newProjectAudience, setNewProjectAudience] = useState<string>('');
  const [newProjectSolution, setNewProjectSolution] = useState<string>('');

  useEffect(() => {
    async function load() {
      try {
        const loaded = await BuildWithAiService.getProjects();
        setProjects(loaded);
        if (loaded.length > 0 && !loaded.some(p => p.id === activeProjectId)) {
          setActiveProjectId(loaded[0].id);
        }
      } catch (err) {
        console.warn('Error loading projects:', err);
      }
    }
    load();
  }, []);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || HEALTHALERT_MINI_TEMPLATE;

  const handleUpdateProject = async (updated: BuildWithAiProject) => {
    await BuildWithAiService.saveProject(updated);
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleCreateNewProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      const created = await BuildWithAiService.createProject({
        name: newProjectName.trim(),
        tagline: newProjectTagline.trim(),
        problemStatement: newProjectProblem.trim(),
        targetAudience: newProjectAudience.trim(),
        proposedSolution: newProjectSolution.trim(),
        description: newProjectProblem.trim()
      });

      setProjects(prev => [...prev, created]);
      setActiveProjectId(created.id);
      setIsNewProjectModalOpen(false);
      setActiveSubtab('intake');

      // Reset
      setNewProjectName('');
      setNewProjectTagline('');
      setNewProjectProblem('');
      setNewProjectAudience('');
      setNewProjectSolution('');
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const handleDuplicateProject = async () => {
    try {
      const duplicated = await BuildWithAiService.duplicateProject(activeProject.id);
      setProjects(prev => [...prev, duplicated]);
      setActiveProjectId(duplicated.id);
    } catch (err) {
      console.error('Failed to duplicate:', err);
    }
  };

  const handleDeleteProject = async () => {
    if (activeProject.isTemplate) {
      alert('The demonstration template cannot be deleted.');
      return;
    }

    if (confirm(`Are you sure you want to delete "${activeProject.name}"? This action cannot be undone.`)) {
      try {
        await BuildWithAiService.deleteProject(activeProject.id);
        const remaining = projects.filter(p => p.id !== activeProject.id);
        setProjects(remaining);
        setActiveProjectId(remaining[0]?.id || HEALTHALERT_MINI_TEMPLATE.id);
      } catch (err) {
        console.error('Failed to delete project:', err);
      }
    }
  };

  const subtabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FolderKanban className="w-4 h-4 text-indigo-600" /> },
    { id: 'lifecycle', label: '8-Stage Lifecycle', icon: <Layers className="w-4 h-4 text-purple-600" /> },
    { id: 'intake', label: 'Intake & Brief', icon: <Sparkles className="w-4 h-4 text-teal-600" /> },
    { id: 'editor', label: 'Document Editor', icon: <FileText className="w-4 h-4 text-blue-600" />, badge: 'scope/prd/spec' },
    { id: 'tasks', label: 'Task Board', icon: <Kanban className="w-4 h-4 text-amber-600" /> },
    { id: 'assistant', label: 'Coding Assistant', icon: <Code2 className="w-4 h-4 text-emerald-600" /> },
    { id: 'devpost', label: 'Devpost Learn AI Basics', icon: <Trophy className="w-4 h-4 text-amber-500" />, badge: 'Challenge' }
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Header Banner */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title & Tagline */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-teal-500 p-0.5 shadow-md flex items-center justify-center shrink-0 text-white">
                <Hammer className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-black text-slate-900 font-display tracking-tight">
                    Build With AI
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Devpost Learn AI Basics
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  From idea to tested, documented AI project.
                </p>
              </div>
            </div>

            {/* Project Switcher & Top Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <select
                  value={activeProjectId}
                  onChange={e => setActiveProjectId(e.target.value)}
                  className="px-3.5 py-2 pr-8 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition appearance-none cursor-pointer max-w-[220px] truncate"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.isTemplate ? `★ ${p.name}` : p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              <button
                onClick={() => setIsNewProjectModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center space-x-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </button>

              <button
                onClick={handleDuplicateProject}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                title="Duplicate Current Project"
              >
                <Copy className="w-4 h-4" />
              </button>

              {!activeProject.isTemplate && (
                <button
                  onClick={handleDeleteProject}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 transition"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Subtab Navigation Ribbon */}
          <div className="mt-3.5 pt-2 border-t border-slate-100 flex items-center space-x-1 overflow-x-auto no-scrollbar pb-1">
            {subtabs.map(tab => {
              const isActive = activeSubtab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubtab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tab Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeSubtab === 'dashboard' && (
          <DashboardView
            project={activeProject}
            setActiveSubtab={setActiveSubtab}
            onUpdateProject={handleUpdateProject}
          />
        )}

        {activeSubtab === 'lifecycle' && (
          <LifecycleView
            project={activeProject}
            setActiveSubtab={setActiveSubtab}
            onUpdateProject={handleUpdateProject}
          />
        )}

        {activeSubtab === 'intake' && (
          <IntakeBriefView
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            setActiveSubtab={setActiveSubtab}
          />
        )}

        {activeSubtab === 'editor' && (
          <DocumentEditorView
            project={activeProject}
            onUpdateProject={handleUpdateProject}
          />
        )}

        {activeSubtab === 'tasks' && (
          <TaskBoardView
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            setActiveSubtab={setActiveSubtab}
            onSelectTaskForAssist={(task) => setSelectedTaskForAssist(task)}
          />
        )}

        {activeSubtab === 'assistant' && (
          <CodingAssistantView
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            selectedTask={selectedTaskForAssist}
          />
        )}

        {activeSubtab === 'devpost' && (
          <LearnAiBasicsView
            project={activeProject}
            onUpdateProject={handleUpdateProject}
          />
        )}
      </main>

      {/* Create New Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Hammer className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Create New AI Project</h3>
              </div>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Project Name *</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  placeholder="e.g. EcoRoute Planner"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={newProjectTagline}
                  onChange={e => setNewProjectTagline(e.target.value)}
                  placeholder="e.g. Fuel-efficient EV routing with real-time solar elevation"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Audience</label>
                <input
                  type="text"
                  value={newProjectAudience}
                  onChange={e => setNewProjectAudience(e.target.value)}
                  placeholder="e.g. Urban commuters and EV fleet operators"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Problem Being Solved</label>
                <textarea
                  rows={2}
                  value={newProjectProblem}
                  onChange={e => setNewProjectProblem(e.target.value)}
                  placeholder="Describe the challenge or inefficiency users encounter..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Proposed AI Solution</label>
                <textarea
                  rows={2}
                  value={newProjectSolution}
                  onChange={e => setNewProjectSolution(e.target.value)}
                  placeholder="How will your AI-assisted application solve this problem?"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewProject}
                disabled={!newProjectName.trim()}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
              >
                Create Project Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
