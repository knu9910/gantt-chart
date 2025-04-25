"use client";

import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";
import {
  useDoorayProjectMilestones,
  useDoorayProjectPosts,
} from "../_hooks/dooray/use-dooray-projects";

type Props = React.HTMLAttributes<HTMLElement>;

export const DooraySideHeader = ({ className }: Readonly<Props>) => {
  const [projectId] = useQueryState("projectId");
  const { data: milestones } = useDoorayProjectMilestones(projectId || "");
  const { data: posts } = useDoorayProjectPosts(projectId || "");

  if (!projectId) {
    return null;
  }
  console.log(milestones);
  console.log(posts);
  return (
    <div className={cn("p-4", className)}>
      <h2 className="text-lg font-semibold mb-4">마일스톤 목록</h2>
      <div className="flex gap-4">
        {milestones?.map((milestone) => {
          const milestonePosts = posts?.filter(
            (post) => post.milestone?.id === milestone.id
          );

          if (!milestonePosts?.length) return null;

          return (
            <div key={milestone.id} className="flex gap-2">
              <div className="px-3 py-2 border rounded-lg bg-gray-50 h-fit">
                <span className="font-medium whitespace-nowrap">
                  {milestone.name}
                </span>
              </div>
              <div className="flex gap-1">
                {milestonePosts.map((post) => (
                  <div
                    key={post.id}
                    className="px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="whitespace-nowrap">{post.subject}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
