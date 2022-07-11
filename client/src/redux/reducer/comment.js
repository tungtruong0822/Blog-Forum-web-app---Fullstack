import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { alertAction, loading } from "./alert";
import { postAPI, getAPI, pathAPI, deleteAPI } from "../../utils/fetchData";

export const createComment = createAsyncThunk(
  "createComment",
  async ({ data, auth }, { dispatch }) => {
    try {
      const res = await postAPI("/comment", data, auth.token);

      return res;
    } catch (err) {
      dispatch(alertAction({ errors: [err.response.data.msg] }));
      throw isRejectedWithValue(err.response.data.msg);
    }
  }
);

export const getComments = createAsyncThunk(
  "getComments",
  async ({ id, search }, { dispatch }) => {
    try {
      dispatch(loading(true));
      const res = await getAPI(`comment/blog/${id}${search}`);
      dispatch(loading(false));

      return res;
    } catch (err) {
      dispatch(alertAction({ errors: [err.response.data.msg] }));
      throw isRejectedWithValue(err.response.data.msg);
    }
  }
);

export const createReplyComment = createAsyncThunk(
  "createReplyComment",
  async ({ data, auth }, { dispatch }) => {
    try {
      const res = await postAPI("/comment_reply", data, auth.token);

      return res;
    } catch (err) {
      dispatch(alertAction({ errors: [err.response.data.msg] }));
      throw isRejectedWithValue(err.response.data.msg);
    }
  }
);

export const updateComment = createAsyncThunk(
  "updateComment",
  async ({ newComment, auth }, { dispatch }) => {
    try {
      await pathAPI("/comment_update", newComment, auth);

      console.log(newComment);
      return newComment;
    } catch (err) {
      dispatch(alertAction({ errors: [err.response.data.msg] }));
      throw isRejectedWithValue(err.response.data.msg);
    }
  }
);

export const deleteCommentfetch = createAsyncThunk(
  "deleteComment",
  async ({ comment, auth }, { dispatch }) => {
    try {
      comment.comment_root
        ? dispatch(DELETE_REPLY(comment))
        : dispatch(DELETE_COMMENT(comment));

      await deleteAPI(`comment/${comment._id}`, auth.token);
      return comment;
    } catch (err) {
      dispatch(alertAction({ errors: [err.response.data.msg] }));
      throw isRejectedWithValue(err.response.data.msg);
    }
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    blogComment: [],
    total: "",
  },
  reducers: {
    DELETE_COMMENT(state, action) {
      return {
        ...state,
        blogComment: state.blogComment.filter(
          (item) => item._id !== action.payload._id
        ),
      };
    },
    DELETE_REPLY(state, action) {
      return {
        ...state,
        blogComment: state.blogComment.map((item) =>
          item._id === action.payload.comment_root
            ? {
                ...item,
                replyCM: item.replyCM?.filter(
                  (rp) => rp._id !== action.payload._id
                ),
              }
            : item
        ),
      };
    },
  },
  extraReducers: {
    [createComment.fulfilled]: (state, action) => {
      state.blogComment.unshift(action.payload.data);
    },
    [getComments.fulfilled]: (state, action) => {
      state.blogComment = action.payload.data.comments;
      state.total = action.payload.data.total;
    },
    [updateComment.fulfilled]: (state, action) => {
      return {
        ...state,
        blogComment: state.blogComment.map((item) =>
          item._id === action.payload._id
            ? action.payload
            : {
                ...item,
                replyCM: item.replyCM.map((rl) =>
                  rl._id === action.payload._id ? action.payload : rl
                ),
              }
        ),
      };
    },
  },
});

// Action export
const { DELETE_COMMENT, DELETE_REPLY } = todosSlice.actions;

const comment = todosSlice.reducer;
export default comment;
