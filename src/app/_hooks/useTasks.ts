import { useFetchTasks } from "./useFetchTasks";
import { useCreateTask } from "./useCreateTask";
import { useUpdateTask } from "./useUpdateTask";
import { useDeleteTask } from "./useDeleteTask";

export function useTasks() {
  const {
    data: tasks = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useFetchTasks();
  const { mutateAsync: createTask } = useCreateTask();
  const { mutateAsync: updateTask } = useUpdateTask();
  const { mutateAsync: deleteTask } = useDeleteTask();

  return {
    tasks,
    isLoading,
    isFetching,
    error,
    refetch,
    createTask,
    updateTask,
    deleteTask,
  };
}
