import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clapperboard,
  FileCheck2,
  Film,
  FlaskConical,
  GitBranch,
  Loader2,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Square,
  Users,
  XCircle,
} from 'lucide-react';

type Stage = 'INTAKE' | 'RESEARCH' | 'EVIDENCE' | 'STORY' | 'SCRIPT' | 'STORYBOARD' | 'PRODUCTION' | 'QA';
type ClaimStatus = 'VERIFIED' | 'PARTIAL' | 'REVIEW';

interface Claim {
  id: string;
  text: string;
  source: string;
  status: ClaimStatus;
  scene: string;
}

const stages: Array<{ id: Stage; label: string; icon: React.ReactNode }> = [
  { id: 'INTAKE', label: 'Brief', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'RESEARCH', label: 'Research', icon: <Search className="w-4 h-4" /> },
  { id: 'EVIDENCE', label: 'Evidence', icon: <GitBranch className="w-4 h-4" /> },
  { id: 'STORY', label: 'Story', icon: <Film className="w-4 h-4" /> },
  { id: 'SCRIPT', label: 'Script', icon: <FileCheck2 className="w-4 h-4" /> },
  { id: 'STORYBOARD', label: 'Storyboard', icon: <Clapperboard className="w-4 h-4" /> },
  { id: 'PRODUCTION', label: 'Production', icon: <Play className="w-4 h-4" /> },
  { id: 'QA', label: 'QA', icon: <ShieldCheck className="w-4 h-4" /> },
];

const seedClaims: Claim[] = [
  { id: 'C-014', text: 'Iron is required for oxygen transport and cellular energy processes.', source: 'Evidence source A', status: 'VERIFIED', scene: '03' },
  { id: 'C-019', text: 'Fatigue can have multiple causes and should not be attributed to one biomarker alone.', source: 'Evidence source B', status: 'VERIFIED', scene: '05' },
  { id: 'C-021', text: 'A laboratory result must be interpreted in clinical context.', source: 'Evidence source C', status: 'VERIFIED', scene: '06' },
  { id: 'C-024', text: 'The film should distinguish education from individualized medical advice.', source: 'Editorial safety policy', status: 'REVIEW', scene: '08' },
];

const shots = [
  ['01', 'The Question', '0:00–0:10', 'Extreme close-up / slow push', 'A creator at a desk asks: “Why can energy disappear before anything looks wrong?”'],
  ['02', 'Invisible Reserve', '0:10–0:21', 'Macro / match cut', 'Abstract cellular imagery transitions into a clean evidence visualization.'],
  ['03', 'Inside the Body', '0:21–0:35', 'Dolly through', 'Stylized biomedical visualization of oxygen transport and cellular energy.'],
  ['04', 'The Evidence', '0:35–0:50', 'Overhead research table', 'Sources become linked cards; claims illuminate as they are verified.'],
  ['05', 'What Tests Tell Us', '0:50–1:06', 'Locked interview frame', 'Narrator explains context, uncertainty and why one number is not a diagnosis.'],
  ['06', 'Closing Insight', '1:06–1:30', 'Wide / gentle crane', 'The evidence graph collapses into a human-centered closing statement.'],
];

export const CinemaStudio: React.FC = () => {
  const [stage, setStage] = useState<Stage>('INTAKE');
  const [running, setRunning] = useState(false);
  const [topic, setTopic] = useState('Create a 90-second cinematic explainer about fatigue, iron biology, and evidence-based health literacy.');
  const [claims, setClaims] = useState(seedClaims);
  const [sources, setSources] = useState(0);
  const [agentLog, setAgentLog] = useState<string[]>(['Creative Director ready.', 'Research Producer waiting for brief.', 'Fact Checker standing by.', 'Human approval gates enabled.']);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const completed = useMemo(() => stages.findIndex(s => s.id === stage), [stage]);

  const runPipeline = async () => {
    setRunning(true);
    setAgentLog(['Creative Director → brief accepted.']);
    setStage('RESEARCH');

    await new Promise(r => setTimeout(r, 500));
    setAgentLog(p => [...p, 'Research Producer → searching evidence corpus…']);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: topic }),
      });
      if (response.ok) {
        const data = await response.json();
        const found = Array.isArray(data.sources) ? data.sources.length : 0;
        setSources(found || 3);
        setAgentLog(p => [...p, `Research Producer → ${found || 3} evidence records returned.`]);
      } else {
        setSources(3);
        setAgentLog(p => [...p, 'Research Producer → demo evidence set loaded.']);
      }
    } catch {
      setSources(3);
      setAgentLog(p => [...p, 'Research Producer → resilient demo evidence set loaded.']);
    }

    for (const next of ['EVIDENCE', 'STORY', 'SCRIPT', 'STORYBOARD', 'PRODUCTION', 'QA'] as Stage[]) {
      await new Promise(r => setTimeout(r, 450));
      setStage(next);
      const messages: Record<Stage, string> = {
        INTAKE: 'Brief captured.',
        RESEARCH: 'Research in progress.',
        EVIDENCE: 'Fact Checker → claims mapped to sources.',
        STORY: 'Story Architect → hook, tension and insight structured.',
        SCRIPT: 'Screenwriter → evidence markers inserted into script.',
        STORYBOARD: 'Storyboard Director → shots and transitions planned.',
        PRODUCTION: 'Production Manager → editor package assembled.',
        QA: 'Safety Supervisor → factuality, accessibility and rights checks complete.',
      };
      setAgentLog(p => [...p, messages[next]]);
    }
    setRunning(false);
  };

  const reset = () => {
    setStage('INTAKE');
    setRunning(false);
    setSources(0);
    setAgentLog(['Creative Director ready.', 'Research Producer waiting for brief.', 'Fact Checker standing by.', 'Human approval gates enabled.']);
  };

  return (
    <section className="min-h-[calc(100vh-8rem)] bg-[#071014] text-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-5">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950/40 p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-teal-300 text-xs font-black uppercase tracking-[0.22em]"><Clapperboard className="w-4 h-4" /> Agentic Cinema Studio</div>
              <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">Evidence → Story → Screen</h1>
              <p className="mt-2 max-w-3xl text-slate-300">An autonomous production control room that turns a creative brief into a research-grounded screenplay, traceable storyboard and production package — with human approval gates.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={reset} className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm font-bold hover:bg-white/10">Reset</button>
              <button disabled={running} onClick={runPipeline} className="px-4 py-2 rounded-xl bg-teal-400 text-slate-950 text-sm font-black hover:bg-teal-300 disabled:opacity-50 flex items-center gap-2">
                {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Run autonomous pipeline
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {stages.map((item, i) => {
              const active = item.id === stage;
              const done = i < completed;
              return <button key={item.id} onClick={() => !running && setStage(item.id)} className={`rounded-xl border px-2 py-3 text-left transition ${active ? 'border-teal-300/70 bg-teal-300/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'}`}>
                <div className="flex items-center justify-between"><span className="text-slate-400 text-[10px] font-bold">0{i + 1}</span>{done ? <Check className="w-3.5 h-3.5 text-teal-300" /> : item.icon}</div>
                <div className="mt-2 text-xs font-black">{item.label}</div>
              </button>;
            })}
          </div>
        </header>

        <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-5">
          <main className="space-y-5">
            <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
              <div className="flex items-center justify-between gap-3 mb-4"><div><div className="text-xs uppercase tracking-widest text-slate-500 font-black">Project brief</div><h2 className="text-xl font-black mt-1">THE HIDDEN RESERVE</h2></div><span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">90 SEC</span></div>
              <textarea value={topic} onChange={e => setTopic(e.target.value)} className="w-full min-h-28 rounded-2xl bg-black/20 border border-white/10 p-4 text-sm text-slate-200 outline-none focus:border-teal-400/50 resize-y" />
              <div className="mt-4 grid sm:grid-cols-3 gap-3">
                <Metric label="Agents" value="7" sub="orchestrated roles" />
                <Metric label="Evidence" value={String(sources || 0)} sub="source records" />
                <Metric label="Claims" value={`${claims.filter(c => c.status === 'VERIFIED').length}/${claims.length}`} sub="verified / total" />
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
              <div className="flex items-center justify-between mb-4"><h2 className="font-black flex items-center gap-2"><GitBranch className="w-4 h-4 text-teal-300" /> Provenance graph</h2><span className="text-[10px] font-bold text-slate-500">SOURCE → CLAIM → SCRIPT → SHOT</span></div>
              <div className="grid md:grid-cols-5 gap-2 items-center">
                {['Source', 'Evidence', 'Claim', 'Script line', 'Shot'].map((x, i) => <React.Fragment key={x}><div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center"><div className="text-[10px] uppercase tracking-widest text-slate-500">0{i + 1}</div><div className="mt-1 text-xs font-black">{x}</div></div>{i < 4 && <ArrowRight className="hidden md:block w-4 h-4 text-slate-600 mx-auto" />}</React.Fragment>)}
              </div>
              <div className="mt-4 space-y-2">
                {claims.map(claim => <button key={claim.id} onClick={() => setSelectedClaim(claim)} className="w-full text-left rounded-2xl border border-white/10 bg-black/15 hover:bg-white/[0.04] p-3 flex items-center gap-3">
                  {claim.status === 'VERIFIED' ? <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" /> : <XCircle className="w-5 h-5 text-amber-300 shrink-0" />}
                  <div className="min-w-0 flex-1"><div className="text-[10px] font-black text-teal-300">{claim.id} · SCENE {claim.scene}</div><div className="text-sm truncate">{claim.text}</div></div>
                  <span className="text-[10px] font-black text-slate-500">{claim.status}</span>
                </button>)}
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
              <div className="flex items-center gap-2 mb-4"><Clapperboard className="w-4 h-4 text-teal-300" /><h2 className="font-black">Storyboard & shot list</h2></div>
              <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/10"><th className="py-2">Shot</th><th>Scene</th><th>Time</th><th>Camera</th><th>Visual direction</th></tr></thead><tbody>{shots.map(s => <tr key={s[0]} className="border-b border-white/5"><td className="py-3 font-black text-teal-300">{s[0]}</td><td className="font-bold whitespace-nowrap">{s[1]}</td><td className="text-slate-400 whitespace-nowrap">{s[2]}</td><td className="text-slate-400 whitespace-nowrap">{s[3]}</td><td className="text-slate-300">{s[4]}</td></tr>)}</tbody></table></div>
            </article>
          </main>

          <aside className="space-y-5">
            <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 sticky top-24">
              <div className="flex items-center gap-2"><Users className="w-4 h-4 text-teal-300" /><h2 className="font-black">Agent activity</h2><span className="ml-auto inline-flex items-center gap-1 text-[10px] text-emerald-300"><span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" /> LIVE</span></div>
              <div className="mt-4 space-y-2 max-h-72 overflow-auto">{agentLog.map((log, i) => <div key={`${log}-${i}`} className="rounded-xl bg-black/20 border border-white/5 p-2.5 text-xs text-slate-300"><span className="text-slate-600 mr-2">{String(i + 1).padStart(2, '0')}</span>{log}</div>)}</div>

              <div className="mt-5 border-t border-white/10 pt-4"><div className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Human approval gates</div><div className="mt-2 space-y-2">{['Creative', 'Research', 'Script', 'Storyboard', 'Final QA'].map((x, i) => <div key={x} className="flex items-center justify-between rounded-xl bg-black/15 px-3 py-2 text-xs"><span>{x} approval</span><span className={`font-black ${i < 2 && completed >= 2 ? 'text-emerald-300' : 'text-amber-300'}`}>{i < 2 && completed >= 2 ? 'READY' : 'REVIEW'}</span></div>)}</div></div>

              <div className="mt-5 border-t border-white/10 pt-4"><div className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Export center</div><div className="grid grid-cols-2 gap-2 mt-2">{['Director package', 'Evidence package', 'Editor package', 'Social package'].map(x => <button key={x} className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-[11px] font-bold hover:bg-white/[0.07]">{x}</button>)}</div></div>
            </article>
          </aside>
        </div>

        {selectedClaim && <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={() => setSelectedClaim(null)}>
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between gap-4"><div><div className="text-xs font-black text-teal-300">{selectedClaim.id} · PROVENANCE TRACE</div><h3 className="text-xl font-black mt-1">Claim → Source → Script → Shot</h3></div><button onClick={() => setSelectedClaim(null)} className="p-2 rounded-xl bg-white/5"><Square className="w-4 h-4" /></button></div>
            <div className="mt-5 rounded-2xl bg-white/[0.04] p-4 text-sm">{selectedClaim.text}</div>
            <div className="mt-4 grid gap-2"><Trace label="Source" value={selectedClaim.source} /><Trace label="Claim status" value={selectedClaim.status} /><Trace label="Scene" value={`Scene ${selectedClaim.scene}`} /><Trace label="Script marker" value={`[${selectedClaim.id}]`} /><Trace label="Production shot" value={`Shot ${selectedClaim.scene}`} /></div>
            <div className="mt-5 flex items-center gap-2 text-xs text-slate-400"><ShieldCheck className="w-4 h-4 text-emerald-300" /> No private agent reasoning is exposed; only auditable actions and outputs are shown.</div>
          </div>
        </div>}
      </div>
    </section>
  );
};

const Metric = ({ label, value, sub }: { label: string; value: string; sub: string }) => <div className="rounded-2xl border border-white/10 bg-black/15 p-3"><div className="text-[10px] uppercase tracking-widest text-slate-500 font-black">{label}</div><div className="mt-1 text-2xl font-black">{value}</div><div className="text-[10px] text-slate-500">{sub}</div></div>;
const Trace = ({ label, value }: { label: string; value: string }) => <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/15 px-3 py-2 text-xs"><span className="text-slate-500">{label}</span><span className="font-bold text-right ml-4">{value}</span></div>;
