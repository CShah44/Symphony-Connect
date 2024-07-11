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

//todo change the any here bro
const Post = ({ post }: { post: IPostFeed }) => {
  const p = post;
  return (
    <Card className="text-left w-full h-auto">
      <CardHeader>
        <CardTitle className="flex flex-row items-center text-2xl">
          <Image
            src={p.postedBy.photo}
            width={50}
            height={50}
            alt="PFP"
            className="rounded-full"
          />
          <Link href={`/user/${p.postedBy._id}`}>
            <span className="ml-2">{p.postedBy.username}</span>
          </Link>
        </CardTitle>
        {post.type != "Post" && (
          <CardDescription className="my-2">
            {p.type != "Post" ? p.type : ""}
          </CardDescription>
        )}
      </CardHeader>
      <p className="mx-2 p-3">{p.text}</p>
      <CardContent className="md:w-[600px] w-full p-2 m-2 mx-auto">
        {p.imageUrls && p.imageUrls.length > 0 && (
          <Carousel className="w-full mx-auto">
            <CarouselContent>
              {p?.imageUrls.map((url: string) => (
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
        {/* <div>
          {post.tags.map((tag: string) => (
            <Badge variant="default" className="mx-1 text-sm" key={tag}>
              {tag}
            </Badge>
          ))}
        </div> */}
        <div className="flex gap-5 justify-center items-center text-md">
          <Button className="rounded-full text-xl">L</Button>
          <span>{p.likes.length} Likes</span>
          <Button className="rounded-full text-xl">+</Button>
          <span>{p.comments.length} Comments</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Post;
