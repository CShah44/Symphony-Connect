import Post from "./Post";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FeedContainer = () => {
  const posts = [
    {
      id: 1,
      username: "John Doe",
      profilePicture: "https://via.placeholder.com/50",
      postText: "This is my first post!",
      postImage: "https://via.placeholder.com/500",
      likes: 10,
      comments: 2,
      type: "Oppurtunity",
      tags: ["arijit", "bollywood"],
    },
    {
      id: 2,
      username: "Jane Smith",
      profilePicture: "https://via.placeholder.com/50",
      postText: "I'm so excited for the weekend!",
      postImage: "https://via.placeholder.com/500",
      likes: 20,
      comments: 5,
      type: "Post",
      tags: ["hollywood", "dua lipa"],
    },
  ];

  const tabs = ["All", "Post", "Oppurtunity", "Event"];

  return (
    <div className="my-4 p-4 md:w-[650px] w-fullflex flex-col justify-center mx-auto">
      <Tabs defaultValue="All" className="">
        <TabsList className="w-full bg-transparent ">
          {tabs.map((t) => (
            <TabsTrigger key={t} value={t}>
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => {
          let filteredPosts = posts;

          if (t !== "All") filteredPosts = posts.filter((p) => p.type === t);

          return (
            <TabsContent className="gap-5 flex flex-col" key={t} value={t}>
              {filteredPosts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default FeedContainer;
