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
import { Badge } from "@/components/ui/badge";

import Image from "next/image";
import { Button } from "../ui/button";

//todo change the any here bro
const Post = ({ post }: any) => {
  return (
    <Card className="text-left w-full h-auto">
      <CardHeader>
        <CardTitle className="flex flex-row items-center text-2xl">
          <Image src={"/logo.png"} width={50} height={50} alt="PFP" />
          <span className="ml-2">{post.username}</span>
        </CardTitle>
        {post.type != "Post" && (
          <CardDescription className="my-2">{post.type}</CardDescription>
        )}
      </CardHeader>
      <p className="mx-2 p-3">{post.postText}</p>
      <CardContent className="md:w-[600px] w-full p-2 m-2 mx-auto">
        <Carousel className="w-full mx-auto">
          <CarouselContent>
            {Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-video items-center justify-center p-6">
                      <Image src="/logo.png" alt="" fill objectFit="contain" />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start">
        <div>
          {post.tags.map((tag: string) => (
            <Badge variant="default" className="mx-1 text-sm" key={tag}>
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex gap-5 justify-center items-center text-md">
          <Button className="rounded-full text-xl">L</Button>
          <span>{post.likes} Likes</span>
          <Button className="rounded-full text-xl">+</Button>
          <span>{post.comments} Comments</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Post;
