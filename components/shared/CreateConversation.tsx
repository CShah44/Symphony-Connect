"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { IParticipant } from "@/lib/database/models/conversation.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "../ui/checkbox";
import { toast } from "../ui/use-toast";
import { createConversation } from "@/lib/actions/chat.action";
import { useRouter } from "next/navigation";
import { MessageSquareDiff } from "lucide-react";

const createConversationSchema = z.object({
  groupName: z.string().min(1).max(100),
  participants: z.array(z.string()).min(2, "Select at least 1 participant"),
  groupPhoto: z.string().optional(),
});

export default function CreateConversation({
  followers,
  currUserId,
}: {
  followers: IParticipant[];
  currUserId: string | undefined;
}) {
  const form = useForm<z.infer<typeof createConversationSchema>>({
    resolver: zodResolver(createConversationSchema),
    defaultValues: {
      groupName: "I love music",
      participants: [currUserId],
      groupPhoto: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof createConversationSchema>) {
    try {
      const conversation = await createConversation(
        values.participants,
        values.groupName,
        "group",
        values.groupPhoto
      );

      router.push(`/chat/${conversation._id}`);

      toast({
        title: "Conversation created!",
        description: "Conversation created successfully.",
        duration: 1000,
      });
    } catch (error) {
      return toast({
        title: "Oops!",
        description: "Could not create conversation! Try again later.",
        variant: "destructive",
        duration: 2000,
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-md p-4" variant="outline">
          Create Group <MessageSquareDiff className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] font-agrandir">
        <DialogHeader>
          <DialogTitle>Create a new conversation</DialogTitle>
          <DialogDescription>
            Create a new conversation with your friends.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name of the group.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="participants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participants</FormLabel>
                  {followers.map((follower) => (
                    <FormField
                      key={follower._id}
                      control={form.control}
                      name="participants"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={follower._id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(follower._id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        follower._id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== follower._id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {follower.firstName} {follower.lastName}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormDescription>
                    Select the participants you want to add to the group.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
