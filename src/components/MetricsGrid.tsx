'use client';

import { Star, TrendingUp, Activity, Users, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface MetricsGridProps {
  responseContent: string;
}

interface FrameworkData {
  name: string;
  category: string;
  stars: number;
  forks: number;
  recentCommits: number;
  sentiment: string;
  growth: string;
  popularity: number;
  description: string;
}

// Mock data for demonstration - in a real app, this would be parsed from the AI response
const mockMainFrameworkData: FrameworkData[] = [
  {
    name: 'LangChain',
    category: 'AI Framework',
    stars: 89500,
    forks: 14200,
    recentCommits: 1247,
    sentiment: 'Positive',
    growth: '+15%',
    popularity: 95,
    description: 'Building applications with LLMs through composability and data-aware chains'
  },
  {
    name: 'AutoGPT',
    category: 'AI Framework', 
    stars: 165000,
    forks: 44000,
    recentCommits: 892,
    sentiment: 'Very Positive',
    growth: '+22%',
    popularity: 98,
    description: 'Autonomous AI agent that attempts to achieve goals by breaking them into sub-tasks'
  },
  {
    name: 'CrewAI',
    category: 'AI Framework',
    stars: 18500,
    forks: 2800,
    recentCommits: 456,
    sentiment: 'Positive',
    growth: '+38%',
    popularity: 78,
    description: 'Framework for orchestrating role-playing, autonomous AI agents in collaborative workflows'
  },
  {
    name: 'FastMCP',
    category: 'MCP Server',
    stars: 3200,
    forks: 180,
    recentCommits: 89,
    sentiment: 'Positive',
    growth: '+45%',
    popularity: 65,
    description: 'High-performance Model Context Protocol server implementation'
  },
  {
    name: 'Semantic Kernel',
    category: 'AI Framework',
    stars: 21300,
    forks: 3100,
    recentCommits: 623,
    sentiment: 'Positive',
    growth: '+18%',
    popularity: 82,
    description: 'Microsoft\'s open-source SDK for integrating AI services with conventional languages'
  },
  {
    name: 'LlamaIndex',
    category: 'AI Framework',
    stars: 34700,
    forks: 4900,
    recentCommits: 1156,
    sentiment: 'Very Positive',
    growth: '+28%',
    popularity: 88,
    description: 'Data framework for building LLM applications with structured and unstructured data'
  }
];

// Mock emerging frameworks data
const mockEmergingFrameworkData: FrameworkData[] = [
  {
    name: 'QuantumAI',
    category: 'AI Framework',
    stars: 2400,
    forks: 180,
    recentCommits: 234,
    sentiment: 'Positive',
    growth: '+156%',
    popularity: 45,
    description: 'Innovative framework integrating quantum computing paradigms with AI agent workflows'
  },
  {
    name: 'BioCompute',
    category: 'AI Framework',
    stars: 1850,
    forks: 120,
    recentCommits: 189,
    sentiment: 'Very Positive',
    growth: '+89%',
    popularity: 38,
    description: 'Specialized AI agent framework for healthcare data and bioinformatics applications'
  },
  {
    name: 'DecentralizedMCP',
    category: 'MCP Server',
    stars: 980,
    forks: 67,
    recentCommits: 156,
    sentiment: 'Positive',
    growth: '+203%',
    popularity: 32,
    description: 'Blockchain-based MCP server for decentralized model context interactions'
  },
  {
    name: 'CloudNativeMCP',
    category: 'MCP Server',
    stars: 1200,
    forks: 89,
    recentCommits: 201,
    sentiment: 'Positive',
    growth: '+127%',
    popularity: 41,
    description: 'Cloud-native MCP server designed for seamless integration with AWS, GCP, and Azure'
  }
];

const chartData = mockMainFrameworkData.map(item => ({
  name: item.name,
  stars: item.stars / 1000, // Convert to thousands for better display
  popularity: item.popularity
}));

const emergingChartData = mockEmergingFrameworkData.map(item => ({
  name: item.name,
  stars: item.stars / 1000,
  popularity: item.popularity
}));

const renderFrameworkTable = (frameworks: FrameworkData[], title: string, icon: React.ReactNode) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        {icon}
        {title}
      </h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Stars
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Growth
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Sentiment
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {frameworks.map((framework, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {framework.name}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                  {framework.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  framework.category === 'AI Framework' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                }`}>
                  {framework.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {framework.stars.toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-green-600">
                  {framework.growth}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  framework.sentiment === 'Very Positive'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                }`}>
                  {framework.sentiment}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const allFrameworks = [...mockMainFrameworkData, ...mockEmergingFrameworkData];

export default function MetricsGrid({ responseContent }: MetricsGridProps) {
  // TODO: Parse responseContent to extract real metrics data
  // For now, using mock data for demonstration
  console.log('Response content for parsing:', responseContent);
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Frameworks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{allFrameworks.length}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Stars</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(allFrameworks.reduce((acc: number, item: FrameworkData) => acc + item.stars, 0) / allFrameworks.length / 1000)}k
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Growth</p>
              <p className="text-2xl font-bold text-green-600">+25%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {allFrameworks.filter((item: FrameworkData) => item.recentCommits > 500).length}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Main Frameworks - GitHub Stars
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}k`, 'Stars']} />
              <Bar dataKey="stars" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Main Frameworks - Popularity Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="popularity" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Emerging Frameworks Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Emerging Frameworks - GitHub Stars
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={emergingChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}k`, 'Stars']} />
              <Bar dataKey="stars" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            Emerging Frameworks - Growth Potential
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={emergingChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="popularity" stroke="#8B5CF6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Frameworks Table */}
      {renderFrameworkTable(mockMainFrameworkData, "Main AI Frameworks & MCP Servers", <Activity className="w-5 h-5 text-blue-500" />)}

      {/* Emerging Frameworks Table */}
      <div className="mt-8">
        {renderFrameworkTable(mockEmergingFrameworkData, "Emerging & Trending Frameworks", <Sparkles className="w-5 h-5 text-purple-500" />)}
      </div>
    </div>
  );
}
