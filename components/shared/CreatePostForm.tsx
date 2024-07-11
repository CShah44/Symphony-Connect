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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import FileUploader from "./FileUploader";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { createPost } from "@/lib/actions/post.action";

const createPostSchema = z.object({
  text: z
    .string()
    .min(3, "Your post should contain at least 3 characters")
    .max(500, "Your post should be of less than 500 characters"),
  images: z.any(),
  type: z.string(),
});

const CreatePostForm = () => {
  const { user } = useUser();
  const [imageUrls, setImageUrls] = useState<String[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      text: "",
      type: "Post",
    },
  });

  async function onSubmit(values: z.infer<typeof createPostSchema>) {
    //hame chahiye user.public_metadata.userId

    try {
      await createPost({
        text: values.text,
        type: values.type,
        imageUrls: imageUrls,
        id: user.publicMetadata.userId,
      });

      form.reset();

      toast({
        title: "POSTED!!!",
        description: "Post created successfully.",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Oops!",
        description: "Could not post! Try again later.",
        variant: "destructive",
      });
    }
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
            <FileUploader imageUrls={imageUrls} setImageUrls={setImageUrls} />
            <FormDescription className="mb-4">
              Make sure to click upload before you post
            </FormDescription>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Is this an event or oppurtunity?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Post">Post</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Oppurtunity">Oppurtunity</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Let people know if you're posting an event or oppurtunity!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={form.formState.isSubmitting}
              variant={"outline"}
              type="submit"
              className="my-3"
            >
              {form.formState.isSubmitted ? "Posting..." : "Post"}
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
