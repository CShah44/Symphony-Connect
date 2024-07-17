"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { MessageCirclePlus } from "lucide-react";
import Image from "next/image";
import { IComment, IPostFeed } from "@/lib/database/models/post.model";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  text: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const CommentsContainer = ({
  post,
  handleOnSubmit,
}: {
  post: IPostFeed;
  handleOnSubmit: (text: string) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    handleOnSubmit(data.text);
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full text-xl">
          <MessageCirclePlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="font-agrandir w-full">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription>
            Here's what people have said about this post
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {post.comments.length > 0 &&
            post.comments.map((comment: IComment) => (
              <div
                key={`${comment.userId}+${comment.text}`}
                className="flex flex-row items-center gap-3"
              >
                <Image
                  src={comment.userProfilePic}
                  width={50}
                  height={50}
                  alt="PFP"
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-md">{comment.username}</span>
                  <span className="text-sm text-stone-300">{comment.text}</span>
                </div>
              </div>
            ))}
          {post.comments.length === 0 && (
            <div className="flex items-center justify-center my-10">
              <span className="text-sm">No comments yet</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-row items-center justify-between gap-3 mt-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-row justify-between w-full gap-3"
            >
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder="Add a comment" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="text-md">
                {form.formState.isSubmitting ? "Adding..." : "Add Comment"}
              </Button>
            </form>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsContainer;
