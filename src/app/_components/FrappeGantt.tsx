"use client";

import { useEffect, useRef } from "react";

// dynamic import 사용하지 않아도 되지만, TypeScript 오류 방지를 위해 이렇게 처리
import Gantt from "frappe-gantt";

const tasks = [
  {
    id: "Task 1",
    name: "분석",
    start: "2025-04-21",
    end: "2025-04-24",
    progress: 50,
    dependencies: "",
  },
  {
    id: "Task 2",
    name: "개발",
    start: "2025-04-25",
    end: "2025-04-30",
    progress: 20,
    dependencies: "Task 1",
  },
];

export default function FrappeGantt() {
  const ganttRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // 서버 환경에서 실행 방지
    if (ganttRef.current) {
      ganttRef.current.innerHTML = "";
      new Gantt(ganttRef.current, tasks, {
        view_mode: "Week",
        date_format: "YYYY-MM-DD",
      });
    }
  }, []);

  return <div ref={ganttRef} className="overflow-x-auto" />;
}
