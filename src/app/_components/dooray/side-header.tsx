"use client";
import "../light.css";
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

  console.log(posts, "milestones");
  return (
    <div className={cn("", className)}>
      <div className="h-[85px] flex items-center justify-center border">
        <div className="text-3xl font-bold text-center">
          {posts[0].project.code}
        </div>
      </div>
      <div className="mb-[7.1px] min-w-[300px]">
        <MilestoneList milestones={milestones} posts={posts} tags={tags} />
      </div>
    </div>
  );
};
