import { DoorayProjects } from "./_components/dooray-projects";
import { DooraySideHeader } from "./_components/dooray/side-header";
import GanttChart from "./_components/gantt-chart";

export default function Home() {
  return (
    <div className="flex p-24 flex-col gap-4">
      <div className="w-30 mb-32">
        <DoorayProjects />
      </div>
      <div className="min-w-[300px] gap-10">
        <DooraySideHeader className="flex-3" />
        <GanttChart />
      </div>
    </div>
  );
}
