"use client";
import "./gantt.css";
import { useEffect, useRef } from "react";
import Gantt from "frappe-gantt";
import { useTasks } from "../_hooks/useTasks";
import CreateTaskForm from "./CreateTaskForm";

export default function GanttChart() {
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<Gantt | null>(null);
  const { tasks, isLoading, error } = useTasks();

  useEffect(() => {
    if (!ganttRef.current) return;

    // tasks가 있고 아직 간트 차트가 초기화되지 않았을 때만 생성
    if (tasks && tasks.length > 0 && !ganttInstance.current) {
      ganttInstance.current = new Gantt(ganttRef.current, tasks, {
        view_mode: "Day",
        date_format: "YYYY-MM-DD",
        language: "ko",
        column_width: 30,
        bar_height: 20,
        bar_corner_radius: 0,
        infinite_padding: false,
        on_click: (task) => {
          console.log("Task clicked:", task);
        },
        on_date_change: (task, start, end) => {
          console.log("Date changed:", task, start, end);
        },
        on_progress_change: (task, progress) => {
          console.log("Progress changed:", task, progress);
        },
      });
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (ganttInstance.current) {
        ganttInstance.current = null;
      }
    };
  }, [isLoading]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="mx-64">
      <div className="mb-4">
        <CreateTaskForm />
      </div>
      <div className="overflow-hidden">
        <div ref={ganttRef} />
      </div>
    </div>
  );
}
