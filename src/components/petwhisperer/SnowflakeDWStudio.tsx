import React, { useState } from 'react';
import { 
  Database, 
  Terminal, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Table as TableIcon, 
  TrendingDown, 
  Clock, 
  Layers, 
  RefreshCw 
} from 'lucide-react';

export const SnowflakeDWStudio: React.FC = () => {
  const PRESET_QUERIES = [
    {
      title: 'Longitudinal Arousal Incidents (Last 24 Hours)',
      sql: `SELECT 
  event_id, 
  trigger_type, 
  arousal_score, 
  f0_frequency_hz, 
  SNOWFLAKE.CORTEX.SENTIMENT(diagnosed_state) as sentiment_score,
  de_escalation_latency_ms, 
  created_at 
FROM CANINE_INCIDENTS.TELEMETRY.INCIDENT_STREAM 
ORDER BY created_at DESC 
LIMIT 10;`
    },
    {
      title: 'De-escalation Latency vs Frequency Intervention',
      sql: `SELECT 
  intervention_hz, 
  COUNT(*) as total_events, 
  AVG(de_escalation_latency_ms) as avg_latency_ms, 
  AVG(arousal_score) as avg_peak_arousal 
FROM CANINE_INCIDENTS.TELEMETRY.INCIDENT_STREAM 
GROUP BY intervention_hz;`
    },
    {
      title: 'Solana Devnet TREATS Mint Distribution',
      sql: `SELECT 
  subject_id, 
  SUM(treats_minted) as total_treats, 
  COUNT(DISTINCT solana_tx_sig) as verified_proofs 
FROM CANINE_INCIDENTS.TELEMETRY.ONCHAIN_LEDGER 
GROUP BY subject_id;`
    }
  ];

  const [activeSql, setActiveSql] = useState(PRESET_QUERIES[0].sql);
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryResult, setQueryResult] = useState<any[]>([
    {
      EVENT_ID: 'evt_98f12a',
      TRIGGER_TYPE: 'Doorbell Ringing',
      AROUSAL_SCORE: 86,
      F0_HZ: 620,
      SENTIMENT: 0.88,
      LATENCY_MS: 427,
      CREATED_AT: '2026-08-27 21:18:04'
    },
    {
      EVENT_ID: 'evt_44e87c',
      TRIGGER_TYPE: 'Thunderstorm Acoustic',
      AROUSAL_SCORE: 94,
      F0_HZ: 780,
      SENTIMENT: 0.94,
      LATENCY_MS: 388,
      CREATED_AT: '2026-08-27 20:45:12'
    },
    {
      EVENT_ID: 'evt_12b90d',
      TRIGGER_TYPE: 'Separation Whine',
      AROUSAL_SCORE: 72,
      F0_HZ: 1450,
      SENTIMENT: 0.79,
      LATENCY_MS: 412,
      CREATED_AT: '2026-08-27 19:12:30'
    },
    {
      EVENT_ID: 'evt_09a77e',
      TRIGGER_TYPE: 'Leash Reactivity',
      AROUSAL_SCORE: 80,
      F0_HZ: 510,
      SENTIMENT: 0.84,
      LATENCY_MS: 450,
      CREATED_AT: '2026-08-27 17:34:00'
    }
  ]);

  const handleRunQuery = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
    }, 450);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/20 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-[#1A1A1A] text-white">
              CORTEX ML &amp; SQL
            </span>
            <span className="text-xs font-mono text-stone-500">
              08 SNOWFLAKE DATA WAREHOUSE TELEMETRY
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif italic font-light text-[#1A1A1A] mt-1">
            Snowflake DW &amp; Cortex ML Workbench
          </h1>
          <p className="text-xs sm:text-sm font-mono text-stone-600 max-w-3xl mt-1">
            Enterprise analytics warehouse streaming longitudinal canine ethology data, acoustic spectrogram telemetry, and Cortex ML sentiment classification.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-[#1A1A1A] shadow-xs font-mono text-xs text-stone-700">
          <Database className="w-4 h-4 text-indigo-600" />
          <span>Warehouse: PETWHISPERER_DW (XS Active)</span>
        </div>
      </div>

      {/* SQL Query Editor */}
      <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-[#1A1A1A]" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
              Snowflake SQL &amp; Cortex ML Query Editor
            </h2>
          </div>
          <span className="text-xs font-mono text-stone-500">Snowflake Engine: v8.24</span>
        </div>

        {/* Preset Query Chips */}
        <div className="flex flex-wrap gap-2">
          {PRESET_QUERIES.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSql(p.sql)}
              className="px-3 py-1.5 rounded-lg bg-[#FAF9F6] hover:bg-stone-200 border border-stone-300 font-mono text-xs text-stone-800 transition"
            >
              {p.title}
            </button>
          ))}
        </div>

        <textarea
          rows={6}
          value={activeSql}
          onChange={(e) => setActiveSql(e.target.value)}
          className="w-full p-4 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
        />

        <div className="flex justify-between items-center pt-1">
          <span className="text-[11px] font-mono text-stone-500">
            Query cost: ~0.0001 Snowflake Credits
          </span>
          <button
            onClick={handleRunQuery}
            disabled={isExecuting}
            className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-stone-800 text-white font-mono font-bold text-xs flex items-center space-x-2 transition shadow-xs disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 text-amber-400 ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Running Cortex Query...' : 'Execute SQL Query'}</span>
          </button>
        </div>
      </div>

      {/* Query Results Table */}
      <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <TableIcon className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
              Query Execution Output ({queryResult.length} Rows)
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            Execution Time: 32 ms
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 bg-stone-50 text-[11px]">
                <th className="p-3">EVENT_ID</th>
                <th className="p-3">TRIGGER_TYPE</th>
                <th className="p-3">AROUSAL_SCORE</th>
                <th className="p-3">F0_HZ</th>
                <th className="p-3">CORTEX_SENTIMENT</th>
                <th className="p-3">LATENCY_MS</th>
                <th className="p-3">CREATED_AT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {queryResult.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50 transition">
                  <td className="p-3 font-bold text-stone-900">{row.EVENT_ID}</td>
                  <td className="p-3 text-stone-800">{row.TRIGGER_TYPE}</td>
                  <td className="p-3">
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                      {row.AROUSAL_SCORE}%
                    </span>
                  </td>
                  <td className="p-3 text-stone-700">{row.F0_HZ} Hz</td>
                  <td className="p-3 text-emerald-700 font-bold">{row.SENTIMENT}</td>
                  <td className="p-3 text-stone-500">{row.LATENCY_MS} ms</td>
                  <td className="p-3 text-stone-400">{row.CREATED_AT}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
