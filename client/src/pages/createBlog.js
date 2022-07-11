import React, { useState, useRef, useEffect } from "react";
import Preview from "../components/createBlog/preview";
import Createblog from "../components/createBlog/createBlog";
import Quill from "../components/createBlog/quill";
import { validCreateBlog } from "../utils/valid";
import { useDispatch, useSelector } from "react-redux";
import { alertAction } from "../redux/reducer/alert";
import { createBlog } from "../redux/reducer/blog";

function CreateBlog() {
  const initial = { title: "", description: "", category: "", thumbnail: "" };
  const [blogO, setBlogO] = useState(initial);
  const [value, setValue] = useState("");
  const [Text, setText] = useState("");
  const dispatch = useDispatch();
  const divRef = useRef(null);
  const { auth } = useSelector((state) => state);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.token) return;
    const check = validCreateBlog({ ...blogO, content: Text });

    if (check.errLength > 0) {
      return dispatch(alertAction({ errors: check.errMsg }));
    } else {
      dispatch(createBlog({ ...blogO, content: value, token: auth.token }));
    }
  };

  useEffect(() => {
    const div = divRef.current;
    const text = div?.innerText;
    setText(text);
  }, [value]);

  return (
    <div className="CreateBlog row mt-4">
      <div className="col-md-6">
        <Createblog setBlogO={setBlogO} />
      </div>
      <div className="col-md-6">
        <Preview blogO={blogO} />
      </div>
      <div className="mb-3">
        <Quill setValue={setValue} />
        <span>{Text.length}</span>
      </div>
      <div
        ref={divRef}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{ display: "none" }}
      ></div>
      <button className="btn btn-dark w-50 m-auto mb-3" onClick={handleSubmit}>
        Create Blog
      </button>
    </div>
  );
}

export default CreateBlog;
