import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CardBlog from "../components/homePage/cardBlog";

function HomePage() {
  const { blog } = useSelector((state) => state);

  return (
    <div className="homePage">
      {blog.homeBlogs.map((blogs, index) => (
        <div key={index}>
          <h3>
            <Link to={`blogs/${blogs.name}`}>{blogs.name.toUpperCase()}</Link>
            <span> ({blogs.count})</span>
          </h3>
          <div className="home_blogs">
            {blogs.blogs.map((blog, index) => (
              <CardBlog blog={blog} key={index} />
            ))}
          </div>
          {blogs.count > 4 && (
            <Link
              className="text-end d-block mt-2 mb-3"
              to={`/blogs/${blogs.name}`}
            >
              Read more &gt;&gt;
            </Link>
          )}
          <hr />
        </div>
      ))}
      <br />
    </div>
  );
}

export default HomePage;
