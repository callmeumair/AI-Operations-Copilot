import { openai } from '../openai';
import { SubTask, SOPMatch } from '../types';

export async function executeTaskWithAgent(
  task: SubTask, 
  sopContext: SOPMatch[], 
  toolResult: any
): Promise<{ resultInterpretation: string; confidenceScore: number; reasoning: string }> {
  
  const sopText = sopContext.map(sop => `Title: ${sop.title}\nContent: ${sop.content}`).join('\n\n');
  
  const EXECUTOR_PROMPT = `You are an operations executor agent. You have been assigned one 
sub-task and have access to relevant SOPs. You have just executed the task using a tool.
Interpret the tool result based on the SOP context. Provide: the result interpretation, 
a confidence score (0-1), and your reasoning. 

SOP Context:
${sopText}

Your sub-task: ${task.description}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: EXECUTOR_PROMPT },
      { role: 'user', content: `Tool used: ${task.required_tool}\nTool input params: ${JSON.stringify(task.input_params)}\nTool execution result: ${JSON.stringify(toolResult)}` }
    ],
    functions: [
      {
        name: 'provide_execution_result',
        description: 'Provide the interpreted result of the task execution',
        parameters: {
          type: 'object',
          properties: {
            resultInterpretation: { type: 'string', description: 'Clear interpretation of what the tool achieved' },
            confidenceScore: { type: 'number', description: 'Confidence score between 0 and 1' },
            reasoning: { type: 'string', description: 'Reasoning behind the interpretation and confidence score' }
          },
          required: ['resultInterpretation', 'confidenceScore', 'reasoning']
        }
      }
    ],
    function_call: { name: 'provide_execution_result' }
  });

  const functionCall = response.choices[0].message.function_call;
  if (!functionCall || !functionCall.arguments) {
    throw new Error('Failed to generate execution result');
  }

  return JSON.parse(functionCall.arguments);
}
