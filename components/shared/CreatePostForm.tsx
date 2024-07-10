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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import FileUploader from "./FileUploader";

const createPostSchema = z.object({
  text: z
    .string()
    .min(3, "Your post should contain at least 3 characters")
    .max(500, "Your post should be of less than 500 characters"),
  images: z.any(),
});

const CreatePostForm = () => {
  const [files, setFiles] = useState<any[]>([]);

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      text: "",
    },
  });

  function onSubmit(values: z.infer<typeof createPostSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(files);
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger className="fixed right-3 bottom-3">Open</DialogTrigger>
      <DialogContent className="font-agrandir">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            Create a new post or post an oppurtunity
          </DialogDescription>
        </DialogHeader>
        {/* todo add form here */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What's on your mind?</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>Let's see your creativity</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FileUploader />
            <Button variant={"outline"} type="submit">
              Submit
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
