import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBlogsByCategory } from "../../redux/reducer/blog";
import CardBlog from "../../components/homePage/cardBlog";
import Pagination from "../../components/homePage/pagination";

function Blogs() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { blog } = useSelector((state) => state);
  const [data, setData] = useState([]);

  const history = useHistory();
  const { search } = history.location;

  useEffect(() => {
    dispatch(getBlogsByCategory({ id, search }));
  }, [dispatch, id, search]);

  useEffect(() => {
    setData([]);
    setData(blog.blogByCategory.blogs);
  }, [blog.blogByCategory.blogs]);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>{id}</h1>
      <div className="w-100 d-flex justify-content-center">
        <hr style={{ width: "80%" }} />
      </div>
      <div className="blog_get_category">
        {data &&
          data.map((blog, index) => <CardBlog blog={blog} key={index} />)}
      </div>

      <div className="pagination w-100 d-flex justify-content-center">
        <Pagination total={blog.blogByCategory.total} />
      </div>
    </div>
  );
}

export default Blogs;
