import { NextRequest } from 'next/server';
import { createSSEStream, activeStreams } from '../../../../lib/stream-helpers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const runId = searchParams.get('run_id');

  if (!runId) {
    return new Response('Missing run_id', { status: 400 });
  }

  const { readable, sendEvent, close } = createSSEStream();
  
  // Register the stream so the background process can send events to it
  activeStreams.set(runId, { sendEvent, close });
  
  // Clean up if the client disconnects
  req.signal.addEventListener('abort', () => {
    activeStreams.delete(runId);
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
