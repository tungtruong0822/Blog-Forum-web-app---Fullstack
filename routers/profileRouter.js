import express from "express";
import profileCtrl from "../controllers/profileCtrl.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.patch("/updateProfile", auth, profileCtrl.updateProfile);

router.patch("/updateAccount", auth, profileCtrl.updateAccount);

router.get("/profile/:id", profileCtrl.getUser);

export default router;
