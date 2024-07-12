"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { getOnboardData } from "@/lib/actions/musicprofile.action";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { updateMusicProfile } from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";

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

// here the use can edit the music profile
const EditProfile = () => {
  const [data, setData] = useState({
    genres: [],
    instruments: [],
    skills: [],
    favoriteArtists: [],
    bio: "I don't know! I just crashed here!",
  });
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);

    const preloadData = async () => {
      const d = await getOnboardData();

      setData(d);
    };

    preloadData();

    setIsLoading(false);
  }, []);

  const form = useForm<z.infer<typeof EditMusicProfileSchema>>({
    resolver: zodResolver(EditMusicProfileSchema),
    defaultValues: {
      genres: [],
      instruments: [],
      skills: [],
      favoriteArtists: [],
      bio: "This is my first time!",
    },
  });

  async function onSubmit(data: z.infer<typeof EditMusicProfileSchema>) {
    const dataToSend = {
      ...data,
      userId: user?.publicMetadata?.userId,
    };

    try {
      await updateMusicProfile(dataToSend);
      toast({
        title: "Profile updated successfully",
      });
      router.push(`/user/${user?.publicMetadata?.userId}`);
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
    <div className="text-xl">
      <div className="flex justify-between">
        <h1 className="text-3xl">Edit Music Profile</h1>
        <Link href="/settings">
          <Button variant={"link"}>Go to account settings</Button>
        </Link>
      </div>
      {isLoading && !isLoaded ? (
        <div className="flex justify-center items-center">Loading..</div>
      ) : null}
      {!isLoading && isLoaded && (
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
                              <FormLabel className="font-normal">
                                {item}
                              </FormLabel>
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
                              <FormLabel className="font-normal">
                                {item}
                              </FormLabel>
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
                              <FormLabel className="font-normal">
                                {item}
                              </FormLabel>
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
                              <FormLabel className="font-normal">
                                {item}
                              </FormLabel>
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
                  <FormDescription>
                    Let everyone know who you are
                  </FormDescription>
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
      )}
    </div>
  );
};

export default EditProfile;
