"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import FileUploader from "./FileUploader";
import { useUser } from "@clerk/nextjs";

const createPostSchema = z.object({
  text: z
    .string()
    .min(3, "Your post should contain at least 3 characters")
    .max(500, "Your post should be of less than 500 characters"),
  images: z.any(),
});

const CreatePostForm = () => {
  const { user } = useUser();

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      text: "",
    },
  });

  function onSubmit(values: z.infer<typeof createPostSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger className="rounded-full fixed w-16 h-16 drop-shadow-lg shadow-yellow-100 right-3 bottom-3 text-slate-800 bg-neutral-200 hover:bg-neutral-400">
        Create
      </DialogTrigger>
      <DialogContent className="font-agrandir bg-zinc-900">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            Create a new post or post an oppurtunity
          </DialogDescription>
        </DialogHeader>
        {/* todo add form here */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="bg-zinc-900">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    What's on your mind{`, ${user?.firstName}`}?
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>Let's see your creativity</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FileUploader />
            <FormDescription>
              Make sure to click upload before you post
            </FormDescription>
            <Button variant={"outline"} type="submit" className="my-3">
              Post
            </Button>
          </form>
        </Form>

        <DialogFooter>
          {/* <Button variant={"destructive"}>
          </Button> */}
          <DialogTrigger>Cancel</DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostForm;
