import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "@prisma/client";

interface GanttTask {
  id?: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  custom_class?: string;
}

interface UseTasksProps {
  projectId?: string;
}

export function useTasks({ projectId = "" }: UseTasksProps = {}) {
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/tasks?projectId=${projectId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      return response.json();
    },
  });

  const { mutateAsync: createTask } = useMutation({
    mutationFn: async (task: Omit<GanttTask, "id" | "custom_class">) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...task, projectId }),
      });
      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  const { mutateAsync: updateTask } = useMutation({
    mutationFn: async (task: Partial<Task>) => {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...task, projectId }),
      });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  const { mutateAsync: deleteTask } = useMutation({
    mutationFn: async (taskId: string) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  return {
    tasks,
    isLoading,
    isFetching,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch,
  };
}
