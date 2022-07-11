import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function QuillComment({ value, setValue }) {
  const modules = { toolbar: contrainer };

  return (
    <div>
      <ReactQuill
        theme="snow"
        modules={modules}
        placeholder="Write somethings..."
        onChange={(e) => setValue(e)}
        value={value}
      />
    </div>
  );
}

let contrainer = [
  [{ font: [] }],
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  [{ color: [] }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript

  ["clean"], // remove formatting button
];

export default QuillComment;
