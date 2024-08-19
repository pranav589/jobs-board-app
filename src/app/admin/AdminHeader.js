"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { logoutUser } from "../(auth)/actions";

function AdminHeader() {
  const session = useSession();
  const router = useRouter();
  return (
    <div className="px-3">
      <div className="m-auto flex h-10 max-w-5xl items-center justify-between gap-2">
        <Link href={"/admin"} className="font-semibold underline">
          Admin Dashboard
        </Link>
        <div className="space-x-2">
          <span className="font-semibold">{session?.data?.user?.email}</span>
          <button
            onClick={async () => {
              await logoutUser();
              router.push("/");
            }}
            className="underline"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
