"use client";
import "./gantt.css";
import { useEffect, useRef, useState } from "react";
import { useTasks } from "../_hooks/use-tasks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { Task } from "@prisma/client";
import { useDebouncedCallback } from "use-debounce";
import Gantt from "frappe-gantt";
import { cn } from "@/lib/utils";
import { useDisplayPostsStore } from "../_store/display-posts-store";

type Props = React.HTMLAttributes<HTMLElement>;

export default function GanttChart({ className }: Readonly<Props>) {
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
  const [editingTask, setEditingTask] = useState<Omit<
    Task,
    "createdAt" | "updatedAt"
  > | null>(null);
  const { displayPostsCount } = useDisplayPostsStore();

  console.log(displayPostsCount, "displayPostsCount");
  const debouncedUpdateTask = useDebouncedCallback(async (value) => {
    await updateTask(value);
  }, 500);

  const createEmptyTasks = () => {
    const emptyTasks: Gantt.Task[] = [];
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // displayPostsCount만큼 빈 행 생성
    for (let i = 0; i < displayPostsCount - tasks.length; i++) {
      emptyTasks.push({
        id: `empty-${i}`,
        name: " ", // 빈 이름으로 표시
        start: today,
        end: tomorrow,
        progress: 0,
        custom_class: "empty-task", // 스타일링을 위한 클래스
      });
    }
    return emptyTasks;
  };

  const getGantInstance = () => {
    if (!ganttRef.current) return;
    ganttRef.current.innerHTML = "";

    // 실제 tasks와 빈 tasks를 합침
    const allTasks = [...tasks, ...createEmptyTasks()];

    ganttInstance.current = new Gantt(ganttRef.current, allTasks, {
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
        // empty-로 시작하는 ID를 가진 task는 편집하지 않음
        if (task.id?.startsWith("empty-")) return;

        if (task.id && task.name && task.start && task.end) {
          setEditingTask({
            ...task,
            id: task.id,
            name: task.name,
            start: new Date(task.start),
            end: new Date(task.end),
          });
        }
      },
      on_date_change: async (task, start, end) => {
        if (task.id?.startsWith("empty-")) return;
        if (!task.id || !task.name) return;

        await debouncedUpdateTask({
          id: task.id,
          start: new Date(start),
          end: new Date(end),
          name: task.name,
          progress: task.progress || 0,
        });
      },
    });
  };

  useEffect(() => {
    getGantInstance();
  }, [isFetching, displayPostsCount]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingTask) return;
    setEditingTask({ ...editingTask, name: e.target.value });
  };

  const handleNameSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && editingTask) {
      await updateTask({
        id: editingTask.id,
        name: editingTask.name,
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
    <div className={cn("", className)}>
      <div className="relative">
        <div className="gantt-ref" ref={ganttRef} />
        {editingTask && (
          <div className="absolute top-[-4rem] left-[12rem] transform -translate-x-1/2 p-2 rounded-lg shadow-lg z-50">
            <div className="flex items-center gap-2 ">
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
