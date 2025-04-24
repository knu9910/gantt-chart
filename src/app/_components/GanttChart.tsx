"use client";
import "./gantt.css";
import { useEffect, useRef } from "react";
import Gantt from "frappe-gantt";

export default function GanttChart() {
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<Gantt | null>(null);

  useEffect(() => {
    if (!ganttRef.current) return;

    ganttInstance.current = new Gantt(ganttRef.current, [], {
      view_mode: "Day",
      date_format: "YYYY-MM-DD",
      language: "ko",
      column_width: 30, // 컬럼 너비
      // view_end: "2025-12-31",
      on_click: (task) => {
        console.log(task);
      },
      on_date_change: (task, start, end) => {
        console.log(task, start, end);
      },
      on_progress_change: (task, progress) => {
        console.log(task, progress);
      },
    });
  }, []);

  return (
    <div className="gantt-container mt-24 mx-24 overflow-hidden">
      <div ref={ganttRef} />
    </div>
  );
}
