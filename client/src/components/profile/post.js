import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPost } from "../../redux/reducer/profile";
import CardHorizontal from "../homePage/cardHorizontal";
import Pagination from "../homePage/pagination";
import { useHistory } from "react-router-dom";

function Post() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { profile } = useSelector((state) => state);

  const history = useHistory();
  const { search } = history.location;

  useEffect(() => {
    dispatch(getPost({ id, search }));
  }, [id, dispatch, search]);

  return (
    <div>
      <div className="">
        {profile.post.blogs ? (
          profile.post.blogs.map((blog, index) => (
            <CardHorizontal blog={blog} key={index} />
          ))
        ) : (
          <h1>No Blog</h1>
        )}
      </div>

      <div className="pagination w-100 d-flex justify-content-center">
        <Pagination total={profile.post.total} />
      </div>
    </div>
  );
}

export default Post;
