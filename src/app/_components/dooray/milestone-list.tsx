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

const EmptyPost: DoorayPost = {
  id: "",
  subject: "",
  tags: [],
  createdAt: "",
  updatedAt: "",
};

export const MilestoneList = ({
  milestones,
  posts,
  tags,
}: MilestoneListProps) => {
  return (
    <div className="flex flex-col">
      {milestones.map((milestone) => {
        const milestonePosts = posts.filter(
          (post) => post.milestone?.id === milestone.id
        );

        // 포스트가 없으면 빈 포스트 3개 생성
        const displayPosts =
          milestonePosts.length > 0
            ? milestonePosts
            : [EmptyPost, EmptyPost, EmptyPost];

        return (
          <div key={milestone.id} className="flex ">
            <div className="px-8 border min-w-[200px] flex items-center">
              {milestone.name}
            </div>
            <div className="flex flex-col">
              {displayPosts.map((post, index) => (
                <PostItem
                  key={post.id || `empty-${milestone.id}-${index}`}
                  post={post}
                  tag={tags.find((tag) => tag.id === post.tags[0]?.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
