import { useQuery } from "@tanstack/react-query";
import { Task } from "@prisma/client";

export function useFetchTasks(projectId: string) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/tasks?projectId=${projectId}`);
      return response.json() as Promise<Task[]>;
    },
  });
}
