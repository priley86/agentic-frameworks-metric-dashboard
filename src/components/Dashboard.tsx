'use client';

import { useState } from 'react';
import { Send, Bot, TrendingUp, Star, GitFork, Activity } from 'lucide-react';
import MetricsGrid from './MetricsGrid';
import LoadingSpinner from './LoadingSpinner';

const DEFAULT_PROMPT = `Analyze the current landscape of AI Agent frameworks and Model Context Protocol (MCP) servers. Provide detailed metrics and insights on the following frameworks:

**AI Agent Frameworks:**
- LangChain
- AutoGPT
- CrewAI
- Microsoft Semantic Kernel
- Haystack
- LlamaIndex
- AgentGPT
- MetaGPT

**MCP Server Implementations:**
- FastMCP
- MCP Server SDK
- Claude MCP Servers
- OpenAI MCP Toolkit
- Local MCP Servers

For each framework/tool, provide:
1. GitHub stars and recent growth trends
2. Community sentiment and adoption metrics
3. Recent activity indicators (commits, releases, issues)
4. Popularity ranking within its category
5. Key strengths and use cases

Format the response as structured data that can be easily parsed for dashboard visualization.`;

export default function Dashboard() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const jsonStr = line.substring(2);
                const data = JSON.parse(jsonStr);
                if (data.content) {
                  fullResponse += data.content;
                  setResponse(fullResponse);
                }
              } catch {
                // Ignore JSON parsing errors for streaming data
              }
            }
          }
        }
      }

    } catch (error) {
      console.error('Error:', error);
      setResponse('Error: Failed to get analysis. Please check your OpenAI API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              AI Agent Metrics Dashboard
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Analyze popularity metrics, trends, and sentiment for AI Agent frameworks and MCP servers
          </p>
        </div>

        {/* Prompt Input Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Analysis Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={handleTextareaChange}
                  className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your analysis prompt here..."
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Activity className="w-4 h-4" />
                  <span>Powered by OpenAI</span>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {isLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Generate Analysis
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Analyzing AI frameworks and generating metrics...
            </p>
          </div>
        )}

        {/* Results Section */}
        {!isLoading && response.trim() && (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Analysis Results
              </h2>
            </div>
            
            {/* AI Response */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                  {response}
                </div>
              </div>
            </div>

            {/* Metrics Dashboard */}
            <MetricsGrid responseContent={response} />
          </div>
        )}

        {/* Welcome State */}
        {!isLoading && !response.trim() && (
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">GitHub Metrics</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Track stars, forks, and activity trends
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Popularity Trends</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Monitor adoption and community growth
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <GitFork className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Community Health</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Analyze sentiment and engagement
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Click &quot;Generate Analysis&quot; to start exploring AI framework metrics
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
