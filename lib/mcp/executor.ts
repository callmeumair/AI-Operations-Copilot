import { ToolName, MCPResult } from '../types';
import { supabaseAdmin } from '../supabase';
import { getTickets } from './tools/get-tickets';
import { classifyAndAssign } from './tools/classify-and-assign';
import { getInventory } from './tools/get-inventory';
import { draftEmail } from './tools/draft-email';
import { getSlaStatus } from './tools/get-sla-status';
import { scheduleMeeting } from './tools/schedule-meeting';
import { generateReport } from './tools/generate-report';
import { searchKnowledgeBase } from './tools/search-knowledge-base';

export async function executeTool(toolName: ToolName, params: any, sessionId: string): Promise<MCPResult> {
  const startTime = Date.now();
  let result: any = null;
  
  try {
    switch (toolName) {
      case 'get_tickets':
        result = await getTickets(params);
        break;
      case 'classify_and_assign':
        result = await classifyAndAssign(params);
        break;
      case 'get_inventory':
        result = await getInventory(params);
        break;
      case 'draft_email':
        result = await draftEmail(params);
        break;
      case 'get_sla_status':
        result = await getSlaStatus(params);
        break;
      case 'schedule_meeting':
        result = await scheduleMeeting(params);
        break;
      case 'generate_report':
        result = await generateReport(params);
        break;
      case 'search_knowledge_base':
        result = await searchKnowledgeBase(params);
        break;
      default:
        throw new Error(`Tool ${toolName} not found`);
    }
  } catch (error: any) {
    result = { error: error.message || 'Tool execution failed' };
  }
  
  const executionTimeMs = Date.now() - startTime;
  
  // Log the tool call to Supabase
  await supabaseAdmin.from('mcp_calls').insert({
    session_id: sessionId,
    tool_name: toolName,
    params,
    result,
    execution_time_ms: executionTimeMs
  });
  
  return {
    result,
    tool: toolName,
    execution_time_ms: executionTimeMs
  };
}
