"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { IPostFeed } from "@/lib/database/models/post.model";
import { Heart, HeartOff, Repeat2, Trash } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import {
  addComment,
  deletePostById,
  likeUnlike,
  repost,
} from "@/lib/actions/post.action";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import CommentsContainer from "./CommentsContainer";
import { formatDateTime } from "@/lib/utils";

const Post = ({
  post,
  setPosts,
}: {
  post: IPostFeed;
  setPosts: Dispatch<SetStateAction<any>>;
  posts: IPostFeed[];
}) => {
  const { user, isLoaded } = useUser();
  const [isAddingComment, setIsAddingComment] = useState(false);

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setLiked(
        !!post.likes.find(
          (id: string) => id === user?.publicMetadata?.userId
        ) || false
      );
    }
  }, [isLoaded]);

  const handleLikeUnlike = async () => {
    await likeUnlike(post._id, user?.publicMetadata?.userId, "/feed");

    // update the post in the state according to like or unlike

    if (!liked) {
      // map over the posts array and update the post with the new likes array
      // if the post is not liked, add the user's id to the likes array

      setPosts((prev: IPostFeed[]) =>
        prev.map((p: IPostFeed) => {
          if (p._id === post._id) {
            return {
              ...p,
              likes: [...p.likes, user?.publicMetadata?.userId],
            };
          }

          return p;
        })
      );

      setLiked((prev) => !prev);
    } else {
      // map over the posts array and update the post with the new likes array
      // if the post is liked, remove the user's id from the likes array

      setPosts((prev: IPostFeed[]) =>
        prev.map((p: IPostFeed) => {
          if (p._id === post._id) {
            return {
              ...p,
              likes: p.likes.filter(
                (id: string) => id !== user?.publicMetadata?.userId
              ),
            };
          }

          return p;
        })
      );

      setLiked((prev) => !prev);
    }
  };

  const handleAddComment = async (text: string) => {
    setIsAddingComment(true);

    if (isAddingComment) return;

    if (text) {
      const comment = {
        text: text,
        userId: user?.publicMetadata?.userId,
        postId: post._id,
      };

      const data = await addComment(comment);

      setPosts((prev: IPostFeed[]) =>
        prev.map((p: IPostFeed) => {
          if (p._id === post._id) {
            return {
              ...p,
              comments: [...p.comments, data],
            };
          }

          return p;
        })
      );
    } else {
      toast({
        title: "Please enter a comment",
        variant: "destructive",
        duration: 2000,
      });
    }

    setIsAddingComment(false);
  };

  const handleRepost = async () => {
    try {
      const newPost = await repost(post._id, user?.publicMetadata?.userId);
      setPosts((prev: IPostFeed[]) => [newPost, ...prev]);

      toast({
        title: "Reposted!",
        description: "Post reposted successfully.",
        duration: 1000,
      });
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Could not repost the post!",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deletePostById(post._id);
      setPosts((prev: IPostFeed[]) => prev.filter((p) => p._id !== post._id));

      toast({
        title: "Deleted!",
        description: "Post deleted successfully.",
        duration: 1000,
      });
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Could not delete the post!",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <Card className="text-left w-full h-auto">
      <CardHeader>
        {post.repost && (
          <div className="mb-2 text-neutral-300">
            <Link href={`/user/${post.postedBy?._id}`}>
              Reposted by {post.postedBy?.username}
            </Link>
          </div>
        )}
        <CardTitle className="flex flex-row items-center text-2xl">
          <Image
            src={
              post.repost
                ? post.repost.originalPostedBy?.photo || ""
                : post.postedBy?.photo || ""
            }
            width={50}
            height={50}
            alt="PFP"
            className="rounded-full"
          />
          <Link
            href={
              post.repost
                ? `/user/${post.repost.originalPostedBy?._id}`
                : `/user/${post.postedBy?._id}`
            }
          >
            <span className="ml-2 tracking-wide">
              {post.repost
                ? post.repost.originalPostedBy?.username
                : post.postedBy?.username}
            </span>
          </Link>
          {user?.publicMetadata.userId === post.postedBy?._id && (
            <button className="ml-auto" onClick={handleDelete}>
              <Trash size={16} color="#ffffff" />
            </button>
          )}
        </CardTitle>
        <span className="text-neutral-300 text-xs py-2">
          {formatDateTime(post.createdAt!).dateTime}
        </span>
        {post.type != "Post" && (
          <CardDescription className="my-2">
            {post.type.toString() === "Opportunity" ? "Opportunity" : ""}
            {post.type == "Event" && post.eventDate && (
              <div className="text-lg text-neutral-300 py-3">
                <span>Event: {post.eventTitle}</span>
                <span className="ml-4">
                  {formatDateTime(post.eventDate!).dateTime}
                </span>
              </div>
            )}
          </CardDescription>
        )}
      </CardHeader>
      <p className="mx-2 p-3">{post.text}</p>
      <CardContent className="md:w-[600px] w-full p-2 m-2 mx-auto">
        {post.imageUrls && post.imageUrls.length > 0 && (
          <Carousel className="w-full mx-auto">
            <CarouselContent>
              {post?.imageUrls.map((url: string) => (
                <CarouselItem key={url}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-video items-center justify-center p-6">
                        <img
                          src={url}
                          alt={url}
                          className="object-contain h-full w-full"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start">
        <div className="flex w-full justify-around items-center text-md">
          <Button
            className="rounded-full"
            variant={"outline"}
            onClick={handleLikeUnlike}
          >
            {liked ? (
              <HeartOff width={16} height={16} />
            ) : (
              <Heart width={16} height={16} />
            )}
          </Button>
          <span className="text-xs sm:text-lg">{post.likes.length} Likes</span>
          <CommentsContainer post={post} handleOnSubmit={handleAddComment} />
          <span className="text-xs sm:text-lg">
            {post.comments.length} Comments
          </span>
          <Button
            className="rounded-full "
            variant={"outline"}
            onClick={handleRepost}
          >
            <Repeat2 size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Post;
