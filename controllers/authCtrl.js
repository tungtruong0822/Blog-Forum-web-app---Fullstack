import Users from "../models/userModle.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";

import {
  generateActiveToken,
  generateAccessToken,
  generateRefreshToken,
} from "../middleware/signToken.js";
import sendEmail from "../middleware/sendMail.js";
import { sendSms, sendOTP, smsVerify } from "../middleware/sendSMS.js";
import { validateEmail, validPhone } from "../middleware/valid.js";

import { OAuth2Client } from "google-auth-library";

const MAIL_CLIENT_ID = `${process.env.MAIL_CLIENT_ID}`;

const BASE_URL = process.env.BASE_URL;

const client = new OAuth2Client(MAIL_CLIENT_ID);

const authCtrl = {
  register: async (req, res) => {
    try {
      const { name, account, password } = req.body;

      const user = await Users.findOne({ account });
      if (user)
        return res
          .status(400)
          .json({ msg: "Email or Phone number already exists." });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = { name, account, password: passwordHash };

      const active_token = generateActiveToken({ newUser });
      const url = `${BASE_URL}/active/${active_token}`;

      if (validateEmail(account)) {
        sendEmail(account, url, "verify your email address !");
        return res.json({
          msg: "Register successfully , Please check Mail!.",
          newUser,
          active_token,
        });
      }

      if (validPhone(account)) {
        sendSms(account, url, name);
        return res.json({
          msg: "Register successfully , Check your Sms !.",
          newUser,
          active_token,
        });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  activeAccount: async (req, res) => {
    try {
      const { active_token } = req.body;
      const decoded = jwt.verify(
        active_token,
        `${process.env.ACTIVE_TOKEN_SECRET}`
      );

      if (!decoded) {
        return res.status(400).json({ msg: "Invalid authentication" });
      }

      const newUser = new Users(decoded.newUser);

      const user = await Users.findOne({ account: newUser.account });
      if (user) {
        return res.status(400).json({ msg: "Account already exists !" });
      }

      await newUser.save();

      res.json({ msg: "Welcome to Forum Dev-H ... Please Login !", newUser });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(500).json({ msg: "Account already exists." });
      } else return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { account, password } = req.body;
      const user = await Users.findOne({ account });
      if (!user) {
        return res.status(400).json({ msg: "This Account Don't exists. " });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Password is incorrect." });

      loginUser(res, user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  loginGoogle: async (req, res) => {
    try {
      const { tokenID } = req.body;

      const vertify = await client.verifyIdToken({
        idToken: tokenID,
      });

      const { email, email_verified, name, picture } = vertify.getPayload();

      const password = email + "password";

      if (!email_verified) {
        return res.status(400).json({ msg: "Email vertification failied !" });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await Users.findOne({ account: email });

      if (user) {
        loginUser(res, user);
      } else {
        const user = {
          name,
          account: email,
          password: passwordHash,
          avatar: picture,
          type: "google",
        };

        registerUser(user, res);
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  loginFacebook: async (req, res) => {
    try {
      const { accessToken, userID } = req.body;

      const url = `https://graph.facebook.com/v3.0/${userID}/?fields=id,first_name,last_name,middle_name,email,picture&access_token=${accessToken}`;

      const data = await axios.get(url).then((res) => res.data);

      const { email, first_name, last_name, picture } = data;

      const name = last_name + " " + first_name;

      const password = email + "password";
      const passwordHash = await bcrypt.hash(password, 12);

      const user = await Users.findOne({ account: email });

      if (user) {
        loginUser(res, user);
      } else {
        const user = {
          name,
          account: email,
          password: passwordHash,
          avatar: picture.data.url,
          type: "facebook",
        };
        registerUser(user, res);
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  loginSms: async (req, res) => {
    try {
      const { account } = req.body;

      const user = await Users.findOne({ account });
      if (!user) {
        return res.status(400).json({ msg: "This Account Don't exists. " });
      }

      const data = await sendOTP(account, "sms");

      res.json(data);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  smsVerify: async (req, res) => {
    try {
      const { account, code } = req.body;

      const data = await smsVerify(account, code);

      if (!data.valid) {
        return res.status(400).json({ msg: "Invalid code please re-enter." });
      }

      console.log(data);

      const password = account + "password";

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await Users.findOne({ account });

      if (user) {
        loginUser(res, user);
      } else {
        const user = {
          name: account,
          account: account,
          password: passwordHash,
        };
        registerUser(user, res);
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: `/api/refresh_token` });

      res.json({ msg: "Logout Success ..." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: async (req, res) => {
    try {
      const fr_token = req.cookies.refreshtoken;

      if (!fr_token) {
        return res.status(400).json({ msg: "Please login now..." });
      }

      const decoded = jwt.verify(
        fr_token,
        `${process.env.REFRESH_TOKEN_SECRET}`
      );

      const user = await Users.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(400).json({ msg: "This Account don't exist." });
      }

      const access_token = generateAccessToken({ id: user._id });

      res.json({ access_token, user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default authCtrl;

const loginUser = async (res, user) => {
  const access_token = generateAccessToken({ id: user._id });
  const refresh_token = generateRefreshToken({ id: user._id });

  res.cookie("refreshtoken", refresh_token, {
    httpOnly: true,
    path: `/api/refresh_token`,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
  });

  res.json({ msg: "Login Success ...", access_token, user });
};

const registerUser = async (user, res) => {
  const newUser = new Users(user);
  await newUser.save();

  const access_token = generateAccessToken({ id: newUser._id });
  const refresh_token = generateRefreshToken({ id: newUser._id });

  res.cookie("refreshtoken", refresh_token, {
    httpOnly: true,
    path: `/api/refresh_token`,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
  });

  res.json({
    msg: "Login Success!",
    access_token,
    user: newUser,
  });
};
