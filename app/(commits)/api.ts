import { auth } from "@clerk/nextjs/server";

export const getRepoCommits = async({repo}:{repo:string})=>{
      const {getToken } = await auth();
      const token = await getToken(); 
    try {   
        const response = await fetch(`http://localhost:3000/api/github/repos/${repo}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error(`Failed to fetch repos: ${response.statusText}`);
        }
    
        const data = await response.json();
        return data
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
        return null;
      }
    
}