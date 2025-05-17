import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("Missing Redis configuration");
}

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

//10 REQUESTS PER 10 SECONDS
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});

export async function GET() {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") ?? "anonymous";

    const { success, limit, reset, remaining } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        {
          error: "Too many requests",
          limit,
          reset,
          remaining,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }
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
    const githubUrl = "https://api.github.com/user/repos";

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

    return NextResponse.json(reposData);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "An error occurred", error: error },
      { status: 500 }
    );
  }
}
