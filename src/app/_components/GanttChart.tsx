"use client";
import "./gantt.css";
import { useEffect, useRef, useState } from "react";
import Gantt from "frappe-gantt";

const tasks = [
  {
    id: "Task 1",
    name: "프로젝트 기획",
    start: "2025-01-01",
    end: "2025-01-05",
  },
  {
    id: "Task 2",
    name: "UI/UX 디자인",
    start: "2025-01-03",
    end: "2025-01-10",
  },
  {
    id: "Task 3",
    name: "프론트엔드 개발",
    start: "2025-01-08",
    end: "2025-01-20",
  },
  {
    id: "Task 4",
    name: "백엔드 개발",
    start: "2025-01-15",
    end: "2025-3-31",
  },
];

export default function GanttChart() {
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<Gantt | null>(null);

  useEffect(() => {
    if (!ganttRef.current) return;

    ganttInstance.current = new Gantt(ganttRef.current, tasks, {
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
