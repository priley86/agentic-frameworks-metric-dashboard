// GitHub API integration for real-time repository data
export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  html_url: string;
  topics: string[];
  license?: {
    name: string;
  };
  archived: boolean;
  disabled: boolean;
  default_branch: string;
  size: number;
  subscribers_count: number;
  network_count: number;
}

export interface GitHubCommitActivity {
  week: number;
  days: number[];
  total: number;
}

export interface GitHubReleases {
  tag_name: string;
  name: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
}

export interface GitHubRepoMetrics {
  repo: GitHubRepo;
  commitActivity?: GitHubCommitActivity[];
  releases?: GitHubReleases[];
  contributors?: number;
  languages?: Record<string, number>;
}

class GitHubAPI {
  private baseURL = 'https://api.github.com';
  private token?: string;

  constructor() {
    // Try to get GitHub token from environment
    this.token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    console.log('GitHub API initialized with token:', this.token ? 'YES' : 'NO');
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'AI-Agent-Metrics-Dashboard',
    };

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers,
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API error (${response.status}): ${error}`);
    }

    return response.json();
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepo> {
    return this.makeRequest<GitHubRepo>(`/repos/${owner}/${repo}`);
  }

  async getCommitActivity(owner: string, repo: string): Promise<GitHubCommitActivity[]> {
    try {
      return await this.makeRequest<GitHubCommitActivity[]>(`/repos/${owner}/${repo}/stats/commit_activity`);
    } catch (error) {
      console.warn(`Failed to fetch commit activity for ${owner}/${repo}:`, error);
      return [];
    }
  }

  async getReleases(owner: string, repo: string, limit = 10): Promise<GitHubReleases[]> {
    try {
      return await this.makeRequest<GitHubReleases[]>(`/repos/${owner}/${repo}/releases?per_page=${limit}`);
    } catch (error) {
      console.warn(`Failed to fetch releases for ${owner}/${repo}:`, error);
      return [];
    }
  }

  async getLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    try {
      return await this.makeRequest<Record<string, number>>(`/repos/${owner}/${repo}/languages`);
    } catch (error) {
      console.warn(`Failed to fetch languages for ${owner}/${repo}:`, error);
      return {};
    }
  }

  async getContributorsCount(owner: string, repo: string): Promise<number> {
    try {
      const contributors = await this.makeRequest<Array<{ login: string; contributions: number }>>(`/repos/${owner}/${repo}/contributors?per_page=1`);
      // GitHub includes a Link header for pagination, but for simplicity, we'll estimate
      return contributors.length;
    } catch (error) {
      console.warn(`Failed to fetch contributors count for ${owner}/${repo}:`, error);
      return 0;
    }
  }

  async getFullRepoMetrics(owner: string, repo: string): Promise<GitHubRepoMetrics> {
    try {
      const [repoData, commitActivity, releases, languages] = await Promise.all([
        this.getRepository(owner, repo),
        this.getCommitActivity(owner, repo),
        this.getReleases(owner, repo),
        this.getLanguages(owner, repo),
      ]);

      return {
        repo: repoData,
        commitActivity,
        releases,
        languages,
        contributors: await this.getContributorsCount(owner, repo),
      };
    } catch (error) {
      console.error(`Failed to fetch full metrics for ${owner}/${repo}:`, error);
      throw error;
    }
  }

  async searchRepositories(query: string, sort: 'stars' | 'forks' | 'updated' = 'stars', limit = 10): Promise<GitHubRepo[]> {
    try {
      const response = await this.makeRequest<{ items: GitHubRepo[] }>(`/search/repositories?q=${encodeURIComponent(query)}&sort=${sort}&order=desc&per_page=${limit}`);
      return response.items;
    } catch (error) {
      console.error(`Failed to search repositories with query "${query}":`, error);
      return [];
    }
  }
}

// Known repository mappings for popular AI frameworks
export const KNOWN_REPOS: Record<string, { owner: string; repo: string }> = {
  // Main AI Frameworks (with variations)
  'langgraph': { owner: 'langchain-ai', repo: 'langgraph' },
  'LangGraph': { owner: 'langchain-ai', repo: 'langgraph' },
  'langchain': { owner: 'langchain-ai', repo: 'langchain' },
  'autogpt': { owner: 'Significant-Gravitas', repo: 'AutoGPT' },
  'AutoGPT': { owner: 'Significant-Gravitas', repo: 'AutoGPT' },
  'crewai': { owner: 'crewAIInc', repo: 'crewAI' },
  'CrewAI': { owner: 'crewAIInc', repo: 'crewAI' },
  'semantic-kernel': { owner: 'microsoft', repo: 'semantic-kernel' },
  'microsoft semantic kernel': { owner: 'microsoft', repo: 'semantic-kernel' },
  'Microsoft Semantic Kernel': { owner: 'microsoft', repo: 'semantic-kernel' },
  'llamaindex': { owner: 'run-llama', repo: 'llama_index' },
  'LlamaIndex': { owner: 'run-llama', repo: 'llama_index' },
  'agentgpt': { owner: 'reworkd', repo: 'AgentGPT' },
  'AgentGPT': { owner: 'reworkd', repo: 'AgentGPT' },
  'vercel-ai': { owner: 'vercel', repo: 'ai' },
  'vercel ai sdk': { owner: 'vercel', repo: 'ai' },
  'Vercel AI SDK': { owner: 'vercel', repo: 'ai' },
  
  // MCP Servers and Tools
  'fastmcp': { owner: 'jlowin', repo: 'fastmcp' },
  'FastMCP': { owner: 'jlowin', repo: 'fastmcp' },
  'mcp server sdk': { owner: 'modelcontextprotocol', repo: 'python-sdk' },
  'MCP Server SDK': { owner: 'modelcontextprotocol', repo: 'python-sdk' },
  'claude mcp servers': { owner: 'modelcontextprotocol', repo: 'servers' },
  'Claude MCP Servers': { owner: 'modelcontextprotocol', repo: 'servers' },
  'openai mcp toolkit': { owner: 'openai', repo: 'openai-python' },
  'OpenAI MCP Toolkit': { owner: 'openai', repo: 'openai-python' },
  'local mcp servers': { owner: 'modelcontextprotocol', repo: 'servers' },
  'Local MCP Servers': { owner: 'modelcontextprotocol', repo: 'servers' },
  
  // Emerging Frameworks (with variations)
  'langfuse': { owner: 'langfuse', repo: 'langfuse' },
  'Langfuse': { owner: 'langfuse', repo: 'langfuse' },
  'phidata': { owner: 'phidatahq', repo: 'phidata' },
  'Phidata': { owner: 'phidatahq', repo: 'phidata' },
  'composio': { owner: 'ComposioHQ', repo: 'composio' },
  'Composio': { owner: 'ComposioHQ', repo: 'composio' },
  'swarm': { owner: 'openai', repo: 'swarm' },
  'Swarm': { owner: 'openai', repo: 'swarm' },
  'autogen': { owner: 'microsoft', repo: 'autogen' },
  'Autogen': { owner: 'microsoft', repo: 'autogen' },
  'controlflow': { owner: 'PrefectHQ', repo: 'ControlFlow' },
  'ControlFlow': { owner: 'PrefectHQ', repo: 'ControlFlow' },
  'taskweaver': { owner: 'microsoft', repo: 'TaskWeaver' },
  'TaskWeaver': { owner: 'microsoft', repo: 'TaskWeaver' },
  
  // Cloudflare alternatives
  'cloudflare agents': { owner: 'cloudflare', repo: 'agents' },
  'Cloudflare Agents': { owner: 'cloudflare', repo: 'workers-ai' },
};

// Function to find GitHub repo info for a framework name
export async function findGitHubRepo(frameworkName: string): Promise<{ owner: string; repo: string } | null> {
  const originalLower = frameworkName.toLowerCase();
  const normalized = originalLower.replace(/[^a-z0-9]/g, '-');
  const noSpaces = originalLower.replace(/\s+/g, '');
  const withDashes = originalLower.replace(/\s+/g, '-');
  
  console.log(`Looking for GitHub repo for: "${frameworkName}"`);
  console.log(`Trying variations: "${originalLower}", "${normalized}", "${noSpaces}", "${withDashes}"`);
  
  // Create a case-insensitive lookup by converting all keys to lowercase
  const lowerCaseRepos: Record<string, { owner: string; repo: string }> = {};
  Object.entries(KNOWN_REPOS).forEach(([key, value]) => {
    lowerCaseRepos[key.toLowerCase()] = value;
  });
  
  // Check known mappings first - try multiple variations
  const checks = [
    originalLower,
    normalized, 
    noSpaces,
    withDashes,
    // Also try without common prefixes/suffixes
    originalLower.replace(/^(microsoft\s+|openai\s+|claude\s+|local\s+)/i, ''),
    originalLower.replace(/(\s+sdk|\s+servers|\s+toolkit|\s+agents)$/i, ''),
  ];
  
  for (const check of checks) {
    if (lowerCaseRepos[check]) {
      console.log(`Found exact match for "${check}":`, lowerCaseRepos[check]);
      return lowerCaseRepos[check];
    }
  }
  
  // Check for partial matches in known repos (case insensitive)
  const partialMatch = Object.entries(lowerCaseRepos).find(([key]) => 
    key.includes(originalLower) || originalLower.includes(key) ||
    // Also check without spaces/dashes
    key.replace(/[-\s]/g, '').includes(noSpaces) || 
    noSpaces.includes(key.replace(/[-\s]/g, ''))
  );
  
  if (partialMatch) {
    console.log(`Found partial match for "${frameworkName}":`, partialMatch[1]);
    return partialMatch[1];
  }

  // Try to search for the repository
  try {
    console.log(`Searching GitHub for: "${frameworkName}"`);
    const github = new GitHubAPI();
    const results = await github.searchRepositories(frameworkName, 'stars', 5);
    
    // Look for the most relevant result
    const candidate = results.find(repo => 
      repo.name.toLowerCase().includes(frameworkName.toLowerCase()) ||
      repo.description?.toLowerCase().includes(frameworkName.toLowerCase()) ||
      repo.topics?.some(topic => topic.toLowerCase().includes(frameworkName.toLowerCase()))
    );

    if (candidate) {
      const [owner, repo] = candidate.full_name.split('/');
      console.log(`Found search result for "${frameworkName}":`, { owner, repo });
      return { owner, repo };
    }
  } catch (error) {
    console.error(`Failed to search for ${frameworkName}:`, error);
  }

  console.log(`No GitHub repo found for: "${frameworkName}"`);
  return null;
}

export default GitHubAPI;
