import React, { useState, useMemo } from 'react';
import { predict } from '../hooks/useSiagaSimulation';
import { Sparkles, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface PredictiveChartProps {
  title: string;
  metricKey: 'pm' | 'co2';
  unit: string;
  history: number[];
  thresholds: [number, number]; // [warnThreshold, badThreshold]
  thresholdLabels: [string, string];
}

export const PredictiveChart: React.FC<PredictiveChartProps> = ({
  title,
  metricKey,
  unit,
  history,
  thresholds,
  thresholdLabels,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Compute 6 future prediction points (each step = 5 minutes -> 30 minutes total)
  const predictions = useMemo(() => {
    const preds: number[] = [];
    for (let step = 1; step <= 6; step++) {
      preds.push(predict(history, step));
    }
    return preds;
  }, [history]);

  const currentVal = history[history.length - 1] ?? 0;
  const target30MinVal = predictions[predictions.length - 1] ?? currentVal;
  const delta = target30MinVal - currentVal;
  const deltaPercent = currentVal > 0 ? (delta / currentVal) * 100 : 0;

  // Chart Dimensions
  const W = 460;
  const H = 240;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 30;
  const padBottom = 35;

  const chartW = W - padLeft - padRight;
  const chartH = H - padTop - padBottom;

  const totalPoints = history.length + 6;
  const maxVal = Math.max(...history, ...predictions, thresholds[1] * 1.15, 10);

  // Coordinate mappers
  const getX = (idx: number) => padLeft + (idx / (totalPoints - 1)) * chartW;
  const getY = (val: number) => padTop + chartH * (1 - Math.max(0, val) / maxVal);

  const curIdx = history.length - 1;
  const curX = getX(curIdx);
  const curY = getY(currentVal);

  // Color according to current value
  const curColor = currentVal > thresholds[1] ? '#f43f5e' : currentVal > thresholds[0] ? '#f59e0b' : '#10b981';
  const predColor = target30MinVal > thresholds[1] ? '#f43f5e' : target30MinVal > thresholds[0] ? '#f59e0b' : '#10b981';

  // Smooth quadratic bezier curve generator
  const createSmoothPath = (pts: [number, number][]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0][0]},${pts[0][1]}`;
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const xc = (pts[i][0] + pts[i + 1][0]) / 2;
      const yc = (pts[i][1] + pts[i + 1][1]) / 2;
      d += ` Q ${pts[i][0]},${pts[i][1]} ${xc},${yc}`;
    }
    const last = pts[pts.length - 1];
    d += ` L ${last[0]},${last[1]}`;
    return d;
  };

  const histPoints: [number, number][] = history.map((val, idx) => [getX(idx), getY(val)]);
  const predPoints: [number, number][] = [
    [curX, curY],
    ...predictions.map((val, idx) => [getX(history.length + idx), getY(val)] as [number, number]),
  ];

  const histPath = createSmoothPath(histPoints);
  const predPath = createSmoothPath(predPoints);

  const histAreaPath = `${histPath} L ${histPoints[histPoints.length - 1][0]},${padTop + chartH} L ${histPoints[0][0]},${padTop + chartH} Z`;

  const gradId = `grad-${metricKey}`;

  // Hover point data
  const allPoints = [
    ...history.map((val, idx) => ({
      x: getX(idx),
      y: getY(val),
      val,
      label: `T -${(history.length - 1 - idx) * 5} mnt`,
      isPred: false,
    })),
    ...predictions.map((val, idx) => ({
      x: getX(history.length + idx),
      y: getY(val),
      val,
      label: `+${(idx + 1) * 5} mnt`,
      isPred: true,
    })),
  ];

  const activePoint = hoverIndex !== null ? allPoints[hoverIndex] : null;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl relative backdrop-blur-md transition-all duration-300 hover:border-slate-700">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-100 font-sans">{title}</h3>
            <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
              AI Horizon 30 Min
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Data aktual per 5 menit & ekstrapolasi regresi linier edge computing
          </p>
        </div>

        {/* Live Delta Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-mono">Prediksi +30 mnt:</span>
            <span className="text-base font-bold font-mono text-slate-100">
              ≈ {Math.round(target30MinVal)} <span className="text-xs font-normal text-slate-400">{unit}</span>
            </span>
          </div>
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border ${
              delta > 3
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : delta < -3
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {delta > 3 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : delta < -3 ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
            <span>{delta > 0 ? `+${Math.round(delta)}` : Math.round(delta)}</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Graphic */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={curColor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={curColor} stopOpacity={0.0} />
            </linearGradient>

            {/* Threshold Pattern Gradients */}
            <linearGradient id={`safe-zone-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.06} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          {/* Background Reference Zones */}
          {/* Safe Zone */}
          <rect
            x={padLeft}
            y={getY(thresholds[0])}
            width={chartW}
            height={Math.max(0, getY(0) - getY(thresholds[0]))}
            fill="#10b981"
            fillOpacity={0.04}
          />
          {/* Moderate Zone */}
          <rect
            x={padLeft}
            y={getY(thresholds[1])}
            width={chartW}
            height={Math.max(0, getY(thresholds[0]) - getY(thresholds[1]))}
            fill="#f59e0b"
            fillOpacity={0.05}
          />
          {/* Unhealthy Zone */}
          <rect
            x={padLeft}
            y={padTop}
            width={chartW}
            height={Math.max(0, getY(thresholds[1]) - padTop)}
            fill="#f43f5e"
            fillOpacity={0.06}
          />

          {/* Prediction Region Backdrop */}
          <rect
            x={curX}
            y={padTop}
            width={padLeft + chartW - curX}
            height={chartH}
            fill="#38bdf8"
            fillOpacity={0.03}
          />
          <text
            x={curX + 6}
            y={padTop + 13}
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="0.08em"
            fill="#38bdf8"
            fillOpacity={0.8}
            fontWeight="bold"
          >
            AI FORECAST (30 MNT)
          </text>

          {/* Grid Lines */}
          {[0, 0.5, 1].map((pct) => {
            const yVal = maxVal * pct;
            const y = getY(yVal);
            return (
              <g key={pct}>
                <line
                  x1={padLeft}
                  x2={padLeft + chartW}
                  y1={y}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="0.8"
                  strokeDasharray="2 4"
                />
                <text
                  x={padLeft - 6}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fill="#64748b"
                >
                  {Math.round(yVal)}
                </text>
              </g>
            );
          })}

          {/* Threshold Lines */}
          <g>
            {/* Warning Threshold */}
            <line
              x1={padLeft}
              x2={padLeft + chartW}
              y1={getY(thresholds[0])}
              y2={getY(thresholds[0])}
              stroke="#f59e0b"
              strokeWidth="1"
              strokeDasharray="3 3"
              strokeOpacity={0.7}
            />
            <text
              x={padLeft + 4}
              y={getY(thresholds[0]) - 4}
              fontSize="9"
              fontFamily="monospace"
              fill="#f59e0b"
              fontWeight="600"
            >
              {thresholdLabels[0]}: {thresholds[0]}
            </text>

            {/* Danger Threshold */}
            <line
              x1={padLeft}
              x2={padLeft + chartW}
              y1={getY(thresholds[1])}
              y2={getY(thresholds[1])}
              stroke="#f43f5e"
              strokeWidth="1"
              strokeDasharray="3 3"
              strokeOpacity={0.8}
            />
            <text
              x={padLeft + 4}
              y={getY(thresholds[1]) - 4}
              fontSize="9"
              fontFamily="monospace"
              fill="#f43f5e"
              fontWeight="600"
            >
              {thresholdLabels[1]}: {thresholds[1]}
            </text>
          </g>

          {/* Vertical Separator for Now */}
          <line
            x1={curX}
            x2={curX}
            y1={padTop}
            y2={padTop + chartH}
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="2 3"
            strokeOpacity={0.5}
          />

          {/* Historical Area & Curve */}
          <path d={histAreaPath} fill={`url(#${gradId})`} />
          <path
            d={histPath}
            fill="none"
            stroke={curColor}
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Prediction Curve (Dashed) */}
          <path
            d={predPath}
            fill="none"
            stroke={predColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 4"
          />

          {/* Current Reading Point */}
          <circle cx={curX} cy={curY} r="10" fill={curColor} fillOpacity={0.2} className="animate-ping" />
          <circle cx={curX} cy={curY} r="5" fill={curColor} stroke="#0f172a" strokeWidth="2" />

          {/* Target Future Prediction Point */}
          {predPoints.length > 1 && (
            <g>
              <circle
                cx={predPoints[predPoints.length - 1][0]}
                cy={predPoints[predPoints.length - 1][1]}
                r="4.5"
                fill="#0f172a"
                stroke={predColor}
                strokeWidth="2.5"
              />
              <text
                x={predPoints[predPoints.length - 1][0] - 6}
                y={Math.max(predPoints[predPoints.length - 1][1] - 8, padTop + 14)}
                textAnchor="end"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
                fill="#f1f5f9"
              >
                ≈ {Math.round(target30MinVal)}
              </text>
            </g>
          )}

          {/* Bottom Time Labels */}
          <text x={padLeft} y={H - 12} fontSize="9.5" fill="#64748b" fontFamily="monospace">
            -30 mnt
          </text>
          <text
            x={curX}
            y={H - 12}
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill="#38bdf8"
            fontFamily="monospace"
          >
            Sekarang ({Math.round(currentVal)})
          </text>
          <text
            x={padLeft + chartW}
            y={H - 12}
            textAnchor="end"
            fontSize="9.5"
            fill="#64748b"
            fontFamily="monospace"
          >
            +30 mnt
          </text>

          {/* Hover Overlay Columns */}
          {allPoints.map((pt, i) => (
            <rect
              key={i}
              x={pt.x - 10}
              y={padTop}
              width={20}
              height={chartH}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
            />
          ))}

          {/* Active Hover Crosshair & Tooltip */}
          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                x2={activePoint.x}
                y1={padTop}
                y2={padTop + chartH}
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="6"
                fill="#38bdf8"
                stroke="#0f172a"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {activePoint && (
          <div
            className="absolute pointer-events-none bg-slate-950/95 border border-cyan-500/50 rounded-lg px-2.5 py-1 text-xs shadow-xl z-20"
            style={{
              left: `${Math.min(Math.max(activePoint.x - 45, 10), W - 100)}px`,
              top: `${Math.max(activePoint.y - 45, 10)}px`,
            }}
          >
            <div className="font-mono text-[10px] text-cyan-300">
              {activePoint.label} {activePoint.isPred && '(Prediksi)'}
            </div>
            <div className="font-bold text-slate-100 font-mono">
              {Math.round(activePoint.val)} {unit}
            </div>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-1 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-200 rounded" /> Data Aktual
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-teal-400" /> Prediksi 30 Mnt
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" /> Baik
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" /> Sedang
          <span className="inline-block w-2 h-2 rounded-full bg-rose-400" /> Tidak Sehat
        </div>
      </div>
    </div>
  );
};
