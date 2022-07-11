import Users from "../models/userModle.js";
import bcrypt from "bcrypt";

const profileCtrl = {
  updateProfile: async (req, res) => {
    try {
      const { avatar, bio, name, skill } = req.body;

      if (!Array.isArray(skill)) {
        const skillConvert = skill.split(",");
        await Users.findOneAndUpdate(
          { _id: req.user._id },
          { avatar, bio, name, skill: skillConvert }
        );
        res.json({ msg: "Update Success!" });
      } else {
        await Users.findOneAndUpdate(
          { _id: req.user._id },
          { avatar, bio, name, skill }
        );
        res.json({ msg: "Update Success!" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateAccount: async (req, res) => {
    try {
      const { cf_password_new, password_new, password_old } = req.body;

      if (req.user.type !== "register") {
        return res.status(400).json({ msg: "Invalid Type Login" });
      }

      const isMatch = await bcrypt.compare(password_old, req.user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Password_Old is incorrect" });

      const passwordHash = await bcrypt.hash(password_new, 12);

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        { password: passwordHash }
      );
      res.json({ msg: "Update Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id).select("-password");
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default profileCtrl;
