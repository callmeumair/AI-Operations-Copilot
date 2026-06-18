import React from 'react';

const examples = [
  "Triage all open support tickets by priority and assign teams",
  "Check low inventory items and draft reorder emails to suppliers",
  "Generate this week's SLA compliance report for the support team",
  "Schedule performance review meetings for the engineering team"
];

export const ExampleChips: React.FC<{ onSelect: (text: string) => void }> = ({ onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {examples.map((ex, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(ex)}
          className="text-xs text-indigo-300 bg-indigo-900/30 border border-indigo-500/20 rounded-full px-3 py-1.5 hover:bg-indigo-900/50 hover:border-indigo-500/40 transition-colors text-left"
        >
          {ex}
        </button>
      ))}
    </div>
  );
};
