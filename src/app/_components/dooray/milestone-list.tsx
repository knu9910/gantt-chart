import {
  DoorayMilestone,
  DoorayPost,
  DoorayTag,
} from "../../_hooks/dooray/use-dooray-projects";
import { PostItem } from "./post-item";
import { useDisplayPostsStore } from "../../_store/display-posts-store";
import { useEffect } from "react";

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
  closed: false,
  dueDateFlag: false,
  fileIdList: [],
  number: 0,
  parent: undefined,
  priority: "",
  project: {
    id: "",
    code: "",
  },
  taskNumber: "",
  users: { from: {}, to: [], cc: [] },
  workflow: { id: "", name: "" },
  workflowClass: "",
};

export const MilestoneList = ({
  milestones,
  posts,
  tags,
}: MilestoneListProps) => {
  const { setDisplayPostsCount } = useDisplayPostsStore();

  useEffect(() => {
    // 모든 milestone의 displayPosts 수를 합산
    const totalDisplayPostsCount = milestones.reduce((total, milestone) => {
      const milestonePosts = posts.filter(
        (post) => post.milestone?.id === milestone.id
      );
      const displayPostsCount =
        milestonePosts.length > 0 ? milestonePosts.length : 3;
      return total + displayPostsCount;
    }, 0);

    setDisplayPostsCount(totalDisplayPostsCount);
  }, [milestones, posts, setDisplayPostsCount]);

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
