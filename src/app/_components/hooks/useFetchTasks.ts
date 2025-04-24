import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "./api";

export function useFetchTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
}
