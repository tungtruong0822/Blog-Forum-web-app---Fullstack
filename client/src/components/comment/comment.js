import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ShowComment from "./showComment";

function Comment({ comment }) {
  const [showReply, setShowReply] = useState([]);
  const [page, setPage] = useState(2);

  useEffect(() => {
    if (comment.replyCM) {
      setShowReply(comment.replyCM);
    }
  }, [comment.replyCM]);
  return (
    <div
      className="my-3 d-flex"
      style={{
        opacity: comment._id ? 1 : 0.5,
        pointerEvents: comment._id ? "auto" : "none",
      }}
    >
      <div className="avatar_comment">
        <img src={comment.user.avatar} alt="avatar" />

        <small className="d-block ">
          <Link to={`/profile/${comment.user._id}`}>{comment.user.name}</Link>
        </small>
      </div>

      <ShowComment
        comment={comment}
        showReply={showReply}
        setShowReply={setShowReply}
      >
        {showReply?.slice(0, page).map((comment, index) => (
          <div
            key={index}
            style={{
              opacity: comment._id ? 1 : 0.5,
              pointerEvents: comment._id ? "initial" : "none",
            }}
            className="d-flex"
          >
            <div className="avatar_comment">
              <img src={comment.user.avatar} alt="avatar" />

              <small className="d-block ">
                <Link to={`/profile/${comment.user._id}`}>
                  {comment.user.name}
                </Link>
              </small>
            </div>
            <ShowComment
              comment={comment}
              showReply={showReply}
              setShowReply={setShowReply}
            />
          </div>
        ))}
        {page < showReply.length ? (
          <span
            style={{ float: "right", marginRight: "30px", cursor: "pointer" }}
            onClick={() => setPage(showReply.length)}
            className="text-danger"
          >
            Xem thêm
          </span>
        ) : page <= 2 ? (
          ""
        ) : (
          <span
            style={{ float: "right", marginRight: "30px", cursor: "pointer" }}
            onClick={() => setPage(2)}
            className="text-danger"
          >
            Ẩn bớt
          </span>
        )}
      </ShowComment>
    </div>
  );
}

export default Comment;
