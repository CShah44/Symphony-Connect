"use client";

import { useEffect, useState } from "react";
import Post from "./Post";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPostFeed } from "@/lib/database/models/post.model";
import { getPosts, getUserPosts } from "@/lib/actions/post.action";
import { Skeleton } from "../ui/skeleton";

const FeedContainer = ({ id }: { id?: string }) => {
  const [posts, setPosts] = useState<IPostFeed[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    async function getAllPosts() {
      const res = await getPosts();
      setPosts([...res]);
      setLoading(false);
    }

    async function handleGetUserPosts() {
      const data = await getUserPosts(id);
      setPosts(data);
      setLoading(false);
    }

    id ? handleGetUserPosts() : getAllPosts();
  }, []);

  const tabs = ["All", "Post", "Oppurtunity", "Event"];

  if (loading)
    return (
      <>
        <Skeleton className="my-4 p-4 md:w-[650px] w-full flex flex-col justify-center mx-auto h-[200px]" />
        <Skeleton className="my-4 p-4 md:w-[650px] w-full flex flex-col justify-center mx-auto h-[200px]" />
        <Skeleton className="my-4 p-4 md:w-[650px] w-full flex flex-col justify-center mx-auto h-[200px]" />
      </>
    );

  return (
    <div className="my-4 p-4 md:w-[650px] w-full flex flex-col justify-center mx-auto">
      {posts.length > 0 && !loading && (
        <Tabs defaultValue="All">
          <TabsList className="w-full bg-transparent mb-3  flex gap-4">
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
              <>
                {filteredPosts.length > 0 && (
                  <TabsContent
                    className="gap-5 flex flex-col"
                    key={t}
                    value={t}
                  >
                    {filteredPosts.map((post) => (
                      <Post
                        key={post._id}
                        post={post}
                        posts={posts}
                        setPosts={setPosts}
                      />
                    ))}
                  </TabsContent>
                )}
              </>
            );
          })}
        </Tabs>
      )}

      {loading && (
        <>
          <Skeleton className="my-4 p-4 md:w-[650px] w-full flex flex-col justify-center mx-auto h-[200px]" />
          <Skeleton className="my-4 p-4 md:w-[650px] w-full flex flex-col justify-center mx-auto h-[200px]" />
        </>
      )}

      {posts.length === 0 && !loading && (
        <div className="my-4 p-4 md:w-[650px] w-full flex flex-col justify-center mx-auto">
          <div className="text-center">No posts found</div>
        </div>
      )}
    </div>
  );
};

export default FeedContainer;
