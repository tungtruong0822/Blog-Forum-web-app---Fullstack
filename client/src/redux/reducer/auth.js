import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { postAPI, getAPI } from "../../utils/fetchData";
import { alertAction, loading } from "./alert";

// Reducer Thunk

export const loginPass = createAsyncThunk(
  "loginPass",
  async (user, { dispatch }) => {
    try {
      dispatch(loading(true));
      const res = await postAPI("login", user);

      dispatch(loading(false));
      dispatch(alertAction({ success: [res.data.msg] }));
      localStorage.setItem("firstLogin", true);
      return res;
    } catch (err) {
      dispatch(alertAction({ errors: [err.response.data.msg] }));
      dispatch(loading(false));
      throw isRejectedWithValue(err.response.data.msg);
    }
  }
);

export const loginGoogle = createAsyncThunk(
  "loginGoogle",
  async (tokenID, { dispatch }) => {
    try {
      dispatch(loading(true));
      const res = await postAPI("loginGoogle", { tokenID });
      dispatch(loading(false));
      dispatch(alertAction({ success: [res.data.msg] }));
      localStorage.setItem("firstLogin", true);

      return res;
    } catch (err) {
      dispatch(alertAction({ errors: [err.response.data.msg] }));
      dispatch(loading(false));
      throw isRejectedWithValue(err.response.data.msg);
    }
  }
);

export const loginFacebook = createAsyncThunk(
  "loginFacebook",
  async ({ accessToken, userID }, { dispatch }) => {
    try {
      dispatch(loading(true));
      const res = await postAPI("loginFacebook", { accessToken, userID });
      dispatch(loading(false));
      dispatch(alertAction({ success: [res.data.msg] }));
      localStorage.setItem("firstLogin", true);

      return res;
    } catch (err) {
      dispatch(alertAction({ errors: [err.response.data.msg] }));
      dispatch(loading(false));
      throw isRejectedWithValue(err.response.data.msg);
    }
  }
);

export const verifySMS = createAsyncThunk(
  "verifySMS",
  async ({ account, code }, { dispatch }) => {
    try {
      dispatch(loading(true));
      const res = await postAPI("sms_verify", { account, code });
      console.log(res);
      dispatch(loading(false));
      window.location.replace("/homePage");
      dispatch(alertAction({ success: [res.data.msg] }));
      return res;
    } catch (err) {
      dispatch(alertAction({ errors: [err.response.data.msg] }));
      dispatch(loading(false));
      throw isRejectedWithValue(err.response.data.msg);
    }
  }
);

export const register = createAsyncThunk(
  "register",
  async (user, { dispatch }) => {
    try {
      dispatch(loading(true));
      const res = await postAPI("register", user);

      dispatch(loading(false));
      dispatch(alertAction({ success: [res.data.msg] }));

      return res;
    } catch (err) {
      dispatch(loading(false));
      dispatch(alertAction({ errors: [err.response.data.msg] }));
      throw isRejectedWithValue(err.response.data.msg);
    }
  }
);

export const refreshToken = createAsyncThunk("refreshToken", async () => {
  try {
    const res = await getAPI("refresh_token");

    return res;
  } catch (err) {
    throw isRejectedWithValue(err.response.data.msg);
  }
});

export const logout = createAsyncThunk("logout", async (dispatch) => {
  try {
    const res = await getAPI("logout");
    localStorage.removeItem("firstLogin");
    dispatch(alertAction({ success: [res.data.msg] }));
    return res;
  } catch (err) {
    dispatch(alertAction({ errors: [err.reponse.data.msg] }));
    throw isRejectedWithValue(err.response.data.msg);
  }
});

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    user: {},
    token: "",
  },
  reducers: {
    addaccount: (state, action) => {
      state.user = action.payload;
      return state;
    },
  },
  extraReducers: {
    //Get all todos
    [loginPass.fulfilled]: (state, action) => {
      state.user = action.payload.data.user;
      state.token = action.payload.data.access_token;
    },
    // [register.fulfilled]: (state, action) => {
    //   state.user = action.payload.data.user;
    //   state.token = action.payload.data.accsess_token;
    // },
    [refreshToken.fulfilled]: (state, action) => {
      state.user = action.payload.data.user;
      state.token = action.payload.data.access_token;
    },
    [loginGoogle.fulfilled]: (state, action) => {
      state.user = action.payload.data.user;
      state.token = action.payload.data.access_token;
    },
    [loginFacebook.fulfilled]: (state, action) => {
      state.user = action.payload.data.user;
      state.token = action.payload.data.access_token;
    },
    [verifySMS.fulfilled]: (state, action) => {
      state.user = action.payload.data.user;
      state.token = action.payload.data.access_token;
    },
    [logout.fulfilled]: (state) => {
      state.user = {};
      state.token = "";
    },
  },
});

// Action export
export const { addaccount } = todosSlice.actions;

const auth = todosSlice.reducer;
export default auth;
