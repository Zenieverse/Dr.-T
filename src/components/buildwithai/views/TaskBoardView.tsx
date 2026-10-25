import React, { useState } from 'react';
import { BuildWithAiProject, ProjectTask, TaskPriority, TaskStatus } from '../types';
import { 
  Kanban, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Code2, 
  Filter, 
  Trash2, 
  MoreVertical,
  Flame,
  Check
} from 'lucide-react';

interface TaskBoardViewProps {
  project: BuildWithAiProject;
  onUpdateProject: (updated: BuildWithAiProject) => void;
  setActiveSubtab: (subtab: string) => void;
  onSelectTaskForAssist?: (task: ProjectTask) => void;
}

const COLUMNS: Array<{ id: TaskStatus; label: string; color: string; badgeBg: string }> = [
  { id: 'backlog', label: 'Backlog', color: 'slate', badgeBg: 'bg-slate-100 text-slate-700' },
  { id: 'ready', label: 'Ready', color: 'blue', badgeBg: 'bg-blue-100 text-blue-800' },
  { id: 'in_progress', label: 'In Progress', color: 'amber', badgeBg: 'bg-amber-100 text-amber-800' },
  { id: 'testing', label: 'Testing', color: 'purple', badgeBg: 'bg-purple-100 text-purple-800' },
  { id: 'done', label: 'Done', color: 'emerald', badgeBg: 'bg-emerald-100 text-emerald-800' },
  { id: 'blocked', label: 'Blocked', color: 'rose', badgeBg: 'bg-rose-100 text-rose-800' }
];

export const TaskBoardView: React.FC<TaskBoardViewProps> = ({
  project,
  onUpdateProject,
  setActiveSubtab,
  onSelectTaskForAssist
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDesc, setNewTaskDesc] = useState<string>('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('high');
  const [newTaskHours, setNewTaskHours] = useState<number>(3);
  const [newTaskCriteria, setNewTaskCriteria] = useState<string>('');
  const [newTaskTest, setNewTaskTest] = useState<string>('');

  const filteredTasks = project.tasks.filter(t => {
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  const handleMoveTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = project.tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, status: newStatus };
      }
      return t;
    });

    onUpdateProject({
      ...project,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString()
    });
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Delete this task?')) {
      const updatedTasks = project.tasks.filter(t => t.id !== taskId);
      onUpdateProject({
        ...project,
        tasks: updatedTasks,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: ProjectTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      priority: newTaskPriority,
      status: 'ready',
      stage: project.stage,
      estimatedHours: newTaskHours,
      acceptanceCriteria: newTaskCriteria.split('\n').map(s => s.trim()).filter(Boolean),
      testExpectations: newTaskTest.trim() || 'Unit and integration tests pass.'
    };

    onUpdateProject({
      ...project,
      tasks: [...project.tasks, newTask],
      updatedAt: new Date().toISOString()
    });

    // Reset form
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskCriteria('');
    setNewTaskTest('');
    setIsAddingTask(false);
  };

  return (
    <div className="space-y-6">
      {/* Task Header & Controls */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <Kanban className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Sprint Kanban Board</h3>
            <p className="text-xs text-slate-500">
              {project.tasks.length} tasks derived from {project.name} specification
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Priority Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <button
            onClick={() => setIsAddingTask(true)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center space-x-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* New Task Inline Modal/Form */}
      {isAddingTask && (
        <div className="p-5 rounded-3xl bg-indigo-50/70 border border-indigo-200 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950">
              Create Implementation Task
            </h4>
            <button
              onClick={() => setIsAddingTask(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Task Title *</label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Implement deterministic emergency escalation"
                className="w-full p-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Priority</label>
              <select
                value={newTaskPriority}
                onChange={e => setNewTaskPriority(e.target.value as TaskPriority)}
                className="w-full p-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="critical">Critical (Blocking MVP)</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Description</label>
              <textarea
                rows={2}
                value={newTaskDesc}
                onChange={e => setNewTaskDesc(e.target.value)}
                placeholder="Technical details, file targets, and expected logic..."
                className="w-full p-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Acceptance Criteria (one per line)</label>
              <textarea
                rows={2}
                value={newTaskCriteria}
                onChange={e => setNewTaskCriteria(e.target.value)}
                placeholder="BP >= 180 triggers ambulance&#10;Disclaims diagnosis"
                className="w-full p-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Test Expectations</label>
              <input
                type="text"
                value={newTaskTest}
                onChange={e => setNewTaskTest(e.target.value)}
                placeholder="e.g. npm test exits with code 0"
                className="w-full p-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setIsAddingTask(false)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTask}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
            >
              Add Task to Ready
            </button>
          </div>
        </div>
      )}

      {/* Kanban Columns (Horizontal Scrollable on mobile, 6 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 min-h-[500px]">
        {COLUMNS.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);

          return (
            <div
              key={col.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col space-y-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-xs text-slate-800">{col.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${col.badgeBg}`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="flex-1 space-y-2.5 overflow-y-auto">
                {colTasks.map(task => {
                  const priorityColor = 
                    task.priority === 'critical' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                    task.priority === 'high' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                    task.priority === 'medium' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    'bg-slate-100 text-slate-700 border-slate-200';

                  return (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 hover:border-indigo-400 transition"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${priorityColor}`}>
                          {task.priority}
                        </span>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-slate-400 hover:text-rose-600 transition p-0.5"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <h5 className="font-bold text-xs text-slate-900 leading-snug">
                        {task.title}
                      </h5>

                      {task.description && (
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
                        <div className="text-[10px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-100">
                          <span className="font-bold block text-slate-600">Acceptance:</span>
                          <span className="line-clamp-1 italic">{task.acceptanceCriteria[0]}</span>
                        </div>
                      )}

                      {/* Card Actions Footer */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <button
                          onClick={() => {
                            if (onSelectTaskForAssist) {
                              onSelectTaskForAssist(task);
                            }
                            setActiveSubtab('assistant');
                          }}
                          className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1"
                          title="Ask AI Coding Assistant for prompts and test cases"
                        >
                          <Code2 className="w-3 h-3" />
                          <span>Code Assist</span>
                        </button>

                        {/* Move status picker */}
                        <select
                          value={task.status}
                          onChange={e => handleMoveTaskStatus(task.id, e.target.value as TaskStatus)}
                          className="text-[10px] border border-slate-200 rounded px-1 py-0.5 bg-slate-50 focus:outline-none"
                        >
                          <option value="backlog">Backlog</option>
                          <option value="ready">Ready</option>
                          <option value="in_progress">In Progress</option>
                          <option value="testing">Testing</option>
                          <option value="done">Done</option>
                          <option value="blocked">Blocked</option>
                        </select>
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="py-8 text-center text-slate-400 text-[11px] italic">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
