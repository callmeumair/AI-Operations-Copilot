import { openai } from '../openai';
import { TaskExecution } from '../types';

const SYNTHESIZER_PROMPT = `You are an operations synthesis agent. You have received results 
from multiple executor agents who have completed sub-tasks for a larger business operation. 
Synthesize these into a clear, executive-readable operational summary. 
Include: 
- What was done
- Key findings
- Recommended next actions

Be concise and business-focused. Format with markdown headers.`;

export async function synthesizeResults(originalInput: string, taskExecutions: TaskExecution[]): Promise<string> {
  const executionContext = taskExecutions.map(t => `
Task: ${t.task_name}
Description: ${t.task_description}
Tool Used: ${t.tool_used}
Result: ${JSON.stringify(t.output_result)}
Agent Reasoning: ${t.reasoning}
Confidence: ${t.confidence_score}
  `).join('\n\n');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYNTHESIZER_PROMPT },
      { role: 'user', content: `Original Request: ${originalInput}\n\nExecution Results:\n${executionContext}` }
    ]
  });

  return response.choices[0].message.content || 'Synthesis failed.';
}
