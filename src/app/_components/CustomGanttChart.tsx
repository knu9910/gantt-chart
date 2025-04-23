"use client";

import { useEffect, useRef, useState } from "react";
import "./custom-gantt.css";

interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies?: string;
  custom?: {
    담당자: string;
    설명: string;
  };
  isProject?: boolean;
  children?: Task[];
}

interface GanttChartProps {
  tasks: Task[];
  viewMode?: "day" | "week" | "month";
}

export default function CustomGanttChart({
  tasks,
  viewMode = "day",
}: GanttChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set()
  );

  // 날짜 포맷팅 함수
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 날짜 차이 계산 함수
  const getDaysBetween = (start: Date, end: Date) => {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  // 타임라인 날짜 생성 함수
  const generateTimelineDates = () => {
    const dates: Date[] = [];
    const startDate = new Date(
      Math.min(...tasks.map((task) => task.start.getTime()))
    );
    const endDate = new Date(
      Math.max(...tasks.map((task) => task.end.getTime()))
    );

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      if (currentViewMode === "day") {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (currentViewMode === "week") {
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (currentViewMode === "month") {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    return dates;
  };

  // 프로젝트 확장/축소 토글
  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  // 태스크 렌더링 함수
  const renderTask = (task: Task, level: number = 0) => {
    const isExpanded = expandedProjects.has(task.id);
    const hasChildren = task.children && task.children.length > 0;

    const taskItem = document.createElement("div");
    taskItem.className = `task-item ${task.isProject ? "project" : ""}`;
    taskItem.style.paddingLeft = `${level * 20 + 16}px`;

    const taskContent = document.createElement("div");
    taskContent.className = "task-content";

    if (hasChildren) {
      const expandButton = document.createElement("button");
      expandButton.className = `expand-button ${isExpanded ? "expanded" : ""}`;
      expandButton.innerHTML = isExpanded ? "▼" : "▶";
      expandButton.onclick = (e) => {
        e.stopPropagation();
        toggleProject(task.id);
      };
      taskContent.appendChild(expandButton);
    }

    const taskInfo = document.createElement("div");
    taskInfo.className = "task-info";
    taskInfo.innerHTML = `
      <div class="task-name">${task.name}</div>
      <div class="task-details">
        <div class="task-progress" style="width: ${task.progress}%"></div>
        <div class="task-meta">
          <span class="task-date">${formatDate(task.start)} - ${formatDate(
      task.end
    )}</span>
          ${
            task.custom?.담당자
              ? `<span class="task-assignee">담당자: ${task.custom.담당자}</span>`
              : ""
          }
        </div>
      </div>
    `;
    taskContent.appendChild(taskInfo);
    taskItem.appendChild(taskContent);

    return taskItem;
  };

  // 간트 차트 렌더링
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    // 헤더 생성
    const header = document.createElement("div");
    header.className = "gantt-header";

    // 뷰 모드 선택 버튼
    const viewModeButtons = document.createElement("div");
    viewModeButtons.className = "view-mode-buttons";
    ["day", "week", "month"].forEach((mode) => {
      const button = document.createElement("button");
      button.textContent =
        mode === "day" ? "일간" : mode === "week" ? "주간" : "월간";
      button.className = `view-mode-button ${
        currentViewMode === mode ? "active" : ""
      }`;
      button.onclick = () =>
        setCurrentViewMode(mode as "day" | "week" | "month");
      viewModeButtons.appendChild(button);
    });
    header.appendChild(viewModeButtons);
    container.appendChild(header);

    // 그리드 생성
    const grid = document.createElement("div");
    grid.className = "gantt-grid";

    // 타임라인 헤더
    const timelineHeader = document.createElement("div");
    timelineHeader.className = "timeline-header";

    // 타임라인 날짜 생성
    const dates = generateTimelineDates();
    dates.forEach((date) => {
      const dateCell = document.createElement("div");
      dateCell.className = "timeline-header-cell";
      if (currentViewMode === "day") {
        dateCell.textContent = formatDate(date);
      } else if (currentViewMode === "week") {
        const weekStart = new Date(date);
        const weekEnd = new Date(date);
        weekEnd.setDate(weekEnd.getDate() + 6);
        dateCell.textContent = `${formatDate(weekStart)} - ${formatDate(
          weekEnd
        )}`;
      } else if (currentViewMode === "month") {
        dateCell.textContent = date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
        });
      }
      timelineHeader.appendChild(dateCell);
    });

    // 타임라인 그리드
    const timelineGrid = document.createElement("div");
    timelineGrid.className = "timeline-grid";

    // 그리드 셀 생성
    dates.forEach(() => {
      const gridCell = document.createElement("div");
      gridCell.className = "timeline-grid-cell";
      timelineGrid.appendChild(gridCell);
    });

    // 태스크 리스트
    const taskList = document.createElement("div");
    taskList.className = "task-list";

    // 태스크 그리드
    const taskGrid = document.createElement("div");
    taskGrid.className = "task-grid";

    // 태스크 렌더링
    const renderTasks = (
      tasks: Task[],
      level: number = 0,
      rowIndex: number = 0
    ) => {
      let currentRowIndex = rowIndex;

      tasks.forEach((task) => {
        const taskItem = renderTask(task, level);
        taskList.appendChild(taskItem);

        // 태스크 바 생성
        if (!task.isProject || expandedProjects.has(task.id)) {
          const taskBar = document.createElement("div");
          taskBar.className = `task-bar ${task.isProject ? "project" : ""}`;

          const startIndex = dates.findIndex(
            (d) => d.getTime() >= task.start.getTime()
          );
          const endIndex = dates.findIndex(
            (d) => d.getTime() >= task.end.getTime()
          );

          if (startIndex !== -1 && endIndex !== -1) {
            taskBar.style.gridColumn = `${startIndex + 1} / span ${
              endIndex - startIndex + 1
            }`;
            taskBar.style.gridRow = `${currentRowIndex + 1}`;
            taskBar.style.top = `${currentRowIndex * 40}px`;
            taskBar.innerHTML = `
              <div class="task-bar-progress" style="width: ${task.progress}%"></div>
              <div class="task-bar-label">${task.name}</div>
            `;
            taskGrid.appendChild(taskBar);
          }
        }

        currentRowIndex++;

        // 하위 태스크 렌더링
        if (task.children && expandedProjects.has(task.id)) {
          currentRowIndex = renderTasks(
            task.children,
            level + 1,
            currentRowIndex
          );
        }
      });

      return currentRowIndex;
    };

    renderTasks(tasks);

    grid.appendChild(timelineHeader);
    grid.appendChild(timelineGrid);
    grid.appendChild(taskList);
    grid.appendChild(taskGrid);
    container.appendChild(grid);
  }, [tasks, currentViewMode, expandedProjects]);

  return (
    <div className="custom-gantt-container">
      <div ref={containerRef} className="gantt-container" />
    </div>
  );
}
