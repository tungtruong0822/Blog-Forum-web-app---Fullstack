import React from "react";
import { Link } from "react-router-dom";

function CardHorizontal({ blog }) {
  return (
    <Link to={`/blog/${blog._id}`} className="card mb-2">
      <div className="row g-0">
        <div className="col-md-4 blog-user-img">
          <img
            src={blog.thumbnail}
            className="img-fluid rounded-start"
            alt={blog.thumbnail}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{blog.title.slice(0, 40)} ...</h5>
            <p className="card-text">{blog.description.slice(0, 100)} ...</p>
            <p className="card-text d-flex justify-content-between">
              <Link className=" text-muted" to={`/blogs/${blog.category}`}>
                Category : {blog.category}
              </Link>
              <small>{new Date(blog.createdAt).toLocaleString()}</small>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CardHorizontal;
