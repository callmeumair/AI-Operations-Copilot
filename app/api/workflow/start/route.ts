import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createExecutionPlan } from '@/lib/agents/planner';
import { executeTaskWithAgent } from '@/lib/agents/executor';
import { synthesizeResults } from '@/lib/agents/synthesizer';
import { executeTool } from '@/lib/mcp/executor';
import { matchSOPs } from '@/lib/rag/retrieve';
import { activeStreams } from '@/lib/stream-helpers';
import { TaskExecution } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const { user_input } = await req.json();
    
    // Create initial run record
    const { data: runData, error: runError } = await supabaseAdmin
      .from('workflow_runs')
      .insert({ user_input, status: 'running' })
      .select()
      .single();
      
    if (runError) throw runError;
    const runId = runData.id;
    
    // Start background processing
    processWorkflow(runId, user_input).catch(console.error);
    
    // Return the run ID immediately so the client can connect to the SSE stream
    return NextResponse.json({ run_id: runId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function processWorkflow(runId: string, userInput: string) {
  const startTime = Date.now();
  
  // Wait a tiny bit to give the client time to connect to the SSE stream
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const stream = activeStreams.get(runId);
  const sendEvent = async (event: string, data: any) => {
    if (stream) await stream.sendEvent(event, data);
  };
  
  try {
    // 1. Planner Agent
    const plan = await createExecutionPlan(userInput);
    await supabaseAdmin.from('workflow_runs').update({ 
      execution_plan: plan,
      sub_task_count: plan.sub_tasks.length
    }).eq('id', runId);
    
    await sendEvent('planner', { plan });
    
    const taskExecutions: TaskExecution[] = [];
    
    // Process each sub-task
    for (const task of plan.sub_tasks) {
      const taskStartTime = Date.now();
      
      // Create task record
      const { data: taskData, error: taskError } = await supabaseAdmin
        .from('task_executions')
        .insert({
          run_id: runId,
          task_name: task.name,
          task_description: task.description,
          tool_used: task.required_tool,
          status: 'running',
          input_params: task.input_params,
          started_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (taskError) throw taskError;
      const taskId = taskData.id;
      
      await sendEvent('task_start', { task_id: taskId, task_name: task.name, tool: task.required_tool });
      
      try {
        // 2. RAG Retrieval
        const sops = await matchSOPs(task.description);
        await sendEvent('rag', { task_id: taskId, task_name: task.name, sops });
        
        // 3. Tool Execution
        const toolResult = await executeTool(task.required_tool, task.input_params, runId);
        
        // 4. Executor Agent
        const agentResult = await executeTaskWithAgent(task, sops, toolResult.result);
        
        const taskEndTime = Date.now();
        const durationMs = taskEndTime - taskStartTime;
        
        // Update task record
        const executionRecord = {
          status: 'completed',
          output_result: toolResult.result,
          sop_context: sops,
          confidence_score: agentResult.confidenceScore,
          reasoning: agentResult.reasoning,
          duration_ms: durationMs,
          completed_at: new Date().toISOString()
        };
        
        await supabaseAdmin
          .from('task_executions')
          .update(executionRecord)
          .eq('id', taskId);
          
        taskExecutions.push({
          id: taskId,
          run_id: runId,
          task_name: task.name,
          task_description: task.description,
          tool_used: task.required_tool,
          ...executionRecord
        } as unknown as TaskExecution);
        
        await sendEvent('task_done', { task_id: taskId, task_name: task.name, result: toolResult.result, duration_ms: durationMs });
        
      } catch (err: any) {
        await supabaseAdmin.from('task_executions').update({ status: 'failed', reasoning: err.message }).eq('id', taskId);
        await sendEvent('task_fail', { task_id: taskId, task_name: task.name, error: err.message });
      }
    }
    
    // 5. Synthesizer Agent
    const finalOutput = await synthesizeResults(userInput, taskExecutions);
    await sendEvent('synthesis', { output: finalOutput });
    
    const totalMs = Date.now() - startTime;
    await supabaseAdmin.from('workflow_runs').update({ 
      status: 'completed',
      final_output: finalOutput,
      total_duration_ms: totalMs
    }).eq('id', runId);
    
    await sendEvent('complete', { run_id: runId, total_ms: totalMs });
    
  } catch (error: any) {
    console.error('Workflow failed:', error);
    await supabaseAdmin.from('workflow_runs').update({ status: 'failed' }).eq('id', runId);
    await sendEvent('task_fail', { task_id: 'workflow', task_name: 'Workflow Execution', error: error.message });
  } finally {
    if (stream) {
      await stream.close();
      activeStreams.delete(runId);
    }
  }
}
