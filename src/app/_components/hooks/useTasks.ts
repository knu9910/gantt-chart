import { useFetchTasks } from "./useFetchTasks";
import { useCreateTask } from "./useCreateTask";
import { useUpdateTask } from "./useUpdateTask";
import { useDeleteTask } from "./useDeleteTask";

export function useTasks() {
  const { data: tasks = [], isLoading, error } = useFetchTasks();
  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
  };
}
