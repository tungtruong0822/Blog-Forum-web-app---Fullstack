import Comments from "../models/commentModle.js";
import mongoose from "mongoose";

const Pagination = (req) => {
  let page = Number(req.query.page) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 4;
  let limit2 = Number(req.query.limit2) * 1 || 4;
  let skip = (page - 1) * limit;

  return { page, limit, skip, limit2 };
};

const commentCtrl = {
  createComment: async (req, res) => {
    if (!req.user)
      return res.status(400).json({ msg: "invalid Authentication." });

    try {
      const { content, blog_id, blog_user_id } = req.body;

      const newComment = new Comments({
        user: req.user,
        content,
        blog_id,
        blog_user_id,
      });

      await newComment.save();

      res.json(newComment);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getComments: async (req, res) => {
    const { limit, skip, limit2 } = Pagination(req);

    try {
      const data = await Comments.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  blog_id: mongoose.Types.ObjectId(req.params.id),
                  reply_user: { $exists: false },
                  comment_root: { $exists: false },
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "user",
                  foreignField: "_id",
                  as: "user",
                },
              },
              { $unwind: "$user" },
              {
                $lookup: {
                  from: "comments",
                  let: { cm_id: "$replyCM" },
                  pipeline: [
                    { $match: { $expr: { $in: ["$_id", "$$cm_id"] } } },
                    {
                      $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user",
                      },
                    },
                    { $unwind: "$user" },
                    {
                      $lookup: {
                        from: "users",
                        localField: "reply_user",
                        foreignField: "_id",
                        as: "reply_user",
                      },
                    },
                    { $unwind: "$reply_user" },
                  ],
                  as: "replyCM",
                },
              },
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [
              {
                $match: {
                  blog_id: mongoose.Types.ObjectId(req.params.id),
                  reply_user: { $exists: false },
                  comment_root: { $exists: false },
                },
              },
              { $count: "count" },
            ],
          },
        },
        {
          $project: {
            count: { $arrayElemAt: ["$totalCount.count", 0] },
            totalData: 1,
          },
        },
      ]);

      const comments = data[0].totalData;
      const count = data[0].count;

      let total = 0;

      if (count % limit === 0) {
        total = count / limit;
      } else {
        total = Math.floor(count / limit) + 1;
      }

      return res.json({ comments, total });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createReplyComment: async (req, res) => {
    if (!req.user)
      return res.status(400).json({ msg: "invalid Authentication." });
    try {
      const { content, blog_id, blog_user_id, comment_root, reply_user } =
        req.body;

      const newComment = new Comments({
        user: req.user._id,
        content,
        blog_id,
        blog_user_id,
        comment_root,
        reply_user: reply_user._id,
      });

      await Comments.findOneAndUpdate(
        { _id: comment_root },
        {
          $push: { replyCM: newComment._id },
        }
      );

      await newComment.save();

      return res.json(newComment);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateComment: async (req, res) => {
    if (!req.user)
      return res.status(400).json({ msg: "invalid Authentication." });
    try {
      const { _id, content } = req.body;
      await Comments.findOneAndUpdate({ _id }, { content });

      return res.json({ msg: "success Update" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteComment: async (req, res) => {
    if (!req.user)
      return res.status(400).json({ msg: "invalid Authentication." });

    try {
      const comment = await Comments.findOneAndDelete({
        _id: req.params.id,
        $or: [
          { user: req.user._id }, // xóa nếu comment của thằng này
          { blog_user_id: req.user._id }, // hoặc blog của thằng này
        ],
      });

      if (!comment)
        return res.status(400).json({ msg: "Comment does not exits." });

      if (comment.comment_root) {
        // update replyCM tức xóa reply
        await Comments.findOneAndUpdate(
          { _id: comment.comment_root },
          {
            $pull: { replyCM: comment._id },
          }
        );
      } else {
        // delete all comments in replyCM xóa blog
        await Comments.deleteMany({ _id: { $in: comment.replyCM } });
      }

      return res.json({ msg: "Delete Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default commentCtrl;
