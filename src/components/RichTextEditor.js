"use client";

import { useState, forwardRef } from "react";
import dynamic from "next/dynamic";
import { EditorState } from "draft-js";
import { cn } from "@/lib/utils";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false },
);

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default forwardRef(function RichTextEditor(props, ref) {
  // Initialize state with an empty EditorState
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  return (
    <Editor
      initialContentState={props.defaultValue}
      onEditorStateChange={onEditorStateChange} // Update state on editor changes
      editorClassName={cn(
        "border rounded-md px-3 min-h-[150px] cursor-text ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-withim:ring-offset-2",
        props.editorClassName,
      )}
      toolbar={{
        options: ["inline", "link", "list", "history"],
        inline: {
          options: ["bold", "italic", "underline"],
        },
      }}
      editorRef={(r) => {
        if (typeof ref === "function") {
          ref(r);
        } else if (ref) {
          ref.current = r;
        }
      }}
      {...props}
    />
  );
});
