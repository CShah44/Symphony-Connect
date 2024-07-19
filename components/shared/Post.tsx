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
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "../ui/use-toast";
import CommentsContainer from "./CommentsContainer";
import { formatDateTime } from "@/lib/utils";

const Post = ({
  post,
  setPosts,
  posts,
}: {
  post: IPostFeed;
  setPosts: Dispatch<SetStateAction<any>>;
  posts: IPostFeed[];
}) => {
  const { user } = useUser();
  const [isAddingComment, setIsAddingComment] = useState(false);

  const isLiked = post.likes.find(
    (id: string) => id === user?.publicMetadata?.userId
  );

  const handleLikeUnlike = async () => {
    await likeUnlike(post._id, user?.publicMetadata?.userId, "/feed");

    let newPosts = [];

    if (!isLiked) {
      newPosts = posts.map((post: IPostFeed) => {
        if (post._id === post._id) {
          return {
            ...post,
            likes: [...post.likes, user?.publicMetadata?.userId],
          };
        }

        return post;
      });
    } else {
      newPosts = posts.map((post: IPostFeed) => {
        if (post._id === post._id) {
          return {
            ...post,
            likes: post.likes.filter(
              (id: string) => id !== user?.publicMetadata?.userId
            ),
          };
        }

        return post;
      });
    }
    setPosts(newPosts);
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

      const updatedPosts = posts.map((post: IPostFeed) => {
        if (post._id === post._id) {
          return {
            ...post,
            comments: [...post.comments, data],
          };
        }

        return post;
      });

      setPosts(updatedPosts);
    } else {
      toast({
        title: "Please enter a comment",
        variant: "destructive",
      });
    }

    setIsAddingComment(false);
  };

  const handleRepost = async () => {
    try {
      const newPost = await repost(post._id, user?.publicMetadata?.userId);
      setPosts([newPost, ...posts]);

      toast({
        title: "Reposted!",
        description: "Post reposted successfully.",
      });
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Could not repost the post!",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deletePostById(post._id);
      setPosts(posts.filter((p) => p._id !== post._id));

      toast({
        title: "Deleted!",
        description: "Post deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Could not delete the post!",
        variant: "destructive",
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
                ? post.repost.originalPostedBy.photo
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
                ? `/user/${post.repost.originalPostedBy._id}`
                : `/user/${post.postedBy?._id}`
            }
          >
            <span className="ml-2 tracking-wide">
              {post.repost
                ? post.repost.originalPostedBy.username
                : post.postedBy?.username}
            </span>
          </Link>
          {user?.publicMetadata.userId === post.postedBy?._id && (
            <button className="ml-auto" onClick={handleDelete}>
              <Trash size={16} color="#ffffff" />
            </button>
          )}
        </CardTitle>
        {post.type != "Post" && (
          <CardDescription className="my-2">
            {post.type.toString() != "Post" ? post.type : ""}
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
      {/* include space for event date if the post is an event */}
      {/* {post.type === "Event" && post.eventDate && (
        <div className="flex gap-5 justify-center items-center text-md">
          <span>{formatDateTime(post.eventDate).dateTime}</span>
        </div>
      )} */}
      <CardFooter className="flex flex-col gap-4 items-start">
        <div className="flex gap-5 justify-center items-center text-md">
          <Button className="rounded-full text-xl" onClick={handleLikeUnlike}>
            {isLiked ? <HeartOff /> : <Heart />}
          </Button>
          <span>{post.likes.length} Likes</span>
          <CommentsContainer post={post} handleOnSubmit={handleAddComment} />
          <span>{post.comments.length} Comments</span>
          <Button className="rounded-full text-xl" onClick={handleRepost}>
            <Repeat2 size={28} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Post;
