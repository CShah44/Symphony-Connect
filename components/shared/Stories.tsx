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
import { deleteStory } from "@/lib/actions/story.action";
import { toast } from "../ui/use-toast";
import { useEffect, useState } from "react";

export default function Stories({
  stories,
  currUserId,
}: {
  stories: IStory[];
  currUserId: string;
}) {
  const [showPostIcon, setShowPostIcon] = useState(true);

  useEffect(() => {
    if (stories.length === 0) return;
    setShowPostIcon(stories.some((story) => story.postedBy._id !== currUserId));
  }, [stories]);

  const handleDeleteStory = async (storyId: string) => {
    try {
      const deletedStory = await deleteStory(storyId);

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

  return (
    <div
      style={{
        scrollbarWidth: "none",
      }}
      className="flex items-center mt-4 gap-4 p-4 bg-black rounded-xl w-11/12 mx-auto overflow-x-scroll"
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
          <DialogContent className="font-agrandir">
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
            <DialogFooter>
              <Button
                variant="outline"
                className="ml-auto"
                onClick={() => handleDeleteStory(story._id)}
              >
                <Trash size={16} />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}