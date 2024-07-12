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
import { Heart, HeartOff } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { addComment, likeUnlike } from "@/lib/actions/post.action";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "../ui/use-toast";
import CommentsContainer from "./CommentsContainer";

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

  return (
    <Card className="text-left w-full h-auto">
      <CardHeader>
        <CardTitle className="flex flex-row items-center text-2xl">
          <Image
            src={post.postedBy.photo}
            width={50}
            height={50}
            alt="PFP"
            className="rounded-full"
          />
          <Link href={`/user/${post.postedBy._id}`}>
            <span className="ml-2">{post.postedBy.username}</span>
          </Link>
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
      <CardFooter className="flex flex-col gap-4 items-start">
        <div className="flex gap-5 justify-center items-center text-md">
          <Button className="rounded-full text-xl" onClick={handleLikeUnlike}>
            {isLiked ? <HeartOff /> : <Heart />}
          </Button>
          <span>{post.likes.length} Likes</span>
          <CommentsContainer post={post} handleOnSubmit={handleAddComment} />
          <span>{post.comments.length} Comments</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Post;
