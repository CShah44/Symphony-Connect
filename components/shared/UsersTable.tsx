"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { deleteUser, setRole } from "@/lib/actions/admin.action";
import { MoveHorizontalIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "../ui/use-toast";

const UsersTable = ({ users: usersProp }: any) => {
  const [users, setUsers] = useState(usersProp);

  const changeRole = (id: string, role: string) => {
    setUsers(
      users.map((user: any) => {
        if (user.id === id) {
          return {
            ...user,
            publicMetadata: {
              ...user.publicMetadata,
              role: role,
            },
          };
        }
        return user;
      })
    );

    setRole(id, role === "admin" ? "admin" : "user");

    toast({
      title: "Role updated successfully",
      description: "The role has been updated successfully.",
      duration: 3000,
    });
  };

  const handleDeleteUser = (id: string) => {
    setUsers(
      users.filter((user: any) => {
        return user.id !== id;
      })
    );
    deleteUser(id);
  };

  if (users.length === 0) {
    return (
      <div className="text-center">
        <p className="text-secondary-foreground text-sm">No users found.</p>
      </div>
    );
  }

  return (
    <Table className="text-left">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user: any) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              {user.firstName} {user.lastName}
            </TableCell>
            <TableCell>{user.emailAddress}</TableCell>
            <TableCell>
              <Badge
                variant={
                  user.publicMetadata.role === "admin" ? "default" : "secondary"
                }
              >
                {user?.publicMetadata?.role === "admin" ? "Admin" : "User"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <MoveHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        const id = user.id;
                        const role =
                          user.publicMetadata.role === "admin"
                            ? "user"
                            : "admin";

                        changeRole(id, role);
                      }}
                    >
                      {user.publicMetadata.role === "admin"
                        ? "Demote to User"
                        : "Promote to Admin"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500 hover:bg-red-500 hover:text-red-50"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
