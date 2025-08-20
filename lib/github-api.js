// GitHub API utilities for patchnote.dev
import axios from "axios";

const GITHUB_API_BASE = "https://api.github.com";

// Fetch user's accessible repositories
export async function fetchUserRepositories(accessToken) {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/user/repos`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      params: {
        sort: "updated",
        per_page: 100,
        type: "all", // owner, collaborator, organization_member, all
      },
    });

    // Filter and format repository data
    const repos = response.data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name, // owner/repo format
      description: repo.description,
      htmlUrl: repo.html_url,
      defaultBranch: repo.default_branch,
      updatedAt: repo.updated_at,
      isPrivate: repo.private,
      owner: {
        login: repo.owner.login,
        avatarUrl: repo.owner.avatar_url,
      },
    }));

    return repos;
  } catch (error) {
    console.error("❌ Error fetching repositories:", error.response?.data || error.message);
    throw new Error("Failed to fetch repositories from GitHub");
  }
}

// Fetch commits from a specific repository
export async function fetchRepositoryCommits(accessToken, owner, repo, since = null) {
  try {
    const params = {
      per_page: 100,
      sha: "main", // You might want to make this configurable
    };

    // Add since parameter if provided (ISO 8601 format)
    if (since) {
      params.since = since;
    }

    const response = await axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}/commits`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      params,
    });

    // Format commit data
    const commits = response.data.map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: {
        name: commit.commit.author.name,
        email: commit.commit.author.email,
        date: commit.commit.author.date,
      },
      committer: {
        name: commit.commit.committer.name,
        date: commit.commit.committer.date,
      },
      htmlUrl: commit.html_url,
      stats: commit.stats, // additions, deletions, total
    }));

    return commits;
  } catch (error) {
    console.error("❌ Error fetching commits:", error.response?.data || error.message);
    throw new Error("Failed to fetch commits from GitHub");
  }
}

// Get repository information
export async function fetchRepositoryInfo(accessToken, owner, repo) {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    return {
      id: response.data.id,
      name: response.data.name,
      fullName: response.data.full_name,
      description: response.data.description,
      htmlUrl: response.data.html_url,
      defaultBranch: response.data.default_branch,
      isPrivate: response.data.private,
      owner: {
        login: response.data.owner.login,
        avatarUrl: response.data.owner.avatar_url,
      },
    };
  } catch (error) {
    console.error("❌ Error fetching repository info:", error.response?.data || error.message);
    throw new Error("Failed to fetch repository information");
  }
}