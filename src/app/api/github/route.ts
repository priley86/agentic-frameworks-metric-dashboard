import { NextRequest, NextResponse } from 'next/server';
import GitHubAPI, { findGitHubRepo, KNOWN_REPOS } from '@/lib/github';

export async function POST(request: NextRequest) {
  try {
    const { frameworks } = await request.json();
    
    if (!frameworks || !Array.isArray(frameworks)) {
      return NextResponse.json(
        { error: 'Invalid request: frameworks array required' },
        { status: 400 }
      );
    }

    const github = new GitHubAPI();
    const results = [];

    for (const framework of frameworks) {
      try {
        console.log(`Fetching GitHub data for: ${framework}`);
        
        // Find the GitHub repository for this framework
        const repoInfo = await findGitHubRepo(framework);
        
        if (!repoInfo) {
          console.warn(`Could not find GitHub repository for: ${framework}`);
          results.push({
            name: framework,
            error: 'Repository not found',
            github_stars: 0,
            github_forks: 0,
            last_updated: null,
            recent_releases: 0,
            languages: {},
            repo_url: null
          });
          continue;
        }

        // Fetch full repository metrics
        const metrics = await github.getFullRepoMetrics(repoInfo.owner, repoInfo.repo);
        
        // Calculate recent activity metrics
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const recentReleases = metrics.releases?.filter(release => 
          new Date(release.published_at) > thirtyDaysAgo
        ).length || 0;

        // Calculate commit activity for the last 4 weeks
        const recentCommits = (Array.isArray(metrics.commitActivity) && metrics.commitActivity.length > 0) 
          ? metrics.commitActivity.slice(-4).reduce((sum, week) => sum + week.total, 0) 
          : 0;

        // Determine primary language
        const languages = metrics.languages || {};
        const primaryLanguage = Object.keys(languages).reduce((a, b) => 
          languages[a] > languages[b] ? a : b, Object.keys(languages)[0] || 'Unknown'
        );

        results.push({
          name: framework,
          github_stars: metrics.repo.stargazers_count,
          github_forks: metrics.repo.forks_count,
          github_issues: metrics.repo.open_issues_count,
          last_updated: metrics.repo.updated_at,
          last_pushed: metrics.repo.pushed_at,
          created_at: metrics.repo.created_at,
          recent_releases: recentReleases,
          recent_commits: recentCommits,
          contributors: metrics.contributors || 0,
          languages: languages,
          primary_language: primaryLanguage,
          repo_url: metrics.repo.html_url,
          description: metrics.repo.description,
          topics: metrics.repo.topics || [],
          archived: metrics.repo.archived,
          size_kb: metrics.repo.size,
          subscribers: metrics.repo.subscribers_count,
          network_count: metrics.repo.network_count,
          license: metrics.repo.license?.name || null,
          default_branch: metrics.repo.default_branch
        });

        console.log(`Successfully fetched data for ${framework}: ${metrics.repo.stargazers_count} stars`);
        
      } catch (error) {
        console.error(`Error fetching data for ${framework}:`, error);
        results.push({
          name: framework,
          error: error instanceof Error ? error.message : 'Unknown error',
          github_stars: 0,
          github_forks: 0,
          last_updated: null,
          recent_releases: 0,
          languages: {},
          repo_url: null
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: results,
      timestamp: new Date().toISOString(),
      total_frameworks: frameworks.length
    });

  } catch (error) {
    console.error('GitHub API route error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return information about known repositories for debugging
  return NextResponse.json({
    message: 'GitHub data API endpoint',
    known_repositories: Object.keys(KNOWN_REPOS).length,
    usage: 'POST /api/github with { frameworks: ["framework1", "framework2"] }',
    example_frameworks: Object.keys(KNOWN_REPOS).slice(0, 10)
  });
}
