import { openai } from '../openai';
import { ExecutionPlan } from '../types';

const PLANNER_PROMPT = `You are an operations planning agent. Your job is to decompose a 
business operation request into 2-5 concrete, executable sub-tasks. 
Each sub-task must specify which tool to use from: 
[get_tickets, classify_and_assign, get_inventory, draft_email, 
get_sla_status, schedule_meeting, generate_report, search_knowledge_base].
Return ONLY valid JSON matching the ExecutionPlan schema. 
Be specific with params. Consider dependencies between tasks.`;

export async function createExecutionPlan(userInput: string): Promise<ExecutionPlan> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: PLANNER_PROMPT },
      { role: 'user', content: userInput }
    ],
    response_format: { type: 'json_object' },
    functions: [
      {
        name: 'generate_plan',
        description: 'Generate the execution plan for the operation',
        parameters: {
          type: 'object',
          properties: {
            sub_tasks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  required_tool: { 
                    type: 'string',
                    enum: ['get_tickets', 'classify_and_assign', 'get_inventory', 'draft_email', 'get_sla_status', 'schedule_meeting', 'generate_report', 'search_knowledge_base']
                  },
                  input_params: { type: 'object' }
                },
                required: ['name', 'description', 'required_tool', 'input_params']
              }
            }
          },
          required: ['sub_tasks']
        }
      }
    ],
    function_call: { name: 'generate_plan' }
  });

  const functionCall = response.choices[0].message.function_call;
  if (!functionCall || !functionCall.arguments) {
    throw new Error('Failed to generate execution plan');
  }

  return JSON.parse(functionCall.arguments) as ExecutionPlan;
}
