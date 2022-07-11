import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Createblog({ setBlogO }) {
  const initial = { title: "", description: "", category: "", thumbnail: "" };
  const [blog, setBlog] = useState(initial);
  const { auth } = useSelector((state) => state);

  const handleChangeInput = (e) => {
    const { value, name } = e.target;
    setBlog({ ...blog, [name]: value });
  };

  const handleChangeThumbnail = (e) => {
    const target = e.target;
    const files = target.files;
    if (files) {
      const file = files[0];
      setBlog({ ...blog, thumbnail: file });
    }
  };
  useEffect(() => {
    if (blog) {
      setBlogO(blog);
    }
  }, [blog, setBlogO]);
  return (
    <form>
      <h6>Create</h6>
      <div className="form-group position-relative">
        <input
          type="text"
          className="form-control"
          value={blog.title}
          name="title"
          onChange={handleChangeInput}
          maxLength="50"
        />

        <small
          className="text-muted position-absolute"
          style={{ bottom: 0, right: "3px", opacity: "0.3" }}
        >
          {blog.title.length}/50
        </small>
      </div>

      <div className="form-group my-3">
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleChangeThumbnail}
        />
      </div>

      <div className="form-group position-relative">
        <textarea
          className="form-control"
          rows={4}
          value={blog.description}
          style={{ resize: "none" }}
          name="description"
          onChange={handleChangeInput}
          maxLength="200"
        />

        <small
          className="text-muted position-absolute"
          style={{ bottom: 0, right: "3px", opacity: "0.3" }}
        >
          {blog.description.length}/200
        </small>
      </div>

      <div className="form-group my-3">
        <select
          className="form-control text-capitalize"
          value={blog.category}
          name="category"
          onChange={handleChangeInput}
        >
          <option value="">Choose a category in your skill profile </option>
          {auth.user.skill &&
            auth.user.skill.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
        </select>
      </div>
    </form>
  );
}

export default Createblog;
