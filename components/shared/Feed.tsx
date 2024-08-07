"use client";

import { useState } from "react";
import Post from "./Post";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPostFeed } from "@/lib/database/models/post.model";

const FeedContainer = ({ initialPosts }: { initialPosts: IPostFeed[] }) => {
  const [posts, setPosts] = useState<IPostFeed[]>(initialPosts);

  const tabs = ["All", "Post", "Oppurtunity", "Event"];

  return (
    <div className="my-4 p-4 w-full flex flex-col justify-center">
      {posts.length > 0 && (
        <Tabs defaultValue="All">
          <TabsList className="w-full bg-transparent mb-3 flex gap-4">
            {tabs.map((t, i) => (
              <TabsTrigger key={t.length} value={t}>
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((t, i) => {
            let filteredPosts = posts;

            if (t !== "All") filteredPosts = posts.filter((p) => p.type === t);

            return (
              <>
                {filteredPosts.length > 0 && (
                  <TabsContent
                    className="gap-5 flex flex-col"
                    key={t.length}
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
      {posts.length === 0 && (
        <div className="my-4 p-4 md:w-[650px] w-full flex flex-col justify-center mx-auto">
          <div className="text-center">No posts found</div>
        </div>
      )}
    </div>
  );
};

export default FeedContainer;
