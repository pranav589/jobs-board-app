import { cn } from "@/lib/utils";
import React from "react";

function Badge({ className, children }) {
  return (
    <span
      className={cn(
        "border rounded px-2 py-0.5 bg-muted text-muted-foreground text-sm font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
