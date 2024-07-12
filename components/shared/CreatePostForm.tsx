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
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      text: "",
      type: "Post",
    },
  });

  async function onSubmit(values: z.infer<typeof createPostSchema>) {
    try {
      await createPost({
        text: values.text,
        type: values.type,
        imageUrls: imageUrls,
        id: user?.publicMetadata?.userId,
      });

      form.reset();
      setImageUrls([]);

      toast({
        title: "POSTED!!!",
        description: "Post created successfully.",
      });
    } catch (error) {
      console.log(error);
      return toast({
        title: "Oops!",
        description: "Could not post! Try again later.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-zinc-900 w-full p-2"
      >
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          {form.formState.isSubmitting ? "Posting..." : "Post"}
        </Button>
      </form>
    </Form>
  );
};

export default CreatePostForm;
