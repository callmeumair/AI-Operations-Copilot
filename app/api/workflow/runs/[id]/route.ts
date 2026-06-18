import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get run details
    const { data: run, error: runError } = await supabaseAdmin
      .from('workflow_runs')
      .select('*')
      .eq('id', id)
      .single();
      
    if (runError) throw runError;
    
    // Get task executions for this run
    const { data: tasks, error: tasksError } = await supabaseAdmin
      .from('task_executions')
      .select('*')
      .eq('run_id', id)
      .order('started_at', { ascending: true });
      
    if (tasksError) throw tasksError;
    
    return NextResponse.json({ ...run, task_executions: tasks });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
