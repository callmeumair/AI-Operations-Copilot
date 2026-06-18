import React from 'react';
import ReactMarkdown from 'react-markdown';

export const WorkflowOutput: React.FC<{ output: string }> = ({ output }) => {
  return (
    <div className="mt-8 bg-[#151522] border border-indigo-500/20 rounded-xl p-6 shadow-xl shadow-indigo-500/5">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
        <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white">Synthesized Output</h3>
      </div>
      <div className="prose prose-invert prose-indigo max-w-none prose-sm sm:prose-base font-sans text-slate-300">
        <ReactMarkdown>{output}</ReactMarkdown>
      </div>
    </div>
  );
};
