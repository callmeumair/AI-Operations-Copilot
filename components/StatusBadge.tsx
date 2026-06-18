import React from 'react';

type StatusBadgeProps = {
  status: 'running' | 'pending' | 'completed' | 'failed';
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    running: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
    pending: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    completed: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    failed: 'bg-red-500/20 text-red-500 border-red-500/30'
  };

  const icons = {
    running: <span className="animate-pulse mr-1.5 h-2 w-2 rounded-full bg-amber-500 inline-block" />,
    pending: null,
    completed: null,
    failed: null
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
