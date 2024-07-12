"use client";

import ProfileCard from "@/components/shared/ProfileCard";
import { toast } from "@/components/ui/use-toast";
import { getUserPosts } from "@/lib/actions/post.action";
import { IPostFeed } from "@/lib/database/models/post.model";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Post from "@/components/shared/Post";

// todo this shit has repetitive code, fix it later
const Profile = () => {
  const { id }: { id: string } = useParams();
  const router = useRouter();
  const [userPosts, setUserPosts] = useState<IPostFeed[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive",
      });
      router.push("/");
    }
    setLoading(true);

    async function handleGetUserPosts() {
      const data = await getUserPosts(id);
      setUserPosts(data);
    }

    handleGetUserPosts();
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  const tabs = ["All", "Post", "Oppurtunity", "Event"];

  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <ProfileCard id={id} />
      {userPosts.length > 0 && !loading && (
        <div className="my-4 p-4 md:w-[650px] w-full flex flex-col justify-center mx-auto">
          <Tabs defaultValue="All" className="">
            <TabsList className="w-full bg-transparent mb-3">
              {tabs.map((t) => (
                <TabsTrigger key={t} value={t}>
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((t) => {
              let filteredPosts = userPosts;

              if (t !== "All")
                filteredPosts = userPosts.filter((p) => p.type === t);

              return (
                <TabsContent className="gap-5 flex flex-col" key={t} value={t}>
                  {filteredPosts.map((post) => (
                    <Post
                      key={post._id}
                      post={post}
                      posts={userPosts}
                      setPosts={setUserPosts}
                    />
                  ))}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      )}

      {userPosts.length === 0 && !loading && (
        <div className="my-4 p-4 md:w-[650px] w-full flex flex-col justify-center mx-auto">
          <div className="text-center">No posts found</div>
        </div>
      )}
    </div>
  );
};

export default Profile;
