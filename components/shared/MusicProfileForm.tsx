"use client";

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
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateMusicProfile } from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";
import { IUser } from "@/lib/database/models/user.model";
import { Button } from "../ui/button";

const EditMusicProfileSchema = z.object({
  genres: z.array(z.string()),
  instruments: z
    .array(z.string())
    .max(10, "You can select at most 10 instruments"),
  skills: z.array(z.string()).max(10, "You can select at most 10 skills"),
  favoriteArtists: z
    .array(z.string())
    .max(10, "You can select at most 10 artists"),
  bio: z.string().max(250, "Only 250 characters are allowed"),
});

const MusicProfileForm = ({
  currentUser,
  data,
}: {
  currentUser: IUser | null;
  data: {
    genres: string[];
    instruments: string[];
    skills: string[];
    favoriteArtists: string[];
  };
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof EditMusicProfileSchema>>({
    resolver: zodResolver(EditMusicProfileSchema),
    defaultValues: {
      genres: currentUser?.genres || [],
      instruments: currentUser?.instruments || [],
      skills: currentUser?.skills || [],
      favoriteArtists: currentUser?.favoriteArtists || [],
      bio: currentUser?.bio || "I dont know! I just crashed here!",
    },
  });

  async function onSubmit(data: z.infer<typeof EditMusicProfileSchema>) {
    const dataToSend = {
      ...data,
      userId: currentUser?._id,
    };

    try {
      await updateMusicProfile(dataToSend);
      toast({
        title: "Profile updated successfully",
      });
      router.push(`/user/${currentUser?._id}`);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error updating profile",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="instruments"
          render={() => (
            <FormItem className="w-[650px] ">
              <div className="mb-4">
                <FormLabel className="text-base">Instruments</FormLabel>
                <FormDescription>
                  What instruments do you play? (max 10)
                </FormDescription>
              </div>
              <div className="flex flex-wrap gap-5 text-md">
                {data?.instruments.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="instruments"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skills"
          render={() => (
            <FormItem className="w-[650px] ">
              <div className="mb-4">
                <FormLabel className="text-base">Skills</FormLabel>
                <FormDescription>
                  What skills do you have? (max 10)
                </FormDescription>
              </div>
              <div className="flex flex-wrap gap-5 text-md">
                {data?.skills.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="skills"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="favoriteArtists"
          render={() => (
            <FormItem className="w-[650px] ">
              <div className="mb-4">
                <FormLabel className="text-base">Artists</FormLabel>
                <FormDescription>
                  Select all your favorite artists! (max 10)
                </FormDescription>
              </div>
              <div className="flex flex-wrap gap-5 text-md">
                {data?.favoriteArtists.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="favoriteArtists"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="genres"
          render={() => (
            <FormItem className="w-[650px] ">
              <div className="mb-4">
                <FormLabel className="text-base">Genres</FormLabel>
                <FormDescription>
                  What genres do you like? (max 10)
                </FormDescription>
              </div>
              <div className="flex flex-wrap gap-5 text-md">
                {data?.genres.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="genres"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormDescription>Let everyone know who you are</FormDescription>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
        <p className="text-secondary-foreground text-sm">
          You can change this later
        </p>
      </form>
    </Form>
  );
};

export default MusicProfileForm;