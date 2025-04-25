import {
  DoorayMilestone,
  DoorayPost,
  DoorayTag,
} from "../../_hooks/dooray/use-dooray-projects";
import { PostItem } from "./post-item";

interface MilestoneListProps {
  milestones: DoorayMilestone[];
  posts: DoorayPost[];
  tags: DoorayTag[];
}

export const MilestoneList = ({
  milestones,
  posts,
  tags,
}: MilestoneListProps) => {
  return (
    <div className="flex flex-col">
      {milestones.map((milestone) => (
        <div key={milestone.id} className="flex">
          <div className="p-4 border min-w-[140px] flex items-center">
            {milestone.name}
          </div>
          <div className="flex flex-col">
            {posts
              .filter((post) => post.milestone?.id === milestone.id)
              .map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  tag={tags.find((tag) => tag.id === post.tags[0]?.id)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
