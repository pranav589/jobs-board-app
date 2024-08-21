"use client";
import React from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { logoutUser } from "@/app/(auth)/actions";
import { useRouter } from "next/navigation";

function LogoutButton() {
  const router = useRouter();
  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={async () => {
        await logoutUser();
        router.push("/");
      }}
    >
      Logout
    </DropdownMenuItem>
  );
}

export default LogoutButton;
