import { DoorayPost, DoorayTag } from "../../_hooks/dooray/use-dooray-projects";

interface PostItemProps {
  post: DoorayPost;
  tag?: DoorayTag;
}

export const PostItem = ({ post, tag }: PostItemProps) => (
  <div key={post.id} className="flex">
    <div className="border min-w-[300px] p-1 text-center">{post.subject}</div>
    <div className="border min-w-[100px] p-1 flex flex-col items-center text-center text-sm">
      <span
        className="border rounded-full px-2 "
        style={{
          backgroundColor: tag ? `#${tag.color}` : "transparent",
          color: tag?.color ? "#000" : "#666",
        }}
      >
        {tag?.name || "없어요"}
      </span>
    </div>
  </div>
);
