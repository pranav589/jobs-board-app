import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/assets/logo.png";
import { Button } from "./ui/button";
import { auth } from "@/lib/auth";
import LoggedInDropDown from "./LoggedInDropDown";
import { EMPLOYER } from "@/lib/constants";

const EMPLOYER_DROPDOWN_LIST = [
  {
    id: "1",
    name: "Profile",
    path: "/user/profile",
  },
  {
    id: "2",
    name: "Dashboard",
    path: "/user/dashboard",
  },
];

async function Header() {
  const session = await auth();

  return (
    <header className="shadow-sm">
      <nav className="max-w-5xl m-auto px-3 py-5 flex items-center justify-between">
        <Link href={"/"} className="flex items-center gap-3">
          <Image src={logo} alt="logo" width={40} height={40} />
          <span className="text-xl font-bold tracking-tight">Dev Jobs</span>
        </Link>
        {/* Need to remove later */}
        <p>{session?.user?.role}</p>
        <div>
          {session?.user?.role === EMPLOYER && (
            <Button asChild className="mr-5">
              <Link href={"/jobs/new"}>Post a Job</Link>
            </Button>
          )}
          {session ? (
            <LoggedInDropDown
              email={session?.user?.email}
              userName={session?.user?.userName}
              items={EMPLOYER_DROPDOWN_LIST}
            />
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
