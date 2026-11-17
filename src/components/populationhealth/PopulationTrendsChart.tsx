import React, { useState } from 'react';
import { TrendPoint } from '../../types/populationHealth';

interface PopulationTrendsChartProps {
  trends: TrendPoint[];
  suppressedForPrivacy?: boolean;
  kThreshold?: number;
}

export const PopulationTrendsChart: React.FC<PopulationTrendsChartProps> = ({
  trends,
  suppressedForPrivacy = false,
  kThreshold = 5,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [visibleSeries, setVisibleSeries] = useState({
    screeningCoveragePct: true,
    referralCompletionPct: true,
    elevatedRiskPct: true,
  });

  if (suppressedForPrivacy) {
    return (
      <div className="border border-amber-200 rounded-xl bg-amber-50 p-6 text-sm text-amber-900">
        <div className="font-semibold">
          Longitudinal Trends Suppressed for Privacy (k-Anonymity Threshold k={kThreshold})
        </div>
        <p className="text-xs text-amber-800 mt-1">
          The active cohort/region filter matches fewer than {kThreshold} consented participants.
          Trend series and subgroup percentages are intentionally withheld to prevent re-identification.
        </p>
      </div>
    );
  }

  if (!trends || trends.length === 0) {
    return (
      <div className="border border-slate-200 rounded-xl bg-white p-8 text-center text-sm text-slate-500">
        No longitudinal trend points available for the active filter selection. Load synthetic demo
        cohorts or record consented community participants to populate cohort trends.
      </div>
    );
  }

  const width = 720;
  const height = 240;
  const padL = 42;
  const padR = 20;
  const padT = 20;
  const padB = 34;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const xFor = (idx: number) =>
    trends.length === 1 ? padL + plotW / 2 : padL + (idx / (trends.length - 1)) * plotW;
  const yFor = (val: number) => padT + plotH - (Math.max(0, Math.min(100, val)) / 100) * plotH;

  const buildPath = (key: keyof Pick<TrendPoint, 'screeningCoveragePct' | 'referralCompletionPct' | 'elevatedRiskPct'>) =>
    trends
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i).toFixed(1)} ${yFor(pt[key]).toFixed(1)}`)
      .join(' ');

  const activePoint = hoveredIdx !== null ? trends[hoveredIdx] : trends[trends.length - 1];

  return (
    <div className="border border-slate-200 rounded-xl bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Longitudinal Cohort Outcomes & Screening Coverage
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Period comparison across consented cohorts · Hover any period to inspect exact values
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setVisibleSeries((s) => ({ ...s, screeningCoveragePct: !s.screeningCoveragePct }))
            }
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              visibleSeries.screeningCoveragePct
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            Screening Coverage %
          </button>
          <button
            type="button"
            onClick={() =>
              setVisibleSeries((s) => ({ ...s, referralCompletionPct: !s.referralCompletionPct }))
            }
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              visibleSeries.referralCompletionPct
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            Referral Completion %
          </button>
          <button
            type="button"
            onClick={() =>
              setVisibleSeries((s) => ({ ...s, elevatedRiskPct: !s.elevatedRiskPct }))
            }
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              visibleSeries.elevatedRiskPct
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            Elevated Risk %
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          role="img"
          aria-label="Longitudinal population health trends chart"
        >
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = yFor(tick);
            return (
              <g key={tick}>
                <line
                  x1={padL}
                  y1={y}
                  x2={width - padR}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray={tick === 0 ? undefined : '3 3'}
                />
                <text
                  x={padL - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-400 text-[10px] font-mono"
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          {visibleSeries.screeningCoveragePct && (
            <path
              d={buildPath('screeningCoveragePct')}
              fill="none"
              stroke="#0D9488"
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
          )}
          {visibleSeries.referralCompletionPct && (
            <path
              d={buildPath('referralCompletionPct')}
              fill="none"
              stroke="#16A34A"
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
          )}
          {visibleSeries.elevatedRiskPct && (
            <path
              d={buildPath('elevatedRiskPct')}
              fill="none"
              stroke="#D97706"
              strokeWidth={2.2}
              strokeDasharray="5 3"
              strokeLinejoin="round"
            />
          )}

          {trends.map((pt, i) => {
            const cx = xFor(i);
            const isHovered = hoveredIdx === i;
            return (
              <g
                key={pt.period}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                <rect x={cx - 24} y={padT} width={48} height={plotH + 20} fill="transparent" />
                {isHovered && (
                  <line
                    x1={cx}
                    y1={padT}
                    x2={cx}
                    y2={height - padB}
                    stroke="#94A3B8"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                  />
                )}
                {visibleSeries.screeningCoveragePct && (
                  <circle
                    cx={cx}
                    cy={yFor(pt.screeningCoveragePct)}
                    r={isHovered ? 5.5 : 3.5}
                    fill="#0D9488"
                    stroke="#FFFFFF"
                    strokeWidth={1.5}
                  />
                )}
                {visibleSeries.referralCompletionPct && (
                  <circle
                    cx={cx}
                    cy={yFor(pt.referralCompletionPct)}
                    r={isHovered ? 5.5 : 3.5}
                    fill="#16A34A"
                    stroke="#FFFFFF"
                    strokeWidth={1.5}
                  />
                )}
                {visibleSeries.elevatedRiskPct && (
                  <circle
                    cx={cx}
                    cy={yFor(pt.elevatedRiskPct)}
                    r={isHovered ? 5.5 : 3.5}
                    fill="#D97706"
                    stroke="#FFFFFF"
                    strokeWidth={1.5}
                  />
                )}
                <text
                  x={cx}
                  y={height - 10}
                  textAnchor="middle"
                  className={`text-[11px] font-mono ${isHovered ? 'fill-slate-900 font-semibold' : 'fill-slate-500'}`}
                >
                  {pt.period}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {activePoint && (
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <span className="text-slate-500">Inspected Period</span>
            <p className="font-mono tabular-nums font-semibold text-slate-900 mt-0.5">
              {activePoint.period}
            </p>
          </div>
          <div>
            <span className="text-slate-500">Screening Coverage</span>
            <p className="font-mono tabular-nums font-semibold text-teal-700 mt-0.5">
              {activePoint.screeningCoveragePct}%
            </p>
          </div>
          <div>
            <span className="text-slate-500">Referral Completion</span>
            <p className="font-mono tabular-nums font-semibold text-emerald-700 mt-0.5">
              {activePoint.referralCompletionPct}%
            </p>
          </div>
          <div>
            <span className="text-slate-500">Elevated Risk Tier</span>
            <p className="font-mono tabular-nums font-semibold text-amber-700 mt-0.5">
              {activePoint.elevatedRiskPct}%
            </p>
          </div>
          <div>
            <span className="text-slate-500">Unmet Follow-ups</span>
            <p className="font-mono tabular-nums font-semibold text-slate-900 mt-0.5">
              {activePoint.unmetFollowUpCount}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
