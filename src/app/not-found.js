import H1 from "@/components/ui/h1";
import Link from "next/link";
import React from "react";

function NotFound() {
  return (
    <main className="max-w-5xl m-auto my-10 space-y-5 px-3 text-center">
      <H1 className="my-10">Oops!!! Page Not Found</H1>
      <Link href={"/"} className="hover:underline">
        Go Back
      </Link>
    </main>
  );
}

export default NotFound;
