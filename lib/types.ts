export type ToolName = 
  | 'get_tickets'
  | 'classify_and_assign'
  | 'get_inventory'
  | 'draft_email'
  | 'get_sla_status'
  | 'schedule_meeting'
  | 'generate_report'
  | 'search_knowledge_base';

export type RunStatus = 'running' | 'completed' | 'failed';
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface SubTask {
  name: string;
  description: string;
  required_tool: ToolName;
  input_params: Record<string, any>;
}

export interface ExecutionPlan {
  sub_tasks: SubTask[];
}

export interface SOPDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  department?: string | null;
  tags?: string[] | null;
  created_at: string;
  embedding?: number[];
}

export interface SOPMatch extends SOPDocument {
  similarity: number;
}

export interface WorkflowRun {
  id: string;
  created_at: string;
  user_input: string;
  status: RunStatus;
  execution_plan?: ExecutionPlan | null;
  final_output?: string | null;
  total_duration_ms?: number | null;
  sub_task_count?: number | null;
  task_executions?: TaskExecution[];
}

export interface TaskExecution {
  id: string;
  run_id: string;
  task_name: string;
  task_description?: string | null;
  tool_used?: ToolName | null;
  status: TaskStatus;
  input_params?: Record<string, any> | null;
  output_result?: Record<string, any> | null;
  sop_context?: SOPMatch[] | null;
  confidence_score?: number | null;
  reasoning?: string | null;
  duration_ms?: number | null;
  started_at?: string | null;
  completed_at?: string | null;
}

export interface MCPToolCall {
  id: string;
  session_id: string;
  tool_name: ToolName;
  params: Record<string, any>;
  result?: Record<string, any> | null;
  execution_time_ms?: number | null;
  called_at: string;
}

export interface MCPResult {
  result: Record<string, any>;
  tool: ToolName;
  execution_time_ms: number;
}

// TraceEvent (discriminated union of all SSE event types)
export type TraceEvent = 
  | { type: 'planner'; data: { plan: ExecutionPlan } }
  | { type: 'rag'; data: { task_id: string; task_name: string; sops: SOPMatch[] } }
  | { type: 'task_start'; data: { task_id: string; task_name: string; tool: ToolName } }
  | { type: 'task_done'; data: { task_id: string; task_name: string; result: any; duration_ms: number } }
  | { type: 'task_fail'; data: { task_id: string; task_name: string; error: string } }
  | { type: 'synthesis'; data: { output: string } }
  | { type: 'complete'; data: { run_id: string; total_ms: number } };
