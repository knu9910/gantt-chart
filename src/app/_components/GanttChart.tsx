"use client";
import "./gantt.css";
import { useEffect, useRef, useState } from "react";
import Gantt from "frappe-gantt";
import { useTasks } from "../_hooks/useTasks";
import CreateTaskForm from "./CreateTaskForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function GanttChart() {
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<Gantt | null>(null);
  const {
    tasks,
    isFetching,
    isLoading,
    error,
    updateTask,
    deleteTask,
    refetch,
  } = useTasks();
  const [editingTask, setEditingTask] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const getGantInstance = () => {
    if (ganttRef.current) {
      ganttRef.current.innerHTML = "";
      ganttInstance.current = new Gantt(ganttRef.current, tasks, {
        view_mode: "Day",
        date_format: "YYYY-MM-DD",
        language: "ko",
        column_width: 30,
        bar_height: 20,
        bar_corner_radius: 0,
        infinite_padding: false,
        scroll_to: "start",
        popup: false,
        on_click: (task) => {
          if (task.id && task.name) {
            setEditingTask({
              id: task.id,
              name: task.name,
            });
          }
        },
        on_date_change: async (task, start, end) => {
          if (task.id && task.name) {
            await updateTask({
              id: task.id,
              start: start.toISOString().split("T")[0],
              end: end.toISOString().split("T")[0],
              name: task.name,
              progress: task.progress || 0,
            });
            refetch();
          }
        },
        on_progress_change: async (task, progress) => {
          if (task.id && task.name && task.start && task.end) {
            await updateTask({
              id: task.id,
              start: task.start,
              end: task.end,
              name: task.name,
              progress: progress || 0,
            });
            refetch();
          }
        },
      });
    }
  };

  useEffect(() => {
    getGantInstance();
  }, [isFetching]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingTask) return;
    setEditingTask({ ...editingTask, name: e.target.value });
  };

  const handleNameSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && editingTask) {
      updateTask({
        id: editingTask.id,
        name: editingTask.name,
        start: tasks.find((t) => t.id === editingTask.id)?.start || "",
        end: tasks.find((t) => t.id === editingTask.id)?.end || "",
        progress: tasks.find((t) => t.id === editingTask.id)?.progress || 0,
      });
      setEditingTask(null);
    } else if (e.key === "Escape") {
      setEditingTask(null);
    }
  };

  const handleDelete = async () => {
    if (!editingTask) return;
    await deleteTask(editingTask.id);
    setEditingTask(null);
    refetch();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="mx-64">
      <div className="mb-4">
        <CreateTaskForm />
      </div>
      <div className="overflow-hidden relative">
        <div className="gantt-ref h-screen" ref={ganttRef} />
        {editingTask && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg z-50">
            <div className="flex items-center gap-2">
              <Input
                value={editingTask.name}
                onChange={handleNameChange}
                onKeyDown={handleNameSubmit}
                className="w-64"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingTask(null)}
                className="h-8 w-8 p-0"
              >
                X
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
