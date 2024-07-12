"use client";

import { useEffect, useState } from "react";
import Post from "./Post";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPost, IPostFeed } from "@/lib/database/models/post.model";
import { getPosts } from "@/lib/actions/post.action";

const FeedContainer = () => {
  const [posts, setPosts] = useState<IPostFeed[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    async function getAllPosts() {
      const res = await getPosts();
      setPosts([...res]);
    }

    getAllPosts();
    setLoading(false);
  }, []);

  const tabs = ["All", "Post", "Oppurtunity", "Event"];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="my-4 p-4 md:w-[650px] w-full flex flex-col justify-center mx-auto">
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
                <Post
                  key={post._id}
                  post={post}
                  posts={posts}
                  setPosts={setPosts}
                />
              ))}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default FeedContainer;
