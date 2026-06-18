import { ToolName } from '../types';

export interface ToolDefinition {
  name: ToolName;
  description: string;
  schema: Record<string, any>; // JSON Schema
}

export const mcpToolsRegistry: ToolDefinition[] = [
  {
    name: 'get_tickets',
    description: 'Retrieve support tickets from CRM',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', description: 'Ticket status' },
        priority: { type: 'string', description: 'Ticket priority' },
        limit: { type: 'number', description: 'Max number of tickets' },
      },
    },
  },
  {
    name: 'classify_and_assign',
    description: 'Auto-classify tickets and assign to correct team',
    schema: {
      type: 'object',
      properties: {
        ticket_ids: { type: 'array', items: { type: 'string' } },
        assignment_rules: { type: 'object' },
      },
      required: ['ticket_ids', 'assignment_rules'],
    },
  },
  {
    name: 'get_inventory',
    description: 'Check inventory levels for specified items',
    schema: {
      type: 'object',
      properties: {
        items: { type: 'array', items: { type: 'string' } },
        low_stock_only: { type: 'boolean' },
      },
    },
  },
  {
    name: 'draft_email',
    description: 'Draft a professional business email',
    schema: {
      type: 'object',
      properties: {
        to: { type: 'string' },
        subject: { type: 'string' },
        context: { type: 'string' },
        tone: { type: 'string' },
      },
      required: ['to', 'subject', 'context', 'tone'],
    },
  },
  {
    name: 'get_sla_status',
    description: 'Check SLA compliance for open tickets',
    schema: {
      type: 'object',
      properties: {
        team: { type: 'string' },
        date_range: { type: 'string' },
      },
    },
  },
  {
    name: 'schedule_meeting',
    description: 'Find available slots and draft meeting invite',
    schema: {
      type: 'object',
      properties: {
        attendees: { type: 'array', items: { type: 'string' } },
        duration_minutes: { type: 'number' },
        purpose: { type: 'string' },
      },
      required: ['attendees', 'duration_minutes', 'purpose'],
    },
  },
  {
    name: 'generate_report',
    description: 'Generate an operational summary report',
    schema: {
      type: 'object',
      properties: {
        report_type: { type: 'string' },
        period: { type: 'string' },
        include_charts: { type: 'boolean' },
      },
      required: ['report_type', 'period', 'include_charts'],
    },
  },
  {
    name: 'search_knowledge_base',
    description: 'Search internal SOPs and documentation',
    schema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        category: { type: 'string' },
      },
      required: ['query'],
    },
  },
];
