import CreatePostForm from "@/components/shared/CreatePostForm";
import FeedContainer from "@/components/shared/Feed";

const Feed = () => {
  return (
    <div className="font-agrandir pt-[120px] text-center mx-auto w-full">
      <FeedContainer />
      <CreatePostForm />
    </div>
  );
};

export default Feed;
