import { NextRequest } from 'next/server';

const AUTH_SERVICE = process.env.AUTH_SERVICE;

if (!AUTH_SERVICE) {
  throw new Error('AUTH_SERVICE environment variable is required');
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await context.params;

  if (!threadId) {
    return new Response('Thread ID is required', { status: 400 });
  }

  console.log('🔌 [SSE Stream] Client connecting for threadId:', threadId);

  try {
    // Create a TransformStream to handle SSE
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Fetch from backend SSE endpoint
    const backendUrl = `${AUTH_SERVICE}/auth/ndi/stream/${threadId}`;
    console.log('🔌 [SSE Stream] Backend URL:', backendUrl);

    // Start fetching in the background
    (async () => {
      try {
        console.log('🔌 [SSE Stream] Connecting to backend...');
        const response = await fetch(backendUrl, {
          headers: {
            Accept: 'text/event-stream'
          }
        });

        console.log(
          '🔌 [SSE Stream] Backend response status:',
          response.status
        );

        if (!response.ok) {
          console.error(
            '❌ [SSE Stream] Backend connection failed:',
            response.status
          );
          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ status: 'error', error: 'Failed to connect to verification stream' })}\n\n`
            )
          );
          await writer.close();
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          console.error('❌ [SSE Stream] No reader available');
          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ status: 'error', error: 'Stream not available' })}\n\n`
            )
          );
          await writer.close();
          return;
        }

        console.log('✅ [SSE Stream] Connected, streaming data...');
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log('🔌 [SSE Stream] Stream ended naturally');
            await writer.close();
            break;
          }

          // Forward the chunk to the client
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // Log complete messages (lines ending with \n\n)
          if (buffer.includes('\n\n')) {
            const messages = buffer.split('\n\n');
            buffer = messages.pop() || ''; // Keep incomplete message in buffer

            for (const message of messages) {
              if (message.trim() && !message.startsWith(':')) {
                console.log('📨 [SSE Stream] Complete message:', message);
              }
            }
          }

          await writer.write(encoder.encode(chunk));
        }
      } catch (error) {
        console.error('❌ [SSE Stream] Error:', error);
        try {
          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ status: 'error', error: error instanceof Error ? error.message : 'Stream connection failed' })}\n\n`
            )
          );
          await writer.close();
        } catch (e) {
          console.error('❌ [SSE Stream] Error closing writer:', e);
        }
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive'
      }
    });
  } catch (error) {
    console.error('Error in NDI stream route:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
