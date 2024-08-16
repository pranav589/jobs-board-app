import React from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";

function LoadingButton({ children, loading, ...props }) {
  return (
    <Button {...props} type="submit" disabled={props.disabled || loading}>
      <span className="flex items-center justify-center gap-1">
        {loading && <Loader className="animate-spin" size={16} />}
        {children}
      </span>
    </Button>
  );
}

export default LoadingButton;
