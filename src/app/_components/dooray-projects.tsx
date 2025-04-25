"use client";

import { cn } from "@/lib/utils";
import { useDoorayProjects } from "../_hooks/dooray/use-dooray-projects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryState } from "nuqs";

type Props = React.HTMLAttributes<HTMLElement>;

export const DoorayProjects = ({ className }: Readonly<Props>) => {
  const [projectId, setProjectId] = useQueryState("projectId");
  const { data, isLoading, error } = useDoorayProjects();

  console.log(data, "data");
  if (isLoading) {
    return (
      <div className={cn("p-2 text-gray-500", className)}>
        프로젝트 목록을 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("p-2 text-red-500", className)}>
        프로젝트 목록을 불러오는데 실패했습니다.
        <br />
        <span className="text-sm">{error.message}</span>
      </div>
    );
  }

  if (!data?.result?.length) {
    return (
      <div className={cn("p-2 text-gray-500", className)}>
        사용 가능한 프로젝트가 없습니다.
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <Select
        value={projectId || ""}
        onValueChange={(value) => setProjectId(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="프로젝트를 선택하세요" />
        </SelectTrigger>
        <SelectContent>
          {data.result.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
