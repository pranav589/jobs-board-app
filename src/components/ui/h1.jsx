import { cn } from "@/lib/utils";
import React from "react";

function H1(props) {
  return (
    <h1
      {...props}
      className={cn(
        "text-4xl font-extrabold tracking-tight lg:text-5xl",
        props.className,
      )}
    >
      {props.children}
    </h1>
  );
}

export default H1;
