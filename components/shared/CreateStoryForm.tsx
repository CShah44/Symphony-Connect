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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import FileUploader from "./FileUploader";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { createStory } from "@/lib/actions/story.action";

const createStorySchema = z.object({
  text: z.string().max(200, "Your post should be of less than 200 characters"),
  images: z.any(),
});

const CreateStoryForm = () => {
  const { user } = useUser();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createStorySchema>>({
    resolver: zodResolver(createStorySchema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createStorySchema>) {
    try {
      await createStory({
        text: values.text,
        id: user?.publicMetadata?.userId,
        imageUrls: imageUrls,
      });

      form.reset();
      setImageUrls([]);

      toast({
        title: "POSTED!!!",
        description: "Story posted successfully.",
        duration: 1000,
      });
    } catch (error) {
      return toast({
        title: "Oops!",
        description: "Could not post! Try again later.",
        variant: "destructive",
        duration: 2000,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full p-2">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Share your moment {`, ${user?.firstName}`}!</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FileUploader imageUrls={imageUrls} setImageUrls={setImageUrls} />
        <FormDescription className="mb-4">
          Make sure to click upload before you post
        </FormDescription>
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

export default CreateStoryForm;
