import React, { useState } from 'react';
import { 
  Heart, 
  Plus, 
  Check, 
  Trash2, 
  BookOpen, 
  Award, 
  Play, 
  CheckSquare, 
  ListTodo, 
  Calendar, 
  Layers, 
  Leaf, 
  Settings, 
  Users, 
  AlertTriangle,
  FolderPlus
} from 'lucide-react';
import { 
  MedLog, 
  HealthMetric, 
  SkillNode, 
  TaskItem, 
  CalendarEvent, 
  SmartNote, 
  CarbonHabit 
} from '../types';

interface TrackersProps {
  medicationList: MedLog[];
  toggleMedication: (id: string) => void;
  onAddMedication: (name: string, dosage: string, time: string) => void;
  healthMetrics: HealthMetric[];
  onAddMetric: (type: any, value: string) => void;
  skillNodes: SkillNode[];
  onAdvanceSkill: (id: string) => void;
  tasks: TaskItem[];
  onAddTask: (title: string, priority: any) => void;
  onToggleTaskState: (id: string) => void;
  onDeleteTask: (id: string) => void;
  calendarEvents: CalendarEvent[];
  onAddEvent: (title: string, time: string, type: any) => void;
  smartNotes: SmartNote[];
  onAddNote: (title: string, content: string, tag: string) => void;
  onDeleteNote: (id: string) => void;
  carbonHabits: CarbonHabit[];
  onToggleCarbonHabit: (id: string) => void;
}

export const Trackers: React.FC<TrackersProps> = ({
  medicationList,
  toggleMedication,
  onAddMedication,
  healthMetrics,
  onAddMetric,
  skillNodes,
  onAdvanceSkill,
  tasks,
  onAddTask,
  onToggleTaskState,
  onDeleteTask,
  calendarEvents,
  onAddEvent,
  smartNotes,
  onAddNote,
  onDeleteNote,
  carbonHabits,
  onToggleCarbonHabit
}) => {
  // Navigation inside the ecosystems
  const [activeEcosystem, setActiveEcosystem] = useState<'health' | 'education' | 'productivity' | 'sustainability' | 'family'>('health');
  const [householdSimActive, setHouseholdSimActive] = useState(false);

  // Input states
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('');
  const [newMedTime, setNewMedTime] = useState('08:00 AM');

  const [metricValue, setMetricValue] = useState('');
  const [metricType, setMetricType] = useState<any>('Blood Pressure');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('10:00 AM');
  const [newEventType, setNewEventType] = useState<any>('workspace');

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTag, setNoteTag] = useState('Life');

  // Interactive Quiz drill states
  const [quizNode, setQuizNode] = useState<SkillNode | null>(null);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Carbon totals
  const activeCarbonSaved = carbonHabits
    .filter(h => h.active)
    .reduce((acc, current) => acc + current.points, 0);

  const startSkillQuiz = (node: SkillNode) => {
    setQuizNode(node);
    setQuizAnswer('');
    setQuizScore(null);
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizAnswer.trim()) return;
    
    // Simple Socratic simulation
    setQuizScore(100);
    if (quizNode) {
      onAdvanceSkill(quizNode.id);
    }
  };

  return (
    <div className="bg-white/80 border border-stone-200/60 rounded-3xl overflow-hidden shadow-xs flex flex-col min-h-[580px]" id="trackers-ecosystem-suite">
      
      {/* Tab bar header */}
      <div className="bg-stone-50 border-b border-stone-150 p-2 flex flex-wrap gap-1.5 justify-center sm:justify-start z-10">
        <button
          onClick={() => setActiveEcosystem('health')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
            ${activeEcosystem === 'health' 
              ? 'bg-rose-500 text-white shadow-xs' 
              : 'text-stone-500 hover:text-stone-800'
            }
          `}
        >
          <Heart className="w-3.5 h-3.5" /> Healthcare
        </button>
        <button
          onClick={() => setActiveEcosystem('education')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
            ${activeEcosystem === 'education' 
              ? 'bg-blue-500 text-white shadow-xs' 
              : 'text-stone-500 hover:text-stone-800'
            }
          `}
        >
          <BookOpen className="w-3.5 h-3.5" /> Adaptive Education
        </button>
        <button
          onClick={() => setActiveEcosystem('productivity')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
            ${activeEcosystem === 'productivity' 
              ? 'bg-purple-500 text-white shadow-xs' 
              : 'text-stone-500 hover:text-stone-800'
            }
          `}
        >
          <ListTodo className="w-3.5 h-3.5" /> Productivity
        </button>
        <button
          onClick={() => setActiveEcosystem('sustainability')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
            ${activeEcosystem === 'sustainability' 
              ? 'bg-emerald-500 text-white shadow-xs' 
              : 'text-stone-500 hover:text-stone-800'
            }
          `}
        >
          <Leaf className="w-3.5 h-3.5" /> Sustainability
        </button>
        <button
          onClick={() => setActiveEcosystem('family')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
            ${activeEcosystem === 'family' 
              ? 'bg-indigo-500 text-white shadow-xs' 
              : 'text-stone-500 hover:text-stone-800'
            }
          `}
        >
          <Users className="w-3.5 h-3.5" /> Household & Family
        </button>
      </div>

      {/* Main active sub-view */}
      <div className="p-6 flex-1 flex flex-col gap-5 z-10">
        
        {/* VIEW 1: HEALTHCARE ECOSYSTEM */}
        {activeEcosystem === 'health' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {/* Med tracker */}
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="font-extrabold text-stone-800 text-sm flex items-center gap-2">
                  <span>💊</span> Daily Medication Log
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  Check off daily vitamins or clinical recommendations. Dr. T alerts you on missed slots.
                </p>
              </div>

              {/* Medication Add form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newMedName.trim() || !newMedDose.trim()) return;
                  onAddMedication(newMedName, newMedDose, newMedTime);
                  setNewMedName('');
                  setNewMedDose('');
                }}
                className="flex flex-wrap gap-2"
              >
                <input
                  type="text"
                  required
                  placeholder="Medication name..."
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="bg-white border border-stone-200 rounded-xl p-2 text-xs flex-1 outline-none min-w-[120px]"
                />
                <input
                  type="text"
                  required
                  placeholder="e.g. 500mg, 1 tablet"
                  value={newMedDose}
                  onChange={(e) => setNewMedDose(e.target.value)}
                  className="bg-white border border-stone-200 rounded-xl p-2 text-xs w-[120px] outline-none"
                />
                <select
                  value={newMedTime}
                  onChange={(e) => setNewMedTime(e.target.value)}
                  className="bg-white border border-stone-200 rounded-xl p-1.5 text-xs text-stone-700 cursor-pointer"
                >
                  <option>08:00 AM</option>
                  <option>12:00 PM</option>
                  <option>06:00 PM</option>
                  <option>09:00 PM</option>
                </select>
                <button
                  type="submit"
                  className="bg-stone-900 text-white rounded-xl p-2.5 hover:bg-stone-850 active:scale-95 transition-all text-xs font-bold leading-none select-none cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Meds Checklist */}
              <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                {medicationList.map((med) => (
                  <div 
                    key={med.id}
                    onClick={() => toggleMedication(med.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all
                      ${med.taken 
                        ? 'border-emerald-200 bg-emerald-50/20 text-stone-400' 
                        : 'border-stone-150 bg-white hover:border-rose-250 hover:bg-stone-50/30'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all
                        ${med.taken 
                          ? 'border-emerald-500 bg-emerald-500 text-white' 
                          : 'border-stone-300 bg-white'
                        }
                      `}>
                        {med.taken && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <p className={`text-xs font-extrabold ${med.taken ? 'line-through opacity-70' : 'text-stone-800'}`}>{med.name}</p>
                        <p className="text-[10px] text-stone-400 font-mono mt-0.5">{med.dosage} • Expected {med.time}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded
                      ${med.taken ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}
                    `}>
                      {med.taken ? 'COMPLETED' : 'PENDING'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Logs */}
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="font-extrabold text-stone-800 text-sm flex items-center gap-2">
                  <span>🩺</span> Critical Health Metrics
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  Monitor vital signals. Alerts triggers dynamically if measurements violate stable bounds.
                </p>
              </div>

              {/* Log Metric form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!metricValue.trim()) return;
                  onAddMetric(metricType, metricValue);
                  setMetricValue('');
                }}
                className="flex gap-2"
              >
                <select
                  value={metricType}
                  onChange={(e) => setMetricType(e.target.value as any)}
                  className="bg-white border border-stone-200 rounded-xl p-2 text-xs font-semibold text-stone-700 cursor-pointer flex-1"
                >
                  <option>Blood Pressure</option>
                  <option>Heart Rate</option>
                  <option>Sleep</option>
                  <option>Steps</option>
                  <option>Blood Sugar</option>
                </select>
                <input
                  type="text"
                  required
                  placeholder="e.g., 120/80 mmHg, 7.5 hrs"
                  value={metricValue}
                  onChange={(e) => setMetricValue(e.target.value)}
                  className="bg-white border border-stone-200 rounded-xl p-2 text-xs w-[150px] outline-none"
                />
                <button
                  type="submit"
                  className="bg-rose-500 text-white font-bold p-2 px-3 rounded-xl transition-all hover:bg-rose-600 active:scale-95 text-xs cursor-pointer select-none"
                >
                  LOG VITAL
                </button>
              </form>

              {/* Metrics Log entries */}
              <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {healthMetrics.map((met) => (
                  <div key={met.id} className="p-3 bg-stone-50 border border-stone-200/60 rounded-xl flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-stone-400 font-mono font-bold tracking-wider uppercase">{met.type}</p>
                      <p className="text-sm font-black text-stone-800 mt-1">{met.value}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-[9px] text-stone-400 font-mono">{met.date}</span>
                      <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded-full uppercase
                        ${met.status === 'optimal' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}
                      `}>
                        {met.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ADAPTIVE EDUCATION ECOSYSTEM */}
        {activeEcosystem === 'education' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            {/* Curriculum explanation */}
            <div className="md:col-span-1 flex flex-col gap-4">
              <div>
                <h4 className="font-extrabold text-stone-800 text-sm flex items-center gap-2">
                  <span>🎓</span> Adaptive Skill Map
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                  Every curriculum is custom tailored by Dr. T. Click a skill nodes to challenge your Socratic voice quiz and earn growth points.
                </p>
              </div>

              {/* Progress summary widget */}
              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl">
                <span className="text-[10px] font-bold font-mono text-blue-600 uppercase flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> ACADEMIC FLOURISHING STATUS
                </span>
                <p className="text-xl font-black text-blue-900 mt-1.5">
                  Level 14 Polyglot
                </p>
                <div className="w-full bg-blue-200/40 h-2 rounded-full overflow-hidden mt-2 relative">
                  <div className="absolute top-0 left-0 bg-blue-500 h-full w-[65%]" />
                </div>
                <p className="text-[10px] text-blue-700 mt-1 leading-snug">65% of Socratic competencies achieved. Next: Advanced Biostatistics.</p>
              </div>
            </div>

            {/* Tree nodes list */}
            <div className="md:col-span-1 flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
              <span className="text-[9px] font-mono tracking-widest text-stone-400 font-bold uppercase">Socratic Modules</span>
              {skillNodes.map((skill) => (
                <div 
                  key={skill.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all
                    ${skill.level === 2 
                      ? 'border-emerald-200 bg-emerald-50/10' 
                      : skill.level === 1 
                        ? 'border-blue-250 bg-blue-50/15' 
                        : 'border-stone-150 bg-stone-50/40 opacity-70'
                    }
                  `}
                >
                  <div>
                    <p className="text-xs font-bold text-stone-800">{skill.label}</p>
                    <p className="text-[10px] text-stone-400 font-mono mt-0.5">{skill.category} • {skill.quizPoints} pts</p>
                  </div>
                  
                  {skill.level === 2 ? (
                    <span className="text-[8px] font-extrabold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">MASTERED</span>
                  ) : skill.level === 1 ? (
                    <button
                      onClick={() => startSkillQuiz(skill)}
                      className="p-1 px-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold text-[10px] cursor-pointer flex items-center gap-1"
                    >
                      <Play className="w-2.5 h-2.5" /> DRILL
                    </button>
                  ) : (
                    <span className="text-[8px] font-bold text-stone-400">LOCKED</span>
                  )}
                </div>
              ))}
            </div>

            {/* Active Quiz assessment frame */}
            <div className="md:col-span-1 bg-stone-900 border border-stone-850 rounded-2xl p-4 text-white flex flex-col justify-between">
              {quizNode ? (
                <form onSubmit={handleQuizSubmit} className="flex flex-col gap-3 flex-1 h-full">
                  <div className="border-b border-stone-800 pb-2">
                    <span className="text-[9px] text-emerald-450 font-mono font-bold uppercase">ACTIVE DRILL</span>
                    <p className="text-xs font-bold text-stone-200 mt-1">{quizNode.label}</p>
                    <p className="text-[10px] text-stone-400 leading-snug mt-1">{quizNode.description}</p>
                  </div>

                  {quizScore !== null ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                      <span className="text-3xl">🎉</span>
                      <p className="text-xs font-bold text-emerald-400 mt-2">Evaluation: 100% Correct!</p>
                      <p className="text-[10px] text-stone-300 leading-relaxed mt-1">Excellent interdisciplinary reasoning, sweet child! Growth points logged to your personal profile.</p>
                      <button
                        type="button"
                        onClick={() => setQuizNode(null)}
                        className="bg-stone-800 hover:bg-stone-750 text-white rounded-lg p-1.5 px-3 uppercase font-mono text-[9px] font-bold mt-4 cursor-pointer"
                      >
                        CLOSE ASSIGNMENT
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-[9px] font-mono uppercase text-stone-400">Socratic Query response</label>
                        <textarea
                          required
                          rows={3}
                          value={quizAnswer}
                          onChange={(e) => setQuizAnswer(e.target.value)}
                          placeholder="Type your explanation or argue here..."
                          className="bg-stone-950 border border-stone-800 text-stone-300 text-xs rounded-xl p-2 outline-none focus:border-rose-500 resize-none flex-1"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] uppercase rounded-xl transition-all cursor-pointer"
                      >
                        SUBMIT FOR AUDIO ANALYSIS
                      </button>
                    </>
                  )}
                </form>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-3 text-stone-500 font-mono text-[10px] italic">
                  Select "Drill" next to any unlocked skill node on the left to activate Socratic verbal evaluations.
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: PRODUCTIVITY WORKSPACE */}
        {activeEcosystem === 'productivity' && (
          <div className="grid grid-cols-1 md:grid-cols-11 gap-6 animate-fadeIn">
            {/* Columns split: Kanban list (first 5 of 11) */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div>
                <h4 className="font-extrabold text-stone-800 text-sm flex items-center gap-2">
                  <span>📋</span> Tasks & Actions
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  Manage projects and chores smoothly. Click a task to cycle state.
                </p>
              </div>

              {/* Task Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newTaskTitle.trim()) return;
                  onAddTask(newTaskTitle, newTaskPriority);
                  setNewTaskTitle('');
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  required
                  placeholder="Create task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="bg-white border border-stone-200 rounded-xl p-2 text-xs flex-1 outline-none"
                />
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="bg-white border border-stone-200 rounded-xl p-1 text-xs text-stone-700 cursor-pointer font-bold"
                >
                  <option value="low">Low</option>
                  <option value="medium">Med</option>
                  <option value="high">High</option>
                </select>
                <button
                  type="submit"
                  className="bg-stone-900 text-white font-bold p-2 px-3 rounded-xl transition-all hover:bg-stone-850 text-xs cursor-pointer select-none"
                >
                  ADD
                </button>
              </form>

              {/* Tasks List */}
              <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                {tasks.map((task) => (
                  <div 
                    key={task.id}
                    onClick={() => onToggleTaskState(task.id)}
                    className="p-2.5 bg-white border border-stone-150 rounded-xl hover:border-purple-300 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-3 h-3 rounded-full shrink-0
                        ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'in_progress' ? 'bg-amber-400 animate-pulse' : 'bg-stone-300'}
                      `}></div>
                      <span className={`text-xs font-bold leading-none truncate ${task.status === 'done' ? 'line-through text-stone-400' : ''}`}>
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[8px] font-mono font-bold px-1 rounded uppercase
                        ${task.priority === 'high' ? 'bg-red-50 text-red-700 border border-red-100' : task.priority === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-stone-100/80 text-stone-500'}
                      `}>
                        {task.priority}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask(task.id);
                        }}
                        className="p-1 text-stone-400 hover:text-red-500 hover:bg-stone-50 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Calendar (middle 3 of 11) */}
            <div className="md:col-span-3 flex flex-col gap-4">
              <div>
                <h4 className="font-extrabold text-stone-800 text-sm flex items-center gap-2">
                  <span>📅</span> Dynamic Schedule
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  Synchronized agenda.
                </p>
              </div>

              {/* Add event form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newEventTitle.trim()) return;
                  onAddEvent(newEventTitle, newEventTime, newEventType);
                  setNewEventTitle('');
                }}
                className="flex flex-col gap-2 bg-stone-50 border border-stone-150 p-2.5 rounded-xl text-xs"
              >
                <input
                  type="text"
                  required
                  placeholder="Event title..."
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="bg-white border border-stone-200 rounded-lg p-1.5 text-xs outline-none"
                />
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    required
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="bg-white border border-stone-200 rounded-lg p-1 text-[10px] outline-none"
                  />
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as any)}
                    className="bg-white border border-stone-200 rounded-lg p-1 text-[10px] cursor-pointer"
                  >
                    <option value="medical">🩺 Med</option>
                    <option value="workspace">💼 Work</option>
                    <option value="learning">🎓 Learn</option>
                    <option value="personal">💐 Priv</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-850 text-white p-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer select-none"
                >
                  ADD AGENDA
                </button>
              </form>

              {/* Agenda lists */}
              <div className="flex flex-col gap-1.5 max-h-[170px] overflow-y-auto pr-1">
                {calendarEvents.map((evt) => (
                  <div key={evt.id} className="p-2 bg-white border border-stone-200/60 rounded-xl flex flex-col justify-between">
                    <p className="text-[9px] font-mono text-stone-400">{evt.time}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-[14px] rounded-full shrink-0
                        ${evt.type === 'medical' ? 'bg-red-500' : evt.type === 'workspace' ? 'bg-blue-500' : evt.type === 'learning' ? 'bg-amber-400' : 'bg-purple-500'}
                      `}></span>
                      <span className="text-[11px] font-extrabold text-stone-850 truncate leading-none">{evt.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Note Editor (last 3 of 11) */}
            <div className="md:col-span-3 flex flex-col gap-4">
              <div>
                <h4 className="font-extrabold text-stone-800 text-sm flex items-center gap-2">
                  <span>📓</span> Smart Notes Vault
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  Cooperating document processor.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Note Header..."
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="bg-white border border-stone-200 rounded-lg p-1.5 text-xs font-bold text-stone-800 outline-none"
                />
                <textarea
                  placeholder="Markdown or standard logs..."
                  rows={2}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="bg-white border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 outline-none resize-none"
                />
                <div className="flex gap-2">
                  <select
                    value={noteTag}
                    onChange={(e) => setNoteTag(e.target.value)}
                    className="bg-white border border-stone-200 rounded-lg p-1 text-[10px] cursor-pointer text-stone-600 flex-1"
                  >
                    <option>Life</option>
                    <option>Health</option>
                    <option>Business</option>
                    <option>Legal</option>
                  </select>
                  <button
                    onClick={() => {
                      if (!noteTitle.trim()) return;
                      onAddNote(noteTitle, noteContent, noteTag);
                      setNoteTitle('');
                      setNoteContent('');
                    }}
                    className="bg-purple-500 hover:bg-purple-600 text-white p-1 px-3.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                  >
                    SAVE Note
                  </button>
                </div>
              </div>

              {/* Note records list */}
              <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                {smartNotes.map((note) => (
                  <div key={note.id} className="p-2 border border-stone-150 hover:border-purple-250 bg-white rounded-xl flex items-center justify-between font-sans">
                    <div className="truncate">
                      <p className="text-xs font-bold text-stone-850 truncate">{note.title}</p>
                      <p className="text-[9px] text-stone-400 font-mono mt-0.5 truncate">{note.tag} • {note.updatedAt}</p>
                    </div>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1 text-stone-400 hover:text-red-500 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Expanded Wizard Section for Passport Renewal and Local Commuter Transport Planner */}
            <div className="md:col-span-11 mt-4 border-t border-stone-150 pt-5 pr-1 flex flex-col gap-3.5" id="passport-transit-blueprint-wizard">
              <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 flex flex-col gap-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-purple-650 uppercase flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                      </span>
                      Mrs. Know-All's Travel & Passport Blueprint
                    </span>
                    <h4 className="font-extrabold text-stone-800 text-sm mt-0.5">Passport Renewal & Local Commuter Transport Planner</h4>
                  </div>
                  <button
                    onClick={() => {
                      const templateTasks = [
                        { title: 'Complete application DS-82 Form (Passport Renewal)', priority: 'high' },
                        { title: 'Take compliant 2x2 passport-spec photographs', priority: 'high' },
                        { title: 'Mail old passport, DS-82 Form, and payment check via USPS certified mail', priority: 'medium' },
                        { title: 'Plan metro transit schedule & calculate local ticket fares', priority: 'medium' },
                        { title: 'Download municipal commuter transit card & pre-load $25', priority: 'low' }
                      ];
                      
                      // Inject each task that doesn't exist
                      templateTasks.forEach(t => {
                        if (!tasks.some(existing => existing.title.toLowerCase().includes(t.title.toLowerCase()))) {
                          onAddTask(t.title, t.priority as any);
                        }
                      });

                      // Inject notes if not exist
                      const noteTitle = 'Passport & Local Transport Map';
                      if (!smartNotes.some(n => n.title.toLowerCase().includes(noteTitle.toLowerCase()))) {
                        const noteContent = '### 🛂 Passport Renewal Checklist\n\n1. **Application:** Download & complete Form DS-82 (Renewal by Mail).\n2. **Photo:** 2x2 inches, white background, color, high-res, neutral face, no glasses.\n3. **Documents:** Current physical passport, DS-82 signature page, certified marriage/name change cert (if applicable).\n4. **Fees:** Check or money order for $130 (Standard) or $190 (Expedited) payable to "U.S. Department of State".\n5. **Mailing:** Place in a padded envelope. Send via trackable USPS (Priority/Priority Express) to the National Passport Processing Center.\n\n---\n\n### 🚇 Local Commuter Transport blueprint\n\n- **Route:** Take Metro **Blue Line** towards Downtown Exchange from Central Boulevard Gate.\n- **Disembark:** Civic Center Station (Exit B).\n- **Alternative Transit:** Bus Route 310 (Express) operates every 10 mins; fare is $2.25.\n- **Commuter Pass:** $7.50 for a full Unlimited Day-Pass (highly cost-effective for multi-stop errands).\n- **Application:** Commuter Transit app for automated real-time boarding alarms.';
                        onAddNote(noteTitle, noteContent, 'Life');
                      }

                      // Inject the calendar event if not exist
                      if (!calendarEvents.some(e => e.title.includes('USPS Mailing Appointment'))) {
                        onAddEvent('USPS Mailing Appointment (Passport Renewal)', 'Next Tuesday @ 11:00 AM', 'workspace');
                      }
                    }}
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-250 text-purple-700 font-bold rounded-xl text-[10.5px] transition-all cursor-pointer font-mono uppercase flex items-center gap-1.5 shrink-0 select-none"
                  >
                    🚀 Reload Blueprint Items
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                  {/* Passport Progress section */}
                  <div className="p-3 bg-white border border-stone-150 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-800 text-[11px] font-extrabold flex items-center gap-1.5">
                        <span>🛂 Passport Renewal Status</span>
                      </span>
                      <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-100 rounded-md px-1.5 py-0.5 uppercase font-mono font-bold">
                        {tasks.filter(t => t.title.toLowerCase().includes('passport') && t.status === 'done').length}/3 DONE
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 pt-1.5 border-t border-stone-100">
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`w-2 h-2 rounded-full ${tasks.some(t => t.title.toLowerCase().includes('ds-82') && t.status === 'done') ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                        <span className={`${tasks.some(t => t.title.toLowerCase().includes('ds-82') && t.status === 'done') ? 'line-through text-stone-400' : 'text-stone-600'} font-bold`}>
                          Form DS-82 completed
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`w-2 h-2 rounded-full ${tasks.some(t => t.title.toLowerCase().includes('spec photographs') && t.status === 'done') ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                        <span className={`${tasks.some(t => t.title.toLowerCase().includes('spec photographs') && t.status === 'done') ? 'line-through text-stone-400' : 'text-stone-600'} font-bold`}>
                          Biometric 2x2 photos taken
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`w-2 h-2 rounded-full ${tasks.some(t => t.title.toLowerCase().includes('certified mail') && t.status === 'done') ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                        <span className={`${tasks.some(t => t.title.toLowerCase().includes('certified mail') && t.status === 'done') ? 'line-through text-stone-400' : 'text-stone-600'} font-bold`}>
                          USPS certified mailing processed
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Local Transport section */}
                  <div className="p-3 bg-white border border-stone-150 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-800 text-[11px] font-extrabold flex items-center gap-1.5">
                        <span>🚇 Local Transport Status</span>
                      </span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md px-1.5 py-0.5 uppercase font-mono font-bold">
                        {tasks.filter(t => t.title.toLowerCase().includes('transit') && t.status === 'done').length}/2 DONE
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-1.5 border-t border-stone-100">
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`w-2 h-2 rounded-full ${tasks.some(t => t.title.toLowerCase().includes('transit schedule') && t.status === 'done') ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                        <span className={`${tasks.some(t => t.title.toLowerCase().includes('transit schedule') && t.status === 'done') ? 'line-through text-stone-400' : 'text-stone-600'} font-bold`}>
                          Blue Line timetable and fares calculated
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`w-2 h-2 rounded-full ${tasks.some(t => t.title.toLowerCase().includes('pre-load') && t.status === 'done') ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                        <span className={`${tasks.some(t => t.title.toLowerCase().includes('pre-load') && t.status === 'done') ? 'line-through text-stone-400' : 'text-stone-600'} font-bold`}>
                          Municipal transit app loaded with $25
                        </span>
                      </div>
                      <p className="text-[9.5px] text-stone-400 italic">
                        💡 Tip: You can check details or read resources directly inside the "Passport & Local Transport Map" note in your smart notes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: SUSTAINABILITY LAYER */}
        {activeEcosystem === 'sustainability' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {/* Habits list */}
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="font-extrabold text-stone-800 text-sm flex items-center gap-2">
                  <span>🍃</span> Sustainable Habits Checklist
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  Commit carbon-saving habits daily. Track real-time progress to watch your ecological footprint reduction.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                {carbonHabits.map((habit) => (
                  <div 
                    key={habit.id}
                    onClick={() => onToggleCarbonHabit(habit.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all
                      ${habit.active 
                        ? 'border-emerald-200 bg-emerald-50/20 text-stone-400' 
                        : 'border-stone-150 bg-white hover:border-emerald-350 hover:bg-stone-50/20'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all
                        ${habit.active 
                          ? 'border-emerald-500 bg-emerald-500 text-white' 
                          : 'border-stone-300 bg-white'
                        }
                      `}>
                        {habit.active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <p className={`text-xs font-extrabold ${habit.active ? 'text-stone-500 italic' : 'text-stone-800'}`}>{habit.title}</p>
                        <p className="text-[9px] text-stone-400 font-mono mt-0.5">Focus segment: {habit.category}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded
                      ${habit.active ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}
                    `}>
                      +{habit.points} kg CO2/saved
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations & graphs */}
            <div className="flex flex-col gap-4 justify-between">
              <div>
                <h4 className="font-extrabold text-stone-800 text-sm flex items-center gap-2">
                  <span>📊</span> Impact Quotient
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  Personal energy saving quotient integrated from active habits.
                </p>
              </div>

              {/* SVG visual carbon reduction orb */}
              <div className="p-5 bg-stone-900 border border-stone-800 text-white rounded-2xl flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden min-h-[180px]">
                {/* Glowing light */}
                <div className="absolute inset-0 bg-emerald-500/5 blur-3xl pointer-events-none"></div>
                <div className="relative w-24 h-24 rounded-full border border-emerald-500/40 flex flex-col items-center justify-center scale-102">
                  <div className="absolute inset-2 border border-dashed border-emerald-400/20 rounded-full animate-spin"></div>
                  <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase font-extrabold">Active saved</span>
                  <span className="text-xl font-black mt-0.5 text-stone-100">{activeCarbonSaved} KG</span>
                </div>
                <div>
                  <p className="text-xs font-extrabold text-emerald-450">Habits Compliance Level: Good</p>
                  <p className="text-[10px] text-stone-400 leading-snug mt-1">Sustaining these settings for 1 year offset emissions matching 18 complete standard pine trees!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: FAMILY & HOUSEHOLD MODULE */}
        {activeEcosystem === 'family' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            <div>
              <h4 className="font-extrabold text-stone-800 text-sm flex items-center gap-2">
                <span>👪</span> Household Configuration
              </h4>
              <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                Connect and coordinate schedules for parents, couples, children, or elderly grandparents. Dr. T manages medications and safety for the whole house.
              </p>

              {/* Members grid list */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="p-3 bg-white border border-stone-200/60 rounded-xl">
                  <p className="text-xs font-bold text-stone-850">Grandma Mary</p>
                  <p className="text-[9px] text-stone-400 mt-1">Caregiver • 78 yrs</p>
                  <span className="inline-block text-[8px] font-mono bg-red-50 text-red-700 font-extrabold rounded px-1.5 py-0.5 mt-2">Active Care alert</span>
                </div>
                <div className="p-3 bg-white border border-stone-200/60 rounded-xl">
                  <p className="text-xs font-bold text-stone-850">John (Son)</p>
                  <p className="text-[9px] text-stone-400 mt-1">Dependent • 12 yrs</p>
                  <span className="inline-block text-[8px] font-mono bg-blue-50 text-blue-700 font-extrabold rounded px-1.5 py-0.5 mt-2">Homework Drill setup</span>
                </div>
              </div>
            </div>

            {/* Safety & Emergency Drill check */}
            <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono font-extrabold text-amber-800 uppercase flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Household Emergency Plan
                </span>
                <p className="text-xs leading-relaxed text-amber-900 mt-1.5 font-bold">
                  Annual Storm & Wildfire Evacuation Drills
                </p>
                <p className="text-[10px] text-amber-800 mt-1 leading-snug">
                  Keep copy in safe repository box. Establish secondary communication points outside immediate municipal bounds. Ensure medication backups are loaded first.
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                {householdSimActive ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col gap-2 animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-[10px] uppercase font-mono">
                      <span>✓</span> Panic Protocol Test Active
                    </div>
                    <p className="text-[10px] text-emerald-700 leading-normal">
                      Local emergency panic sync simulated across all registered household members and Grandma's caretakers. Mock signal successfully routed.
                    </p>
                    <button
                      onClick={() => setHouseholdSimActive(false)}
                      className="text-left text-[9px] font-mono text-emerald-600 font-bold hover:underline cursor-pointer"
                    >
                      [ Dismiss test ]
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setHouseholdSimActive(true)}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-extrabold rounded-lg transition-all cursor-pointer shadow-xs"
                  >
                    🚀 TRIGGER HOUSEHOLD TEST PROTOCOL
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
export default Trackers;
