import express from "express";
import commentCtrl from "../controllers/commentCtrl.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/comment", auth, commentCtrl.createComment);

router.get("/comment/blog/:id", commentCtrl.getComments);

router.post("/comment_reply", auth, commentCtrl.createReplyComment);

router.patch("/comment_update", auth, commentCtrl.updateComment);

router.delete("/comment/:id", auth, commentCtrl.deleteComment);

export default router;
