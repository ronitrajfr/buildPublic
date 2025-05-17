"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Twitter } from "lucide-react";

interface Commit {
    sha: string; 
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  }
  

interface CommitListProps {
  repo: string;
  commits: Commit[];
}

export default function CommitList({ repo, commits }: CommitListProps) {
  const [selectedCommits, setSelectedCommits] = useState<Set<string>>(new Set());

  const toggleCommit = (commitId: string) => {
    setSelectedCommits((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commitId)) {
        newSet.delete(commitId);
      } else {
        newSet.add(commitId);
      }
      return newSet;
    });
  };

  const generateMultiTweet = () => {
    const selectedMessages = commits
      .filter((commit) => selectedCommits.has(commit.sha))
      .map((commit) => commit.message)
      .join(", ");
    const tweetText = `New commits in ${repo}: ${selectedMessages}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, "_blank");
  };

  return (
    <div className="space-y-4">
      {commits.map((commit) => (
        <CommitItem
          key={commit.sha}
          commit={commit}
          repoName={repo}
          isSelected={selectedCommits.has(commit.sha)}
          onToggle={() => toggleCommit(commit.sha)}
        />
      ))}
      {selectedCommits.size > 0 && (
        <Button onClick={generateMultiTweet} className="mt-4 w-full">
          <Twitter className="w-4 h-4 mr-2" />
          Generate Tweet for Selected Commits ({selectedCommits.size})
        </Button>
      )}
    </div>
  );
}

interface CommitItemProps {
  commit: Commit;
  repoName: string;
  isSelected: boolean;
  onToggle: () => void;
}

function CommitItem({ commit, repoName, isSelected, onToggle }: CommitItemProps) {
  return (
    <Card className="border border-gray-200">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Checkbox checked={isSelected} onCheckedChange={onToggle} aria-label={`Select commit: ${commit.message}`} />
          <div className="space-y-1">
            <p className="font-medium">{commit.message}</p>
            <p className="text-sm text-muted-foreground">
              {commit.author.name} • {new Date(commit.author.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <TweetButton commit={commit} repoName={repoName} />
      </CardContent>
    </Card>
  );
}

function TweetButton({ commit, repoName }: { commit: Commit; repoName: string }) {
  const generateTweet = () => {
    const tweetText = `New commit in ${repoName}: ${commit.message}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, "_blank");
  };

  return (
    <Button size="sm" variant="outline" onClick={generateTweet} className="flex items-center gap-2">
      <Twitter className="w-4 h-4" />
      Tweet
    </Button>
  );
}
