import React, { useRef, useState } from "react";
import QuillComment from "./quillComment";

function Input({ callback, comment, setEdit, edit }) {
  const [value, setValue] = useState(
    comment?.user?.name
      ? `Reply to ${comment?.user?.name} :`
      : edit
      ? edit.content
      : ""
  );
  const divRef = useRef(null);

  const handleSubmit = () => {
    const div = divRef.current;

    const text = div.innerText;
    if (!text.trim()) return;

    callback(value);

    setValue("");
  };
  return (
    <div>
      <QuillComment setValue={setValue} value={value} />
      <div
        ref={divRef}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{ display: "none" }}
      ></div>
      <button
        className="btn btn-dark ms-auto d-block px-4 mt-2"
        onClick={handleSubmit}
      >
        {edit ? "Update" : "Send"}
      </button>
    </div>
  );
}

export default Input;
