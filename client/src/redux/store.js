import { configureStore } from "@reduxjs/toolkit";
import auth from "./reducer/auth";
import alert from "./reducer/alert";
import blog from "./reducer/blog";
import profile from "./reducer/profile";
import comment from "./reducer/comment";
// Store
const store = configureStore({
  reducer: { auth, alert, blog, profile, comment },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Export
export default store;
