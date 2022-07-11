import React, { useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { checkImage, imageUpload } from "../../utils/imageUpload";
import { alertAction, loading } from "../../redux/reducer/alert";

function Quill({ setValue }) {
  const dispatch = useDispatch();
  const quillRef = useRef(null);
  const modules = { toolbar: contrainer };

  const handleChangeImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const files = input.files;

      if (!files) return dispatch(alertAction({ errors: ["image not exist"] }));

      const file = files[0];
      const check = checkImage(file);
      if (check) return dispatch(alertAction({ errors: [check] }));

      dispatch(loading(true));
      const photo = await imageUpload(file);

      const quill = quillRef.current;
      const range = quill.getEditor().getSelection().index;
      if (range !== undefined) {
        quill.getEditor().insertEmbed(range, "image", `${photo.url}`);
      }

      dispatch(loading(false));
    };
  }, [dispatch]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    let toolbar = quill.getEditor().getModule("toolbar");

    toolbar.addHandler("image", handleChangeImage);
  }, [handleChangeImage]);

  return (
    <div>
      <ReactQuill
        theme="snow"
        modules={modules}
        placeholder="Write somethings..."
        onChange={(e) => setValue(e)}
        ref={quillRef}
      />
    </div>
  );
}

let contrainer = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["link", "image", "video"],
  ["clean"], // remove formatting button
];

export default Quill;
