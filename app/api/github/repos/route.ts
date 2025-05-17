import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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
