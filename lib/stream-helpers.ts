import { TraceEvent } from './types';

export function formatSSE(event: string, data: any): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

// In Next.js, we can use a TransformStream to send SSEs
export function createSSEStream() {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  
  const sendEvent = async (event: string, data: any) => {
    await writer.write(new TextEncoder().encode(formatSSE(event, data)));
  };
  
  const close = async () => {
    await writer.close();
  };
  
  return { readable, sendEvent, close };
}

// Global registry for active streams so the background processing can send to the open SSE connection
export const activeStreams = new Map<string, {
  sendEvent: (event: string, data: any) => Promise<void>;
  close: () => Promise<void>;
}>();
