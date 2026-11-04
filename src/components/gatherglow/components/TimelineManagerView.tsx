import React, { useState } from 'react';
import { GatherEvent, TimelineTask, TaskMilestone, TaskStatus, TaskPriority, ThreeHatRoleType } from '../types';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Filter, 
  Flag, 
  AlertCircle,
  X,
  Compass
} from 'lucide-react';

interface TimelineManagerViewProps {
  event: GatherEvent;
  tasks: TimelineTask[];
  onSaveTask: (task: TimelineTask) => void;
  onDeleteTask: (taskId: string) => void;
}

const MILESTONES: Array<{ id: TaskMilestone; label: string }> = [
  { id: '6_months_plus', label: '6+ Months Prior' },
  { id: '3_months', label: '3 Months Prior' },
  { id: '1_month', label: '1 Month Prior' },
  { id: '2_weeks', label: '2 Weeks Prior' },
  { id: 'event_week', label: 'Event Week' },
  { id: 'day_of', label: 'Event Day Checklist' },
  { id: 'post_event', label: 'Post-Event Wrap Up' },
];

export const TimelineManagerView: React.FC<TimelineManagerViewProps> = ({
  event,
  tasks,
  onSaveTask,
  onDeleteTask
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar' | 'checklist' | 'deadlines'>('timeline');
  const [selectedMilestone, setSelectedMilestone] = useState<string>('all');
  const [selectedHat, setSelectedHat] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TimelineTask | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [milestone, setMilestone] = useState<TaskMilestone>('1_month');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignedPersonName, setAssignedPersonName] = useState('');
  const [assignedRoleTitle, setAssignedRoleTitle] = useState('');
  const [hatType, setHatType] = useState<ThreeHatRoleType>('professional');
  const [isEventDayChecklist, setIsEventDayChecklist] = useState(false);
  const [eventDayTime, setEventDayTime] = useState('');

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const completionPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const openAddModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setDueDate(event.date);
    setMilestone('1_month');
    setStatus('todo');
    setPriority('medium');
    setAssignedPersonName('');
    setAssignedRoleTitle('');
    setHatType('professional');
    setIsEventDayChecklist(false);
    setEventDayTime('');
    setIsModalOpen(true);
  };

  const openEditModal = (task: TimelineTask) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setMilestone(task.milestone);
    setStatus(task.status);
    setPriority(task.priority);
    setAssignedPersonName(task.assignedPersonName || '');
    setAssignedRoleTitle(task.assignedRoleTitle || '');
    setHatType(task.hatType);
    setIsEventDayChecklist(Boolean(task.isEventDayChecklist));
    setEventDayTime(task.eventDayTime || '');
    setIsModalOpen(true);
  };

  const toggleTaskStatus = (task: TimelineTask) => {
    const nextStatus: TaskStatus = task.status === 'completed' ? 'todo' : 'completed';
    onSaveTask({ ...task, status: nextStatus });
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: TimelineTask = {
      id: editingTask?.id || `task-${Date.now()}`,
      eventId: event.id,
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || event.date,
      milestone,
      status,
      priority,
      assignedPersonName: assignedPersonName.trim() || undefined,
      assignedRoleTitle: assignedRoleTitle.trim() || undefined,
      hatType,
      isEventDayChecklist,
      eventDayTime: eventDayTime.trim() || undefined
    };

    onSaveTask(newTask);
    setIsModalOpen(false);
  };

  const filteredTasks = tasks.filter(t => {
    if (selectedMilestone !== 'all' && t.milestone !== selectedMilestone) return false;
    if (selectedHat !== 'all' && t.hatType !== selectedHat) return false;
    return true;
  });

  const getHatBadge = (hat: ThreeHatRoleType) => {
    switch (hat) {
      case 'professional':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">🎩 Professional</span>;
      case 'personal':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">💖 Personal</span>;
      case 'social':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">🤝 Social</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Progress Bar */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Celebration Timeline & Task Board</h3>
            <p className="text-xs text-slate-500">
              Synchronized milestone schedule with Three Hats responsibility ownership
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs self-start sm:self-center transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Action Item</span>
          </button>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1 font-semibold text-slate-600">
            <span>Overall Planning Completion</span>
            <span>{completedCount} of {tasks.length} tasks completed ({completionPercent}%)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* View Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        <button
          onClick={() => setViewMode('timeline')}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            viewMode === 'timeline' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Milestone Timeline
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            viewMode === 'calendar' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Calendar View
        </button>
        <button
          onClick={() => setViewMode('checklist')}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            viewMode === 'checklist' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Checklist View
        </button>
        <button
          onClick={() => setViewMode('deadlines')}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            viewMode === 'deadlines' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Overdue & Upcoming Deadlines
        </button>
      </div>

      {/* Filters Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Milestone Filter */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-xl">
          <button
            onClick={() => setSelectedMilestone('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              selectedMilestone === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            All Milestones ({tasks.length})
          </button>
          {MILESTONES.map(m => {
            const count = tasks.filter(t => t.milestone === m.id).length;
            if (count === 0 && selectedMilestone !== m.id) return null;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMilestone(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedMilestone === m.id
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {m.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Hat Filter */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-center shrink-0 text-xs">
          <button
            onClick={() => setSelectedHat('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              selectedHat === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Hats
          </button>
          <button
            onClick={() => setSelectedHat('professional')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              selectedHat === 'professional' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎩 Professional
          </button>
          <button
            onClick={() => setSelectedHat('personal')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              selectedHat === 'personal' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💖 Personal
          </button>
          <button
            onClick={() => setSelectedHat('social')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              selectedHat === 'social' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🤝 Social
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-rose-600" />
              <span>Event Month Calendar View ({new Date(event.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })})</span>
            </h4>
            <span className="text-xs text-slate-500">Tasks plotted by due date</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="p-2 font-bold text-slate-500 bg-slate-50 rounded-lg">{d}</div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = (i % 31) + 1;
              const dateStr = `${event.date.slice(0, 8)}${String(dayNum).padStart(2, '0')}`;
              const dayTasks = tasks.filter(t => t.dueDate === dateStr);
              const isEventDay = event.date === dateStr;

              return (
                <div
                  key={i}
                  className={`min-h-[72px] p-1.5 rounded-xl border text-left flex flex-col justify-between transition-colors ${
                    isEventDay
                      ? 'border-rose-400 bg-rose-50/50'
                      : dayTasks.length > 0
                      ? 'border-slate-300 bg-white'
                      : 'border-slate-100 bg-slate-50/30'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className={`font-bold ${isEventDay ? 'text-rose-700' : 'text-slate-600'}`}>{dayNum}</span>
                    {isEventDay && <span className="text-[9px] uppercase font-black text-rose-600">🎉 Event</span>}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.map(t => (
                      <div
                        key={t.id}
                        onClick={() => toggleTaskStatus(t)}
                        className={`text-[9px] px-1 py-0.5 rounded font-medium truncate cursor-pointer ${
                          t.status === 'completed'
                            ? 'bg-slate-100 text-slate-400 line-through'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                        title={t.title}
                      >
                        {t.status === 'completed' ? '✓ ' : '• '}{t.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Checklist View */}
      {viewMode === 'checklist' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          <div className="p-4 bg-slate-50 font-bold text-xs text-slate-700 flex justify-between">
            <span>Fast Action Checklist ({tasks.length} items)</span>
            <span>Click circle to mark completed</span>
          </div>
          {tasks.map(task => (
            <div
              key={task.id}
              className={`p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors ${
                task.status === 'completed' ? 'opacity-60 bg-slate-50/30' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <button onClick={() => toggleTaskStatus(task)} className="text-slate-400 hover:text-emerald-600">
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </button>
                <span className={`text-xs font-semibold ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {task.title}
                </span>
                {task.priority === 'high' && (
                  <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    High
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <span className="font-mono text-[11px]">{task.dueDate}</span>
                {getHatBadge(task.hatType)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deadlines & Overdue View */}
      {viewMode === 'deadlines' && (
        <div className="space-y-6">
          {/* Overdue */}
          {(() => {
            const today = new Date().toISOString().slice(0, 10);
            const overdue = tasks.filter(t => t.status !== 'completed' && t.dueDate < today);
            const upcoming = tasks.filter(t => t.status !== 'completed' && t.dueDate >= today);
            const completed = tasks.filter(t => t.status === 'completed');

            return (
              <>
                <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm space-y-3">
                  <div className="flex items-center space-x-2 text-rose-700 font-bold text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Overdue Action Items ({overdue.length})</span>
                  </div>
                  {overdue.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No overdue action items! You are completely on schedule.</p>
                  ) : (
                    <div className="space-y-2">
                      {overdue.map(t => (
                        <div key={t.id} className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <button onClick={() => toggleTaskStatus(t)} className="text-rose-600"><Circle className="w-4 h-4" /></button>
                            <span className="font-bold text-slate-800">{t.title}</span>
                          </div>
                          <span className="font-mono text-rose-700 font-semibold">Due {t.dueDate}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Upcoming Deadlines ({upcoming.length})</span>
                  </div>
                  <div className="space-y-2">
                    {upcoming.map(t => (
                      <div key={t.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <button onClick={() => toggleTaskStatus(t)}><Circle className="w-4 h-4 text-slate-400" /></button>
                          <span className="font-semibold text-slate-800">{t.title}</span>
                        </div>
                        <span className="font-mono text-slate-500 font-medium">Due {t.dueDate}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed Milestones ({completed.length})</span>
                  </div>
                  <div className="space-y-2">
                    {completed.map(t => (
                      <div key={t.id} className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-between text-xs opacity-75">
                        <span className="line-through text-slate-500 font-medium">{t.title}</span>
                        <span className="font-mono text-emerald-700">Completed</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Default Timeline Task List */}
      {viewMode === 'timeline' && (
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs">
            No action items match the selected filter. Click "Add Action Item" to create one.
          </div>
        ) : (
          filteredTasks.map(task => {
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl bg-white border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
                  isCompleted ? 'border-slate-200 bg-slate-50/50 opacity-75' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  {/* Status Checkbox */}
                  <button
                    onClick={() => toggleTaskStatus(task)}
                    className="shrink-0 mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  {/* Task Details */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-sm font-bold ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.title}
                      </span>
                      {task.priority === 'high' && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          High Priority
                        </span>
                      )}
                      {task.isEventDayChecklist && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          {task.eventDayTime || 'Day-Of'}
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-0.5">
                      <span className="inline-flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Due: <strong>{task.dueDate}</strong></span>
                      </span>
                      {task.assignedPersonName && (
                        <span>
                          Owner: <strong>{task.assignedPersonName}</strong>
                          {task.assignedRoleTitle ? ` (${task.assignedRoleTitle})` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Hat & Actions */}
                <div className="flex items-center space-x-3 shrink-0 self-start sm:self-center">
                  {getHatBadge(task.hatType)}

                  <button
                    onClick={() => openEditModal(task)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete task "${task.title}"?`)) {
                        onDeleteTask(task.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      )}

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h4 className="font-bold text-base">
                {editingTask ? 'Edit Action Item' : 'New Timeline Task'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Conduct sound check with acoustic trio"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Task Description & Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Details, contacts, or items to double-check..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Milestone Stage
                  </label>
                  <select
                    value={milestone}
                    onChange={e => setMilestone(e.target.value as TaskMilestone)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    {MILESTONES.map(m => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Three Hats Domain
                  </label>
                  <select
                    value={hatType}
                    onChange={e => setHatType(e.target.value as ThreeHatRoleType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="professional">🎩 Professional Hat (Logistics/Vendor)</option>
                    <option value="personal">💖 Personal Hat (Wellbeing/Honoree)</option>
                    <option value="social">🤝 Social Hat (Guest Care/Community)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Assigned Person Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={assignedPersonName}
                    onChange={e => setAssignedPersonName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Day-Of Coordinator"
                    value={assignedRoleTitle}
                    onChange={e => setAssignedRoleTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEventDayChecklist}
                    onChange={e => setIsEventDayChecklist(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span>Feature on Event-Day Master Run-Sheet</span>
                </label>
                {isEventDayChecklist && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Event Day Scheduled Time / Phase
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 14:00 - Setup & Soundcheck"
                      value={eventDayTime}
                      onChange={e => setEventDayTime(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
