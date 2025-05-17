"use client"
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitBranch } from "lucide-react";
import {  useRouter } from "next/navigation";

interface RepoCardProps {
  name: string;
  description: string;
  stargazersCount: number;
  forksCount: number;
}

const RepoCard: React.FC<RepoCardProps> = ({
  name,
  description,
  stargazersCount,
  forksCount,
}) => {
  const router = useRouter()
  const handleClick = () =>{
    router.push(`/${name}`)
  }
  return (
    <Card className="cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300" onClick={handleClick}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description || ""}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Star className="h-4 w-4" />
            <span>{stargazersCount}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <GitBranch className="h-4 w-4" />
            <span>{forksCount}</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepoCard;
