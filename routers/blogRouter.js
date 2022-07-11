import express from "express";
import blogCtrl from "../controllers/blogCtrl.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/blog", auth, blogCtrl.createBlog);
router.get("/blog", blogCtrl.getHomeBlogs);
router.get("/blogs/:category", blogCtrl.getBlogsByCategory);
router.get("/blogs/user/:id", blogCtrl.getBlogsByUser);
router.get("/blogs/details/:id", blogCtrl.getBlog);

export default router;
