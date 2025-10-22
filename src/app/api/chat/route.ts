import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

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
    return new Response('Error processing request', { status: 500 });
  }
}
