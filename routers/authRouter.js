import express from "express";
import authCtrl from "../controllers/authCtrl.js";
import { validRegister } from "../middleware/valid.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", validRegister, authCtrl.register);

router.post("/active", authCtrl.activeAccount);

router.post("/login", authCtrl.login);

router.post("/loginGoogle", authCtrl.loginGoogle);

router.post("/loginFacebook", authCtrl.loginFacebook);

router.post("/loginSms", authCtrl.loginSms);

router.post("/sms_verify", authCtrl.smsVerify);

router.get("/logout", authCtrl.logout);

router.get("/refresh_token", authCtrl.refreshToken);

export default router;
