"use client";
import "./gantt.css";
import { useEffect, useRef, useState } from "react";
import Gantt from "frappe-gantt";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  isProject?: boolean;
  custom?: {
    담당자: string;
    설명: string;
  };
  children?: Task[];
}

const tasks: Task[] = [
  {
    id: "project1",
    name: "김해온물 프로젝트",
    start: new Date("2024-03-01"),
    end: new Date("2024-05-31"),
    progress: 40,
    isProject: true,
    custom: {
      담당자: "김철수",
      설명: "김해온물 프로젝트 관리",
    },
    children: [
      {
        id: "task1",
        name: "김해온물 기획하기",
        start: new Date("2024-03-01"),
        end: new Date("2024-03-15"),
        progress: 100,
        custom: {
          담당자: "김철수",
          설명: "김해온물 프로젝트 초기 기획 및 요구사항 정의",
        },
      },
      {
        id: "task2",
        name: "김해온물 제작하기",
        start: new Date("2024-03-16"),
        end: new Date("2024-04-30"),
        progress: 60,
        custom: {
          담당자: "이영희",
          설명: "김해온물 제작 및 개발",
        },
      },
      {
        id: "task3",
        name: "김해온물 테스트",
        start: new Date("2024-05-01"),
        end: new Date("2024-05-15"),
        progress: 20,
        custom: {
          담당자: "박지성",
          설명: "김해온물 테스트 및 품질 검증",
        },
      },
      {
        id: "task4",
        name: "김해온물 배포",
        start: new Date("2024-05-16"),
        end: new Date("2024-05-31"),
        progress: 0,
        custom: {
          담당자: "김철수",
          설명: "김해온물 배포 및 운영",
        },
      },
    ],
  },
  {
    id: "project2",
    name: "구미 프로젝트",
    start: new Date("2024-04-01"),
    end: new Date("2024-06-30"),
    progress: 20,
    isProject: true,
    custom: {
      담당자: "이영희",
      설명: "구미 프로젝트 관리",
    },
    children: [
      {
        id: "task5",
        name: "구미 프로젝트 기획",
        start: new Date("2024-04-01"),
        end: new Date("2024-04-15"),
        progress: 100,
        custom: {
          담당자: "이영희",
          설명: "구미 프로젝트 초기 기획",
        },
      },
      {
        id: "task6",
        name: "구미 프로젝트 개발",
        start: new Date("2024-04-16"),
        end: new Date("2024-06-15"),
        progress: 30,
        custom: {
          담당자: "박지성",
          설명: "구미 프로젝트 개발",
        },
      },
      {
        id: "task7",
        name: "구미 프로젝트 테스트",
        start: new Date("2024-06-16"),
        end: new Date("2024-06-30"),
        progress: 0,
        custom: {
          담당자: "이영희",
          설명: "구미 프로젝트 테스트",
        },
      },
    ],
  },
];

export default function GanttChart() {
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<Gantt | null>(null);
  const [viewMode, setViewMode] = useState<"Day" | "Week" | "Month">("Day");
  const [selectedProject, setSelectedProject] = useState<Task | null>(null);

  // 프로젝트만 필터링
  const projects = tasks.filter((task) => task.isProject);

  // 선택된 프로젝트의 하위 태스크를 간트 차트 형식으로 변환
  const getGanttTasks = (project: Task | null) => {
    if (!project || !project.children) return [];

    return project.children.map((task) => ({
      id: task.id,
      name: task.name,
      start: task.start.toISOString().split("T")[0],
      end: task.end.toISOString().split("T")[0],
      progress: task.progress,
      dependencies: "",
      custom: task.custom,
    }));
  };

  useEffect(() => {
    if (ganttRef.current) {
      ganttRef.current.innerHTML = "";

      ganttInstance.current = new Gantt(
        ganttRef.current,
        getGanttTasks(selectedProject),
        {
          view_mode: viewMode,
          on_date_change(task, start, end) {
            console.log(task, start, end);
          },
          on_click(task) {
            console.log(task);
          },
          popup: false,
          today_button: false,
          on_view_change(mode) {
            console.log(mode);
          },
          date_format: "YYYY/MM/DD",
          language: "ko",
          bar_height: 30,
          column_width: 100,
          bar_corner_radius: 4,
          arrow_curve: 5,
          padding: 100,
        }
      );
    }
  }, [selectedProject]);

  useEffect(() => {
    ganttInstance.current?.change_view_mode(viewMode);
  }, [viewMode]);

  return (
    <div className="gantt-container">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800">
              프로젝트 일정 관리
            </h1>
            <div className="w-[180px]">
              <Select
                value={viewMode}
                onValueChange={(value) =>
                  setViewMode(value as "Day" | "Week" | "Month")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="보기 모드 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Day">일간</SelectItem>
                  <SelectItem value="Week">주간</SelectItem>
                  <SelectItem value="Month">월간</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[320px] border-r bg-white overflow-y-auto">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`p-4 m-2 rounded-lg cursor-pointer transition-all ${
                  selectedProject?.id === project.id
                    ? "bg-blue-50 border-blue-500"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                } border`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="font-semibold text-gray-800">
                    {project.name}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>
                        {project.start.toLocaleDateString("ko-KR")} -{" "}
                        {project.end.toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    {project.custom?.담당자 && (
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        <span>담당자: {project.custom.담당자}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div ref={ganttRef} className="flex-1 overflow-auto" />
        </div>
      </div>
    </div>
  );
}
