import { auth } from "@clerk/nextjs/server";

export const getUserRepos = async() =>{
      const {getToken } = await auth();
      const token = await getToken(); 
    try {   
        const response = await fetch("http://localhost:3000/api/github/repos", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error(`Failed to fetch repos: ${response.statusText}`);
        }
    
        return await response.json();
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
      }
    
}