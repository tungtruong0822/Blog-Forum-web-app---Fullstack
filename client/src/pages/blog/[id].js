import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBlogDetail } from "../../redux/reducer/blog";
import NotFound from "../../components/notFound";
import Input from "../../components/comment/input";
import Comment from "../../components/comment/comment";
import { createComment, getComments } from "../../redux/reducer/comment";
import Pagination from "../../components/homePage/pagination";

function BlogDetails() {
  const [showComments, setShowComments] = useState([]);
  const { id } = useParams();
  const { blog, auth, comment } = useSelector((state) => state);
  const dispatch = useDispatch();

  const history = useHistory();
  const { search } = history.location;

  const handleComment = (body) => {
    if (!auth.user || !auth.token) return;

    const data = {
      content: body,
      user: auth.user,
      blog_id: blog.blogDetails._id,
      blog_user_id: blog.blogDetails.user._id,
    };

    dispatch(createComment({ data, auth }));

    setShowComments([...showComments, data]);
  };

  useEffect(() => {
    dispatch(getBlogDetail(id));
  }, [dispatch, id]);

  const fetchComments = useCallback(
    async (id, search) => {
      await dispatch(getComments({ id, search }));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchComments(id, search);
  }, [dispatch, id, search, fetchComments]);

  useEffect(() => {
    if (comment.blogComment.length === 0) return;
    setShowComments(comment.blogComment);
  }, [comment.blogComment]);
  return (
    <div>
      {blog.blogDetails ? (
        <div>
          <h2
            className="text-center my-3 text-capitalize fs-1"
            style={{ color: "#ff7a00" }}
          >
            {blog.blogDetails.title}
          </h2>

          <div className="text-end fst-italic" style={{ color: "teal" }}>
            <small>
              {blog.blogDetails.user && `By: ${blog.blogDetails.user.name}`}
            </small>

            <small className="ms-2">
              {new Date(blog.blogDetails.createdAt).toLocaleString()}
            </small>
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: blog.blogDetails.content,
            }}
          />

          {auth.token ? (
            <Input callback={handleComment} />
          ) : (
            <h5>
              Please{" "}
              <Link to={`/login?blog/${blog.blogDetails._id}`}>login</Link> to
            </h5>
          )}

          {showComments?.map((comment, index) => (
            <Comment key={index} comment={comment} />
          ))}

          <div className="pagination w-100 d-flex justify-content-center">
            <Pagination total={comment.total} />
          </div>
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
}

export default BlogDetails;
