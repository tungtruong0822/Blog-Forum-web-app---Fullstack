import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { alertAction, loading } from "./alert";
import { pathAPI, getAPI } from "../../utils/fetchData";
import { checkImage, imageUpload } from "../../utils/imageUpload";

// Reducer Thunk

export const updateProfile = createAsyncThunk(
  "updateProfile",
  async ({ avatar, name, bio, skill, auth }, { dispatch }) => {
    try {
      dispatch(loading(true));

      if (!avatar) {
        avatar = auth.user.avatar;
      } else {
        const err = checkImage(avatar);
        if (err) {
          dispatch(alertAction({ errors: [err] }));
        } else {
          const image = await imageUpload(avatar);
          avatar = image.url;
        }
      }

      const res = await pathAPI(
        "updateProfile",
        { avatar, name, bio, skill },
        auth.token
      );
      dispatch(loading(false));

      dispatch(alertAction({ success: [res.data.msg] }));
      return;
    } catch (err) {
      dispatch(alertAction({ errors: [err.response.data.msg] }));
      dispatch(loading(false));
      throw isRejectedWithValue(err.response.data.msg);
    }
  }
);

export const updateAccount = createAsyncThunk(
  "updateAccount",
  async (
    { cf_password_new, password_new, password_old, auth },
    { dispatch }
  ) => {
    try {
      if (password_new !== cf_password_new) {
        return dispatch(alertAction({ errors: ["cf_password is incorrect"] }));
      }
      dispatch(loading(true));
      const res = await pathAPI(
        "/updateAccount",
        { cf_password_new, password_new, password_old },
        auth.token
      );
      dispatch(loading(false));

      dispatch(alertAction({ success: [res.data.msg] }));
      return;
    } catch (err) {
      dispatch(alertAction({ errors: [err.response.data.msg] }));
      dispatch(loading(false));
      throw isRejectedWithValue(err.response.data.msg);
    }
  }
);

export const getUser = createAsyncThunk(
  "getUser",
  async ({ id }, { dispatch }) => {
    try {
      dispatch(loading(true));
      const res = await getAPI(`profile/${id}`);

      dispatch(loading(false));

      return res;
    } catch (err) {
      dispatch(alertAction({ errors: [err.response.data.msg] }));
      dispatch(loading(false));
      throw isRejectedWithValue(err.response.data.msg);
    }
  }
);

export const getPost = createAsyncThunk(
  "getPost",
  async ({ id, search }, { dispatch }) => {
    try {
      dispatch(loading(true));
      const res = await getAPI(`blogs/user/${id}${search}`);

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
    user: {},
    post: {},
  },
  reducers: {},
  extraReducers: {
    [getUser.fulfilled]: (state, action) => {
      state.user = action.payload.data;
    },
    [getPost.fulfilled]: (state, action) => {
      state.post = action.payload.data;
    },
  },
});

// Action export
// export const {  } = todosSlice.actions;

const profile = todosSlice.reducer;
export default profile;
