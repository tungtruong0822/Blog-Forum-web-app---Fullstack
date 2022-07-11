import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { alertAction, loading } from "./alert";
import { postAPI, getAPI } from "../../utils/fetchData";
import { imageUpload } from "../../utils/imageUpload";

export const createBlog = createAsyncThunk(
  "createBlog",
  async (data, { dispatch }) => {
    try {
      dispatch(loading(true));
      let url = "";

      if (typeof data.thumbnail !== "string") {
        const photo = await imageUpload(data.thumbnail);
        url = photo.url;
      } else {
        url = data.thumbnail;
      }
      const newData = { ...data, thumbnail: url };

      const res = await postAPI("/blog", newData, newData.token);

      dispatch(loading(false));
      dispatch(alertAction({ success: [res.data.msg] }));

      //   return
    } catch (err) {
      dispatch(alertAction({ errors: [err.response.data.msg] }));
      dispatch(loading(false));
      throw isRejectedWithValue(err.response.data.msg);
    }
  }
);

export const getHomeBlogs = createAsyncThunk(
  "getHomeBlogs",
  async (dispatch) => {
    try {
      dispatch(loading(true));

      const res = await getAPI("/blog");

      dispatch(loading(false));

      return res;
    } catch (err) {
      dispatch(alertAction({ errors: [err.response.data.msg] }));
      dispatch(loading(false));
      throw isRejectedWithValue(err.response.data.msg);
    }
  }
);

export const getBlogsByCategory = createAsyncThunk(
  "getBlogsByCategory",
  async ({ id, search }, { dispatch }) => {
    try {
      dispatch(loading(true));

      const res = await getAPI(`blogs/${id}${search}`);
      console.log(res);

      dispatch(loading(false));

      return res;
    } catch (err) {
      dispatch(alertAction({ errors: [err.response.data.msg] }));
      dispatch(loading(false));
      throw isRejectedWithValue(err.response.data.msg);
    }
  }
);

export const getBlogDetail = createAsyncThunk(
  "getBlogDetail",
  async (id, { dispatch }) => {
    try {
      dispatch(loading(true));

      const res = await getAPI(`blogs/details/${id}`);

      dispatch(loading(false));

      return res;
    } catch (err) {
      dispatch(alertAction({ errors: [err.response.data.msg] }));
      dispatch(loading(false));
      throw isRejectedWithValue(err.response.data.msg);
    }
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    homeBlogs: [],
    blogByCategory: {},
    blogDetails: {},
  },
  reducers: {},
  extraReducers: {
    [getHomeBlogs.fulfilled]: (state, action) => {
      state.homeBlogs = action.payload.data;
    },
    [getBlogsByCategory.fulfilled]: (state, action) => {
      state.blogByCategory = action.payload.data;
    },
    [getBlogDetail.fulfilled]: (state, action) => {
      state.blogDetails = action.payload.data;
    },
  },
});

// Action export
// export const {} = todosSlice.actions;

const blog = todosSlice.reducer;
export default blog;
