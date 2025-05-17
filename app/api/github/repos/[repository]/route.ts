import { currentUser, auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("Missing Redis configuration");
}

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "30 s"),
  analytics: true,
});

export async function GET(
  req: NextRequest,
  { params }: { params: { repository: string } }
) {
  try {
    const { repository } = await params;
    if (!repository) {
      return NextResponse.json(
        { message: "Repository name is required" },
        { status: 400 }
      );
    }

    const user = await currentUser();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "User not found" });
    }
    const provider = "oauth_github";
    const client = await clerkClient();
    const clerkResponse = await client.users.getUserOauthAccessToken(
      userId,
      provider
    );

    if (
      !clerkResponse.data ||
      !Array.isArray(clerkResponse.data) ||
      clerkResponse.data.length === 0
    ) {
      return NextResponse.json(
        { message: "GitHub access token not found" },
        { status: 401 }
      );
    }

    const accessToken = clerkResponse.data[0]?.token;
    if (!accessToken) {
      return NextResponse.json(
        { message: "Access token not found" },
        { status: 401 }
      );
    }

    const githubUrl = `https://api.github.com/repos/${user?.username}/${repository}/commits`;

    const githubResponse = await fetch(githubUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (!githubResponse.ok) {
      return NextResponse.json(
        { message: "Failed to fetch data from GitHub API" },
        { status: githubResponse.status }
      );
    }
    const reposData = await githubResponse.json();

    const filteredCommits = reposData.map((commit: any) => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: {
        name: commit.commit.author.name,
        email: commit.commit.author.email,
        date: commit.commit.author.date,
      },
    }));

    return NextResponse.json(filteredCommits);
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500 }
    );
  }
}
