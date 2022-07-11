import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoose from "mongoose";

// middleware
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());

// router
import authRouter from "./routers/authRouter.js";
import profileRouter from "./routers/profileRouter.js";
import blogRouter from "./routers/blogRouter.js";
import commentRouter from "./routers/commentRouter.js";
app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", blogRouter);
app.use("/api", commentRouter);

// deloy
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
  });
}

// listenn

const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to mongodb");
  }
);

app.listen(process.env.PORT || 5000, () => {
  console.log("server run  ");
});
