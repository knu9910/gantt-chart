import { useState, useEffect } from "react";

interface DoorayProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const useDoorayProjects = () => {
  const [projects, setProjects] = useState<DoorayProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/dooray/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, isLoading, error };
};
