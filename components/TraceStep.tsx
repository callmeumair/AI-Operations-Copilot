'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, CircleDashed, XCircle } from 'lucide-react';
import { TraceEvent } from '../lib/types';

export const TraceStep: React.FC<{ event: TraceEvent; isLast: boolean }> = ({ event, isLast }) => {
  const [expanded, setExpanded] = useState(false);

  let title = '';
  let statusIcon = null;
  let duration = '';
  let details = null;
  let statusColor = '';

  switch (event.type) {
    case 'planner':
      title = '[PLANNER] Generated Execution Plan';
      statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      statusColor = 'text-emerald-500';
      details = event.data.plan;
      break;
    case 'rag':
      title = `[RAG] Retrieved SOPs for ${event.data.task_name}`;
      statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      statusColor = 'text-emerald-500';
      details = event.data.sops.map(s => s.title);
      break;
    case 'task_start':
      title = `[EXECUTOR] Running: ${event.data.tool}`;
      statusIcon = <CircleDashed className="w-4 h-4 text-amber-500 animate-spin" />;
      statusColor = 'text-amber-500';
      break;
    case 'task_done':
      title = `[EXECUTOR] Completed: ${event.data.task_name}`;
      statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      duration = `${event.data.duration_ms}ms`;
      statusColor = 'text-emerald-500';
      details = event.data.result;
      break;
    case 'task_fail':
      title = `[EXECUTOR] Failed: ${event.data.task_name}`;
      statusIcon = <XCircle className="w-4 h-4 text-red-500" />;
      statusColor = 'text-red-500';
      details = event.data.error;
      break;
    case 'synthesis':
      title = '[SYNTHESIZER] Generating output...';
      statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      statusColor = 'text-emerald-500';
      break;
    case 'complete':
      title = 'Workflow Complete';
      statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      duration = `${event.data.total_ms}ms`;
      statusColor = 'text-emerald-500';
      break;
  }

  return (
    <div className="relative pl-6 pb-4">
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-2.5 top-5 bottom-0 w-px bg-indigo-500/20"></div>
      )}
      
      {/* Node icon */}
      <div className="absolute left-0.5 top-1 bg-[#0E0E16]">
        {statusIcon}
      </div>
      
      <div className="flex flex-col">
        <div 
          className={`flex items-center gap-2 cursor-pointer select-none hover:bg-white/5 p-1 rounded -ml-1 ${details ? '' : 'pointer-events-none'}`}
          onClick={() => details && setExpanded(!expanded)}
        >
          {details && (
            expanded ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />
          )}
          {!details && <div className="w-3" />}
          
          <span className="font-mono text-sm text-slate-300">{title}</span>
          {duration && <span className="font-mono text-xs text-slate-500 ml-auto">{duration}</span>}
        </div>
        
        {expanded && details && (
          <div className="mt-2 ml-4 p-3 bg-black/40 border border-white/5 rounded-md font-mono text-xs text-cyan-400 overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
            {typeof details === 'object' ? JSON.stringify(details, null, 2) : details}
          </div>
        )}
      </div>
    </div>
  );
};
