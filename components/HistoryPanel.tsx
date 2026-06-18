'use client';

import React, { useEffect, useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { WorkflowRun } from '../lib/types';
import { PlusCircle, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

export const HistoryPanel: React.FC<{ 
  onSelectRun: (id: string | null) => void;
  selectedRunId: string | null;
  refreshTrigger: number;
}> = ({ onSelectRun, selectedRunId, refreshTrigger }) => {
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const res = await fetch('/api/workflow/runs');
        if (res.ok) {
          const data = await res.json();
          setRuns(data);
        }
      } catch (err) {
        console.error('Failed to fetch runs:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRuns();
  }, [refreshTrigger]);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-[#0E0E16] border-r border-indigo-500/10 w-[260px] flex-shrink-0">
      <div className="p-4 border-b border-indigo-500/10 bg-[#060609]">
        <button 
          onClick={() => onSelectRun(null)}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium shadow-lg shadow-indigo-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          New Run
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Recent Runs</h3>
        
        {loading ? (
          <div className="flex justify-center p-4">
            <Clock className="w-5 h-5 text-indigo-500/50 animate-spin" />
          </div>
        ) : runs.length === 0 ? (
          <p className="text-sm text-slate-500 text-center p-4 italic">No previous runs.</p>
        ) : (
          <div className="space-y-2">
            {runs.map((run) => (
              <button
                key={run.id}
                onClick={() => onSelectRun(run.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedRunId === run.id 
                    ? 'bg-indigo-500/10 border-indigo-500/30 shadow-inner' 
                    : 'bg-[#151522] border-white/5 hover:border-indigo-500/20 hover:bg-[#1a1a2e]'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs text-slate-400 font-mono">{formatDate(run.created_at)}</span>
                  <StatusBadge status={run.status} />
                </div>
                <p className="text-sm text-slate-200 line-clamp-2 leading-relaxed">
                  {run.user_input}
                </p>
                
                {run.status === 'completed' && run.total_duration_ms && (
                  <div className="flex items-center gap-3 mt-3 text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {(run.total_duration_ms / 1000).toFixed(1)}s
                    </span>
                    {run.sub_task_count && (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> {run.sub_task_count} tasks
                      </span>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
