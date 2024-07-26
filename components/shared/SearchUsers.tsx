"use client";

import { SearchIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";

export const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  return (
    // stop the default form submission http request from happening
    <form
      action={() => router.push(pathname + "?search=" + search)}
      className="w-full mt-4 mx-auto flex flex-row gap-1 items-center px-4 sm:px-0"
    >
      <Input
        type="search"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-4 w-full text-md h-12"
        // todo check if this is good ux
        onBlur={() => {
          router.push(pathname);
          setSearch("");
        }}
      />
      <Button variant={"ghost"} type="submit" className="h-full">
        <SearchIcon
          strokeWidth={3}
          className="cursor-pointer text-muted-foreground"
        />
      </Button>
    </form>
  );
};
