'use client';

import React, { useState, useEffect } from 'react';
import { HistoryPanel } from './HistoryPanel';
import { InputPanel } from './InputPanel';
import { TracePanel } from './TracePanel';
import { TraceEvent } from '../lib/types';

export const AppShell: React.FC = () => {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [events, setEvents] = useState<TraceEvent[]>([]);
  const [finalOutput, setFinalOutput] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch run details when selected
  useEffect(() => {
    if (selectedRunId && !isRunning) {
      const fetchRun = async () => {
        try {
          const res = await fetch(`/api/workflow/runs/${selectedRunId}`);
          if (res.ok) {
            const data = await res.json();
            
            // Reconstruct events from task executions for the trace panel
            const reconstructedEvents: TraceEvent[] = [];
            if (data.execution_plan) {
              reconstructedEvents.push({ type: 'planner', data: { plan: data.execution_plan } });
            }
            
            if (data.task_executions) {
              data.task_executions.forEach((task: any) => {
                if (task.sop_context) {
                  reconstructedEvents.push({ type: 'rag', data: { task_id: task.id, task_name: task.task_name, sops: task.sop_context } });
                }
                reconstructedEvents.push({ type: 'task_start', data: { task_id: task.id, task_name: task.task_name, tool: task.tool_used } });
                if (task.status === 'completed') {
                  reconstructedEvents.push({ type: 'task_done', data: { task_id: task.id, task_name: task.task_name, result: task.output_result, duration_ms: task.duration_ms } });
                } else if (task.status === 'failed') {
                  reconstructedEvents.push({ type: 'task_fail', data: { task_id: task.id, task_name: task.task_name, error: task.reasoning } });
                }
              });
            }
            
            if (data.final_output) {
              reconstructedEvents.push({ type: 'synthesis', data: { output: data.final_output } });
              reconstructedEvents.push({ type: 'complete', data: { run_id: data.id, total_ms: data.total_duration_ms } });
            }
            
            setEvents(reconstructedEvents);
            setFinalOutput(data.final_output);
          }
        } catch (err) {
          console.error(err);
        }
      };
      
      fetchRun();
    } else if (!selectedRunId) {
      setEvents([]);
      setFinalOutput(null);
    }
  }, [selectedRunId]);

  const handleSubmit = async (input: string) => {
    try {
      setIsRunning(true);
      setEvents([]);
      setFinalOutput(null);
      setSelectedRunId(null); // Deselect any past run
      
      const res = await fetch('/api/workflow/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: input })
      });
      
      if (!res.ok) throw new Error('Failed to start workflow');
      
      const { run_id } = await res.json();
      setSelectedRunId(run_id);
      
      // Connect to SSE stream
      const eventSource = new EventSource(`/api/workflow/stream?run_id=${run_id}`);
      
      eventSource.onmessage = (e) => {
        // Fallback for unnamed events if needed
      };

      const handleEvent = (e: MessageEvent) => {
        const type = e.type as TraceEvent['type'];
        const data = JSON.parse(e.data);
        
        setEvents(prev => [...prev, { type, data } as any]);
        
        if (type === 'synthesis') {
          setFinalOutput(data.output);
        }
        
        if (type === 'complete' || type === 'task_fail' && data.task_id === 'workflow') {
          setIsRunning(false);
          setRefreshTrigger(prev => prev + 1);
          eventSource.close();
        }
      };

      eventSource.addEventListener('planner', handleEvent);
      eventSource.addEventListener('rag', handleEvent);
      eventSource.addEventListener('task_start', handleEvent);
      eventSource.addEventListener('task_done', handleEvent);
      eventSource.addEventListener('task_fail', handleEvent);
      eventSource.addEventListener('synthesis', handleEvent);
      eventSource.addEventListener('complete', handleEvent);
      
      eventSource.onerror = () => {
        console.error('SSE Error');
        setIsRunning(false);
        eventSource.close();
      };
      
    } catch (err) {
      console.error(err);
      setIsRunning(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#060609] overflow-hidden text-slate-300 font-sans">
      {/* Desktop Layout (hidden on small screens, adjust for mobile if needed) */}
      <HistoryPanel 
        onSelectRun={setSelectedRunId} 
        selectedRunId={selectedRunId} 
        refreshTrigger={refreshTrigger}
      />
      <InputPanel 
        onSubmit={handleSubmit} 
        isRunning={isRunning} 
        finalOutput={finalOutput} 
      />
      <div className="w-[320px] flex-shrink-0">
        <TracePanel events={events} isRunning={isRunning} />
      </div>
    </div>
  );
};
