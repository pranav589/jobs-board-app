import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/assets/logo.png";
import { Button } from "./ui/button";
import { auth } from "@/lib/auth";
import { isCandidate, isEmployer } from "@/lib/utils";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import CustomDropDown from "./CustomDropDown";

const EMPLOYER_DROPDOWN_LIST = [
  {
    id: "1",
    name: "Company Details",
    path: "/user/profile",
  },
  {
    id: "2",
    name: "Dashboard",
    path: "/employer/dashboard",
  },
];

const CANDIDATE_DROPDOWN_LIST = [
  {
    id: "1",
    name: "Profile",
    path: "/user/profile",
  },
  {
    id: "2",
    name: "Job Applications",
    path: "/user/jobs-applied",
  },
];

async function Header() {
  const session = await auth();

  const dropDownList = isEmployer(session?.user)
    ? EMPLOYER_DROPDOWN_LIST
    : isCandidate(session?.user)
      ? CANDIDATE_DROPDOWN_LIST
      : [];

  return (
    <header className="shadow-sm">
      <nav className="max-w-5xl m-auto px-3 py-5 flex items-center justify-between">
        <Link href={"/"} className="flex items-center gap-3">
          <Image src={logo} alt="logo" width={40} height={40} />
          <span className="text-xl font-bold tracking-tight">Dev Jobs</span>
        </Link>
        <div>
          {session ? (
            <CustomDropDown
              items={dropDownList}
              customContent={
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session?.user?.userName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session?.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              }
              renderLogoutButton={true}
              renderItem={(item) => {
                return (
                  <Link href={item?.path} key={item?.path}>
                    <DropdownMenuItem className="cursor-pointer">
                      {item?.name}
                    </DropdownMenuItem>
                  </Link>
                );
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full bg-slate-100"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {session?.user?.userName?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
            </CustomDropDown>
          ) : (
            <Button asChild className="mr-5">
              <Link href={"/login"}>Login</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
