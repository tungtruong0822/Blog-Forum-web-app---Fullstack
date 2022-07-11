/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  createReplyComment,
  deleteCommentfetch,
  getComments,
  updateComment,
} from "../../redux/reducer/comment";
import Input from "./input";

function ShowComment({ comment, children, setShowReply, showReply }) {
  const { auth } = useSelector((state) => state);
  const [edit, setEdit] = useState("");
  const [load, setLoad] = useState(false);
  const [deleteCM, setDeleteCM] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { search } = history.location;
  const { id } = useParams();

  const [isReply, setIsReply] = useState(false);

  const handleReply = (body) => {
    if (!auth.token) return;

    const data = {
      user: auth.user,
      blog_id: comment.blog_id,
      blog_user_id: comment.blog_user_id,
      content: body,
      reply_user: comment.user,
      comment_root: comment.comment_root || comment._id,
    };
    dispatch(createReplyComment({ data, auth }));
    setShowReply([...showReply, data]);
    setIsReply(false);
  };

  const handleUpdate = async (body) => {
    if (!auth.token) return;

    if (body === edit.content) {
      setEdit("");
    }

    const newComment = { ...edit, content: body };
    dispatch(updateComment({ newComment, auth: auth.token }));
    setEdit("");
    setLoad(!load);
  };

  const handleDelete = () => {
    dispatch(deleteCommentfetch({ comment, auth }));
    setDeleteCM(false);
  };

  const NavComment = (comment) => {
    return (
      <div className="d-flex align-items-center nav_comment">
        <i
          style={{ cursor: "pointer" }}
          onClick={() => setDeleteCM(true)}
          class="fa fa-trash mx-2"
        ></i>
        <i
          style={{ cursor: "pointer", marginTop: "2px" }}
          class="fa fa-edit"
          onClick={() => setEdit(comment)}
        ></i>
      </div>
    );
  };

  const deleteComment = () => {
    return (
      <div
        className="position-fixed delete-comment"
        style={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <div className="box_delete">
          <button
            className="btn btn-danger btn-delete"
            onClick={() => setDeleteCM(false)}
          >
            x
          </button>
          <button className="btn btn-secondary btn-sure" onClick={handleDelete}>
            Sure
          </button>
          <span style={{ marginTop: "10px" }}>
            Are you sure you want to delete?
          </span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    dispatch(getComments({ id, search }));
  }, [isReply, load, edit]);
  return (
    <div className="w-100 position-relative">
      {deleteCM && deleteComment()}
      {edit ? (
        <Input
          setEdit={setEdit}
          edit={edit}
          comment={""}
          callback={handleUpdate}
        />
      ) : (
        <div className="comment_box">
          <div
            className="p-2"
            dangerouslySetInnerHTML={{
              __html: comment.content,
            }}
          />
          <div
            className="position-absolute"
            style={{ top: 0, right: 0, marginRight: "20px", marginTop: "5px" }}
          >
            <span>
              {comment.blog_user_id &&
              comment.blog_user_id === auth.user?._id ? (
                comment.user._id === auth.user?._id ? (
                  NavComment(comment)
                ) : (
                  <i
                    style={{ cursor: "pointer" }}
                    class="fa fa-trash mx-2 nav_comment"
                    onClick={() => setDeleteCM(true)}
                  ></i>
                )
              ) : comment.user._id === auth.user?._id ? (
                NavComment(comment)
              ) : (
                ""
              )}
            </span>
          </div>

          <div className="d-flex justify-content-between ">
            <small
              className="comment-reply"
              style={{ cursor: "pointer" }}
              onClick={() => setIsReply(!isReply)}
            >
              {isReply ? "- Cancel -" : "- Reply -"}
            </small>
            <small>{new Date(comment.createdAt).toLocaleString()}</small>
          </div>
        </div>
      )}
      {isReply && <Input comment={comment} callback={handleReply} />}
      {children}
    </div>
  );
}

export default ShowComment;
