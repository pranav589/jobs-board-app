import React from "react";
import Markdown from "react-markdown";

function MarkdownComponent({ children }) {
  return (
    <Markdown
      className="space-y-3 "
      components={{
        ul: (props) => <ul className="list-inside list-disc" {...props} />,
        link: (props) => (
          <a className="text-green-500 underline" target="_blank" {...props} />
        ),
      }}
    >
      {children}
    </Markdown>
  );
}

export default MarkdownComponent;
