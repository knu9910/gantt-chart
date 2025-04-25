import CreateTaskForm from "./_components/crate-task-form";
import { DoorayProjects } from "./_components/dooray-projects";
import { DooraySideHeader } from "./_components/dooray/side-header";
import GanttChart from "./_components/gantt-chart";

export default function Home() {
  return (
    <div className="flex p-10 flex-col gap-4">
      <CreateTaskForm />

      <div className="w-30 mb-10">
        <DoorayProjects />
      </div>
      <div className="flex items-center min-w-[300px]">
        <DooraySideHeader className="flex-1" />
        <GanttChart className="flex-2 h-full" />
      </div>
    </div>
  );
}
