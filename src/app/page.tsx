import { DoorayProjects } from "./_components/dooray-projects";
import GanttChart from "./_components/gantt-chart";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <DoorayProjects />
      <GanttChart />
    </div>
  );
}
