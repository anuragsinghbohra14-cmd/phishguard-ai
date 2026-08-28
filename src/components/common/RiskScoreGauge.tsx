import React from 'react';

interface RiskScoreGaugeProps {
  score: number; // 0-100
  confidence?: number;
  size?: number;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  score,
  confidence,
  size = 180,
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#10B981'; // emerald
  let textColor = 'text-emerald-400';
  let label = 'Low Threat';

  if (score >= 70) {
    strokeColor = '#F43F5E'; // rose
    textColor = 'text-rose-400';
    label = 'Severe Risk';
  } else if (score >= 40) {
    strokeColor = '#F59E0B'; // amber
    textColor = 'text-amber-400';
    label = 'Elevated Risk';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E293B"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.4s ease' }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">Risk Score</span>
        <div className="flex items-baseline">
          <span className={`text-4xl font-extrabold font-mono ${textColor}`}>{score}</span>
          <span className="text-sm font-semibold text-slate-400 ml-0.5">/100</span>
        </div>
        <span className={`text-xs font-semibold mt-0.5 ${textColor}`}>{label}</span>
        {confidence !== undefined && (
          <span className="text-[10px] text-slate-400 font-mono mt-1">
            Confidence: {(confidence * 100).toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
};
