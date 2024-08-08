"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { PlusIcon, Trash } from "lucide-react";
import CreateStoryForm from "./CreateStoryForm";
import { IStory } from "@/lib/database/models/story.model";
import { formatDateTime } from "@/lib/utils";
import { Button } from "../ui/button";
import { deleteStory, getStories } from "@/lib/actions/story.action";
import { toast } from "../ui/use-toast";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { pusherClient } from "@/lib/pusher/pusherClient";

export default function Stories({ currUserId }: { currUserId: string }) {
  const [showPostIcon, setShowPostIcon] = useState(true);
  const [stories, setStories] = useState<IStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      const stories = await getStories();
      setStories(stories);
    };

    fetchStories();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (stories.length === 0) return;

    if (stories.some((story) => story.postedBy._id === currUserId)) {
      setShowPostIcon(false);
    }
  }, [stories, currUserId]);

  const handleDeleteStory = async (storyId: string) => {
    try {
      const deletedStory = await deleteStory(storyId);
      setStories((prevStories) =>
        prevStories.filter((story) => story._id !== deletedStory._id)
      );
      setShowPostIcon(true);

      toast({
        title: "Deleted Story",
        description: "Story deleted successfully.",
      });
    } catch (error) {
      console.log(error);
      return toast({
        title: "Oops!",
        description: "Could not delete the story!",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    pusherClient.subscribe("stories");
    pusherClient.bind("new-story", (data: IStory) => {
      setStories((prevStories) => [...prevStories, data]);
    });

    return () => {
      pusherClient.unsubscribe("stories");
    };
  });

  if (loading) return <Skeleton className="w-11/12 mx-auto mt-4" />;

  return (
    <div
      style={{
        scrollbarWidth: "none",
      }}
      className="flex items-center mt-4 gap-4 p-4 bg-black rounded-2xl w-11/12 mx-auto overflow-x-scroll"
    >
      {showPostIcon && (
        <Dialog>
          <DialogTrigger asChild>
            <button>
              <Avatar className="w-16 h-16 border border-neutral-400">
                <PlusIcon className="text-neutral-400 w-10 h-10 mx-auto my-auto" />
              </Avatar>
            </button>
          </DialogTrigger>
          <DialogContent className="mt-10 font-agrandir">
            <DialogHeader>
              <DialogTitle>Add Story</DialogTitle>
              <DialogDescription>
                Share your moment with your friends.
              </DialogDescription>
            </DialogHeader>
            <CreateStoryForm />
          </DialogContent>
        </Dialog>
      )}
      {stories.map((story) => (
        <Dialog key={story._id}>
          <DialogTrigger asChild>
            <button>
              <Avatar className="w-16 h-16">
                <AvatarImage src={story.postedBy.photo} />
              </Avatar>
            </button>
          </DialogTrigger>
          <DialogContent className="font-agrandir bg-black/10 backdrop-blur-2xl">
            <DialogHeader>
              <DialogTitle className="tracking-wide">
                {story.postedBy.firstName}'s Story
              </DialogTitle>
              <DialogDescription>
                {formatDateTime(story.createdAt).dateTime || ""}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p>{story.text}</p>
            </div>
            {story.images && story.images.length > 0 && (
              <Carousel className="w-full mx-auto">
                <CarouselContent>
                  {story?.images.map((url: string) => (
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
            <DialogFooter>
              {currUserId === story.postedBy._id && (
                <Button
                  variant="outline"
                  className="ml-auto"
                  onClick={() => handleDeleteStory(story._id)}
                >
                  <Trash size={16} />
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
