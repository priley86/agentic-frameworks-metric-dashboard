import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Processing chat request with', messages.length, 'messages');

    const result = await streamText({
      model: openai('gpt-4-turbo'),
      messages,
      system: `You are an AI expert specializing in analyzing AI Agent frameworks and Model Context Protocol (MCP) servers. 
      
      When analyzing frameworks and tools, provide detailed, accurate information about:
      1. GitHub statistics (stars, forks, recent activity)
      2. Community sentiment and adoption trends
      3. Recent developments and version releases
      4. Market positioning and competitive analysis
      5. Technical strengths and use cases
      
      Format your responses with clear sections and structure. Include specific numbers when possible, but if you don't have exact current data, provide estimates based on your training data and clearly indicate they are estimates.
      
      Focus on providing actionable insights that would be valuable for developers choosing between these frameworks.`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Return a more detailed error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: 'Error processing request',
        details: errorMessage,
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
