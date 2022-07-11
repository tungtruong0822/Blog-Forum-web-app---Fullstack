import React from "react";
import { Link } from "react-router-dom";

function CardBlog({ blog }) {
  return (
    <Link to={`/blog/${blog._id}`} className="card blog-card">
      <img src={blog.thumbnail} className="card-img-top" alt={blog.thumbnail} />
      <div className="card-body">
        <h5 className="card-title">{blog.title}</h5>
        <p className="card-text">{blog.description.slice(0, 100)} ...</p>
        <p className="card-text d-flex justify-content-between">
          <Link className=" text-muted" to={`/profile/${blog.user._id}`}>
            By : {blog.user.name}
          </Link>
          <small>{new Date(blog.createdAt).toLocaleDateString()}</small>
        </p>
      </div>
    </Link>
  );
}

export default CardBlog;
