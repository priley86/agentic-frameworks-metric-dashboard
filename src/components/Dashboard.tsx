'use client';

import { useState } from 'react';
import { Send, Bot, TrendingUp, Star, GitFork, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import MetricsGrid from './MetricsGrid';
import LoadingSpinner from './LoadingSpinner';

const DEFAULT_PROMPT = `Analyze the current landscape of AI Agent frameworks and Model Context Protocol (MCP) servers. This analysis will be enhanced with real-time GitHub data automatically. Provide detailed insights on the following frameworks:

**AI Agent Frameworks (ANALYZE ALL 8):**
1. LangGraph
2. AutoGPT  
3. CrewAI
4. Microsoft Semantic Kernel
5. Cloudflare Agents
6. LlamaIndex
7. AgentGPT
8. Vercel AI SDK

**MCP Server Implementations (ANALYZE ALL 5):**
1. FastMCP
2. MCP Server SDK
3. Claude MCP Servers
4. OpenAI MCP Toolkit
5. Local MCP Servers

CRITICAL: You MUST analyze ALL 13 frameworks listed above. Do not skip any.

For each framework/tool, provide:
1. Community sentiment and adoption metrics  
2. Key strengths and use cases
3. Target audience and typical use cases
4. Documentation quality and developer experience
5. Integration capabilities and ecosystem

**NOTE:** GitHub metrics (stars, forks, commits, releases) will be automatically fetched from the real GitHub API and displayed alongside your analysis.

**Additional Discovery Section:**
Please also identify and analyze emerging or popular frameworks not listed above that are gaining traction in the industry. Look for:

**Emerging AI Agent Frameworks:**
- New or rapidly growing agent frameworks released in the last 12-18 months
- Frameworks with significant GitHub activity or community buzz
- Enterprise or startup-backed agent solutions
- Specialized agent frameworks for specific domains (finance, healthcare, etc.)

**Emerging MCP Server Implementations:**
- New MCP server SDKs or implementations
- Alternative MCP protocol implementations
- Domain-specific MCP servers
- Enterprise or cloud-native MCP solutions

**CRITICAL: DO NOT just say "pending analysis" - you MUST actually discover and analyze specific emerging frameworks. Research and identify at least 3-5 real emerging frameworks that fit the criteria above.**

**IMPORTANT: For each newly discovered framework/server, provide the COMPLETE analysis including:**
1. **Community sentiment and adoption metrics** (developer feedback, usage statistics)
2. **Key strengths and use cases** (detailed technical capabilities)
3. **Project description** (what it does, target audience, main features)
4. **Why it wasn't in our original list** (recency, niche focus, etc.)
5. **What makes it noteworthy or different** (unique features, approach)
6. **Potential impact on the ecosystem** (market disruption potential)
7. **Adoption trajectory and growth potential** (future outlook)

**MUST INCLUDE REAL EXAMPLES:** Some frameworks you should consider researching include:
- Langfuse (LLM observability)
- Phidata (AI assistant framework)
- Composio (tool integration platform)
- ControlFlow (workflow orchestration)
- Swarm (multi-agent orchestration)
- Autogen Studio (visual agent builder)
- TaskWeaver (code-first agent framework)
- Any other emerging frameworks you discover

**CRITICAL RESPONSE FORMAT REQUIREMENT:**
Please structure your response with these EXACT section headers:

## MAIN FRAMEWORKS ANALYSIS

## EMERGING FRAMEWORKS DISCOVERED

For each framework in both sections, use this EXACT format (this is critical for parsing):
**Framework Name:** [Name]
**Category:** [AI Framework | MCP Server]
**Description:** [Brief description of what it does]
**Community Sentiment:** [Positive/Very Positive/Neutral]
**Key Strengths:** [Brief list]
**Use Cases:** [Primary applications]
**Target Audience:** [Who uses this framework]
**Documentation Quality:** [Excellent/Good/Fair/Poor]

NEVER include "pending analysis" or "will be completed later" messages. Always provide complete analysis for all sections.`;

export default function Dashboard() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasResponse, setHasResponse] = useState(false);
  const [isResponseExpanded, setIsResponseExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse('');
    setHasResponse(false);

    try {
      // Step 1: Get AI analysis
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
        const errorData = await res.text();
        console.error('API Error:', res.status, errorData);
        throw new Error(`API request failed: ${res.status} - ${errorData}`);
      }

      // Handle streaming response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            fullResponse += chunk;
            setResponse(fullResponse); // Update UI in real-time
          }
        } finally {
          reader.releaseLock();
        }
      } else {
        // Fallback to text response if streaming isn't available
        fullResponse = await res.text();
        setResponse(fullResponse);
      }

      // Step 2: Extract framework names and fetch real GitHub data
      console.log('Fetching real GitHub data for frameworks...');
      
      // Extract framework names from the response and known frameworks
      const mainFrameworks = [
        'LangGraph', 'AutoGPT', 'CrewAI', 'Microsoft Semantic Kernel', 
        'Cloudflare Agents', 'LlamaIndex', 'AgentGPT', 'Vercel AI SDK',
        'FastMCP', 'MCP Server SDK', 'Claude MCP Servers', 'OpenAI MCP Toolkit', 'Local MCP Servers'
      ];
      
      // Also try to extract emerging frameworks from the AI response
      const emergingFrameworkMatches = fullResponse.match(/\*\*Framework Name:\*\*\s*([^\n\r]+)/g) || [];
      const emergingFrameworks = emergingFrameworkMatches
        .map(match => match.replace(/\*\*Framework Name:\*\*\s*/, '').trim())
        .filter(name => !mainFrameworks.some(main => main.toLowerCase() === name.toLowerCase()));

      const allFrameworks = [...mainFrameworks, ...emergingFrameworks];
      
      // Fetch GitHub data for all frameworks
      const githubRes = await fetch('/api/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frameworks: allFrameworks
        }),
      });

      if (githubRes.ok) {
        const githubData = await githubRes.json();
        console.log('Successfully fetched GitHub data for', githubData.data?.length || 0, 'frameworks');
        
        // Append GitHub data to the response in a format that MetricsGrid can parse
        const githubDataSection = '\n\n## REAL-TIME GITHUB DATA\n\n' + 
          (githubData.data || []).map((item: { 
            name: string; 
            github_stars?: number; 
            github_forks?: number; 
            recent_commits?: number; 
            recent_releases?: number; 
            primary_language?: string; 
            last_updated?: string; 
            repo_url?: string; 
          }) => 
            `**${item.name}:**\n` +
            `- GitHub Stars: ${item.github_stars?.toLocaleString() || 'N/A'}\n` +
            `- Forks: ${item.github_forks?.toLocaleString() || 'N/A'}\n` +
            `- Recent Commits (4 weeks): ${item.recent_commits || 'N/A'}\n` +
            `- Recent Releases (30 days): ${item.recent_releases || 'N/A'}\n` +
            `- Language: ${item.primary_language || 'N/A'}\n` +
            `- Last Updated: ${item.last_updated ? new Date(item.last_updated).toLocaleDateString() : 'N/A'}\n` +
            `- Repository: ${item.repo_url || 'N/A'}\n`
          ).join('\n');
          
        // Also store the raw GitHub data as JSON for direct parsing
        const rawGitHubData = '\n\n## RAW_GITHUB_DATA\n' + JSON.stringify(githubData.data, null, 2) + '\n';
          
        setResponse(fullResponse + githubDataSection + rawGitHubData);
      } else {
        console.warn('Failed to fetch GitHub data, continuing with AI analysis only');
      }
      
      setHasResponse(true);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setResponse(`Error: ${errorMessage}\n\nPlease check:\n1. Your OpenAI API key is set in Vercel environment variables\n2. Your API key has sufficient credits\n3. Check the Vercel function logs for more details`);
      setHasResponse(true);
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
              AI Agent Framework Metrics Dashboard
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
        {hasResponse && !isLoading && (
          <div className="max-w-8xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Analysis Results
              </h2>
            </div>
            
            {/* AI Response */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
              <button 
                onClick={() => setIsResponseExpanded(!isResponseExpanded)}
                className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Raw AI Analysis Response
                  </h3>
                  {isResponseExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {isResponseExpanded ? 'Click to collapse' : 'Click to view the complete AI analysis'}
                </p>
              </button>
              {isResponseExpanded && (
                <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="prose dark:prose-invert max-w-none mt-4">
                    <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-sm">
                      {response}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Metrics Dashboard */}
            <MetricsGrid responseContent={response} />
          </div>
        )}

        {/* Welcome State */}
        {!hasResponse && !isLoading && (
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
