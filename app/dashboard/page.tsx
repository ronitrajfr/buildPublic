import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RepoCard from "./components/RepoCards";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { getUserRepos } from "./api";

interface Repo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
}

async function Page() {
  const user = await currentUser();
  const repos: Repo[] = await getUserRepos();

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 sm:p-6 md:p-8 ">
      <div className="max-w-6xl mx-auto mt-100">
        <Card className="mb-8 ">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={user?.imageUrl}
                  alt={user?.username || "user"}
                />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {user?.username}
                </CardTitle>
                <CardDescription>GitHub Repositories</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <RepoCard
              key={repo.id}
              name={repo.name}
              description={repo.description}
              stargazersCount={repo.stargazers_count}
              forksCount={repo.forks_count}
            ></RepoCard>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
