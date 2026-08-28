import React from 'react';
import { ThreatClassification } from '../../types';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ThreatBadgeProps {
  classification: ThreatClassification;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const ThreatBadge: React.FC<ThreatBadgeProps> = ({
  classification,
  size = 'md',
  showIcon = true,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2 font-bold',
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  if (classification === 'SAFE') {
    return (
      <span className={`inline-flex items-center rounded-full font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 ${sizeClasses[size]} glow-emerald`}>
        {showIcon && <ShieldCheck size={iconSizes[size]} className="text-emerald-400" />}
        SAFE
      </span>
    );
  }

  if (classification === 'SUSPICIOUS') {
    return (
      <span className={`inline-flex items-center rounded-full font-semibold bg-amber-950/70 text-amber-400 border border-amber-500/40 ${sizeClasses[size]} glow-amber`}>
        {showIcon && <AlertTriangle size={iconSizes[size]} className="text-amber-400" />}
        SUSPICIOUS
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full font-semibold bg-rose-950/80 text-rose-400 border border-rose-500/50 ${sizeClasses[size]} glow-rose animate-pulse`}>
      {showIcon && <ShieldAlert size={iconSizes[size]} className="text-rose-400" />}
      PHISHING DETECTED
    </span>
  );
};
