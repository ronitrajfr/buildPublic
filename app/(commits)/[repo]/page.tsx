import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommitList from "./commit-list"; 
import { getRepoCommits } from "../api";
export default async function RepoPage({ params }: { params: { repo: string } }) {
  const { repo } = await params;
    const commits:[] = await getRepoCommits({repo})
 


  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <span>{repo}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CommitList repo={repo} commits={commits} />
      </CardContent>
    </Card>
  );
}