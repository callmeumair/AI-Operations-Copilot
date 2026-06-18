import { NextResponse } from 'next/server';
import { executeTool } from '../../../lib/mcp/executor';

export async function POST(req: Request) {
  try {
    const { tool_name, params, session_id } = await req.json();
    
    if (!tool_name || !params || !session_id) {
      return NextResponse.json(
        { error: 'Missing required fields: tool_name, params, session_id' }, 
        { status: 400 }
      );
    }
    
    const result = await executeTool(tool_name, params, session_id);
    
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
