"use server";

import { Roles } from "@/types/global";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export const checkRole = (role: Roles) => {
  const { sessionClaims }: any = auth();

  return sessionClaims?.metadata.role === role;
};

export async function setRole(id: string, role: Roles) {
  // Check that the user trying to set the role is an admin
  if (!checkRole("admin")) {
    return { message: "Not Authorized" };
  }

  try {
    const user = await clerkClient().users.getUser(id);
    const res = await clerkClient().users.updateUser(id, {
      publicMetadata: {
        ...user.publicMetadata,
        role,
      },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    throw new Error("Could not set role");
  }
}

export async function deleteUser(id: string) {
  // Check that the user trying to delete the user is an admin
  if (!checkRole("admin")) {
    return { message: "Not Authorized" };
  }

  try {
    const res = await clerkClient().users.deleteUser(id);
    return { message: res.publicMetadata };
  } catch (err) {
    throw new Error("Could not delete user");
  }
}
