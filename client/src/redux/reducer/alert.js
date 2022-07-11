import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Reducer Thunk

export const alertAction = createAsyncThunk("alert", async (notify) => {
  return notify;
});

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    loading: false,
    notify: {},
  },
  reducers: {
    loading(state, action) {
      state.loading = action.payload;
    },
  },
  extraReducers: {
    [alertAction.fulfilled]: (state, action) => {
      state.notify = action.payload;
    },
  },
});

// Action export
export const { loading } = todosSlice.actions;

const alert = todosSlice.reducer;
export default alert;
