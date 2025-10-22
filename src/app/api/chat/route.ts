import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 120;

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
      
      CRITICAL REQUIREMENTS:
      1. MUST analyze ALL frameworks mentioned in the user's request - do not skip any
      2. MUST provide COMPLETE analysis in a single response 
      3. NEVER indicate analysis is "in progress", "pending", or "will be completed later"
      4. If a framework list contains numbered items, analyze EVERY number in sequence
      
      Format requirements:
      - Use section headers: ## MAIN FRAMEWORKS ANALYSIS and ## EMERGING FRAMEWORKS DISCOVERED
      - For each framework use this EXACT format:
      
      **Framework Name:** [Name]
      **Category:** [AI Framework or MCP Server]  
      **Description:** [Brief description]
      **GitHub Stars:** [Number] (estimate if needed)
      **Recent Growth:** [Percentage] over the past 6 months (estimate if needed)
      **Community Sentiment:** [Positive/Very Positive/Neutral]
      **Recent Activity:** [Number] commits in the last month
      **Key Strengths:** [Brief list]
      **Use Cases:** [Primary applications]
      
      Provide reasonable estimates for all metrics. Focus on being comprehensive and complete.`,
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
