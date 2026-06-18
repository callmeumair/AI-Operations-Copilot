'use client';

import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { ExampleChips } from './ExampleChips';
import { WorkflowOutput } from './WorkflowOutput';

export const InputPanel: React.FC<{
  onSubmit: (input: string) => void;
  isRunning: boolean;
  finalOutput?: string | null;
}> = ({ onSubmit, isRunning, finalOutput }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isRunning) {
      onSubmit(input);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#060609] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
      
      <div className="flex-1 overflow-y-auto p-8 relative z-10">
        <div className="max-w-3xl mx-auto w-full flex flex-col justify-center min-h-full">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-4 ring-1 ring-indigo-500/20">
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">AI Operations Copilot</h1>
            <p className="text-slate-400 max-w-xl mx-auto">
              Describe your business operation naturally. The agent will plan the execution, 
              retrieve relevant SOPs, and autonomously orchestrate tools to complete it.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the operation you need..."
              className="w-full bg-[#151522] border border-indigo-500/20 rounded-xl p-4 pr-16 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none shadow-xl shadow-black/20"
              rows={4}
              disabled={isRunning}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isRunning}
              className="absolute right-3 bottom-3 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {!isRunning && !finalOutput && (
            <ExampleChips onSelect={setInput} />
          )}

          {finalOutput && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
              <WorkflowOutput output={finalOutput} />
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};
