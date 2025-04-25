"use client";

import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";
import {
  useDoorayProjectMilestones,
  useDoorayProjectPosts,
  useDoorayProjectTags,
} from "../../_hooks/dooray/use-dooray-projects";
import { MilestoneList } from "./milestone-list";

type Props = React.HTMLAttributes<HTMLElement>;

export const DooraySideHeader = ({ className }: Readonly<Props>) => {
  const [projectId] = useQueryState("projectId");
  const { data: milestones } = useDoorayProjectMilestones(projectId || "");
  const { data: posts } = useDoorayProjectPosts(projectId || "");
  const { data: tags } = useDoorayProjectTags(projectId || "");

  if (!projectId || !milestones || !posts || !tags) {
    return null;
  }

  return (
    <div className={cn("p-4", className)}>
      <h2 className="text-lg font-semibold mb-4">마일스톤 목록</h2>
      <MilestoneList milestones={milestones} posts={posts} tags={tags} />
    </div>
  );
};
