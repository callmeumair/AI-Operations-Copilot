'use client';

import React, { useEffect, useRef } from 'react';
import { TraceEvent } from '../lib/types';
import { TraceStep } from './TraceStep';
import { Loader2 } from 'lucide-react';

export const TracePanel: React.FC<{ events: TraceEvent[]; isRunning: boolean }> = ({ events, isRunning }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="flex flex-col h-full bg-[#0E0E16] border-l border-indigo-500/10">
      <div className="p-4 border-b border-indigo-500/10 bg-[#060609]">
        <h2 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
          Live Execution Trace
          {isRunning && <Loader2 className="w-4 h-4 animate-spin text-amber-500 ml-auto" />}
        </h2>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 scroll-smooth"
      >
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3 opacity-50">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-sm">Awaiting task execution...</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {events.map((evt, idx) => (
              <TraceStep key={idx} event={evt} isLast={idx === events.length - 1 && !isRunning} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
