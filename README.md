# AI Agent Metrics Dashboard

A comprehensive dashboard for analyzing AI Agent frameworks and Model Context Protocol (MCP) servers. This application provides real-time metrics, popularity trends, and sentiment analysis powered by OpenAI.

![Dashboard Preview](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=AI+Agent+Metrics+Dashboard)

## ✨ Features

- **🤖 AI-Powered Analysis**: Uses OpenAI to analyze framework popularity and trends
- **📊 Interactive Metrics**: Beautiful charts and visualizations using Recharts
- **🔄 Real-time Updates**: Dynamic dashboard that updates based on AI responses
- **🎨 Modern UI**: Responsive design with Tailwind CSS and dark mode support
- **⚡ Fast Performance**: Built with Next.js 15 and React Server Components
- **🚀 Easy Deployment**: One-click deployment to Vercel

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Vercel AI SDK + OpenAI
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd agent-metrics-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install --registry https://registry.npmjs.org/
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📈 How It Works

1. **Enter Analysis Prompt**: Use the pre-filled prompt or create your own to analyze specific AI frameworks
2. **AI Processing**: The application sends your prompt to OpenAI for analysis
3. **Dynamic Dashboard**: Results are displayed in an interactive dashboard with charts and metrics
4. **Real-time Updates**: Modify your prompt and get updated analysis instantly

## 🌐 Deployment to Vercel

### Method 1: Deploy from GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `OPENAI_API_KEY`: Your OpenAI API key

3. **Deploy**
   - Click "Deploy"
   - Your app will be live in minutes!

### Method 2: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add OPENAI_API_KEY
   ```

### Method 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/agent-metrics-dashboard&env=OPENAI_API_KEY&envDescription=OpenAI%20API%20key%20for%20AI%20analysis)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | ✅ Yes |
| `NEXT_PUBLIC_APP_URL` | Your app URL (auto-set by Vercel) | ❌ No |

### Customization

- **Modify the default prompt** in `src/components/Dashboard.tsx`
- **Add new metrics** in `src/components/MetricsGrid.tsx`
- **Customize styling** with Tailwind CSS classes
- **Update AI model** in `src/app/api/chat/route.ts`

## 📊 Example Frameworks Analyzed

The dashboard can analyze various AI frameworks and MCP servers:

**AI Agent Frameworks:**
- LangChain
- AutoGPT
- CrewAI
- Microsoft Semantic Kernel
- Haystack
- LlamaIndex
- MetaGPT

**MCP Server Implementations:**
- FastMCP
- MCP Server SDK
- Claude MCP Servers
- OpenAI MCP Toolkit

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [GitHub Issues](https://github.com/your-username/agent-metrics-dashboard/issues)
2. Create a new issue with detailed information
3. Join our [Discord community](https://discord.gg/your-invite) for support

## 🙏 Acknowledgments

- [Vercel](https://vercel.com) for the amazing deployment platform
- [OpenAI](https://openai.com) for powerful AI capabilities
- [Next.js](https://nextjs.org) for the excellent React framework
- [Tailwind CSS](https://tailwindcss.com) for beautiful styling

---

**Made with ❤️ for the AI community**
