import Blogs from "../models/blogModle.js";
import mongoose from "mongoose";

const pagination = (req) => {
  let page = req.query.page * 1 || 1;
  let limit = req.query.limit * 1 || 4;
  let skip = (page - 1) * limit;

  return { page, limit, skip };
};

const blogCtrl = {
  createBlog: async (req, res) => {
    if (!req.user)
      return res.status(400).json({ msg: "Please Loginflex-row." });

    try {
      const { title, content, description, thumbnail, category } = req.body;

      const newBlog = new Blogs({
        user: req.user._id,
        title,
        content,
        description,
        thumbnail,
        category,
      });

      await newBlog.save();
      res.json({ msg: "Create blog Success ...", newBlog });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getHomeBlogs: async (req, res) => {
    try {
      const blogs = await Blogs.aggregate([
        {
          $lookup: {
            from: "users",
            let: { user_id: "$user" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
              { $project: { password: 0 } },
            ],
            as: "user",
          },
        },
        { $unwind: "$user" },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: "$category",
            name: { $first: "$category" },
            blogs: { $push: "$$ROOT" },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            blogs: {
              $slice: ["$blogs", 0, 4],
            },
            count: 1,
            name: 1,
          },
        },
      ]);

      res.json(blogs);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getBlogsByCategory: async (req, res) => {
    const { limit, skip } = pagination(req);
    try {
      const data = await Blogs.aggregate([
        {
          $facet: {
            totalData: [
              { $match: { category: req.params.category } },
              {
                $lookup: {
                  from: "users",
                  let: { user_id: "$user" },
                  pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                    { $project: { password: 0 } },
                  ],
                  as: "user",
                },
              },
              { $unwind: "$user" },
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [
              {
                $match: {
                  category: req.params.category,
                },
              },
              { $count: "count" },
            ],
          },
        },
        {
          $project: {
            totalData: 1,
            totalCount: 1,
          },
        },
        { $unwind: "$totalCount" },
      ]);

      const blogs = data[0].totalData;
      const count = data[0].totalCount.count;

      let total = 0;

      if (count % limit === 0) {
        total = count / limit;
      } else {
        total = Math.floor(count / limit) + 1;
      }

      res.json({ blogs, total });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getBlogsByUser: async (req, res) => {
    const { limit, skip } = pagination(req);
    try {
      const data = await Blogs.aggregate([
        {
          $facet: {
            totalData: [
              { $match: { user: mongoose.Types.ObjectId(req.params.id) } },
              {
                $lookup: {
                  from: "users",
                  let: { user_id: "$user" },
                  pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                    { $project: { password: 0 } },
                  ],
                  as: "user",
                },
              },
              { $unwind: "$user" },
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [
              {
                $match: {
                  user: mongoose.Types.ObjectId(req.params.id),
                },
              },
              { $count: "count" },
            ],
          },
        },
        {
          $project: {
            totalData: 1,
            totalCount: 1,
          },
        },
        { $unwind: "$totalCount" },
      ]);

      if (!data[0]) {
        return;
      }
      const count = data[0].totalCount.count;

      const blogs = data[0].totalData;

      let total = 0;

      if (count % limit === 0) {
        total = count / limit;
      } else {
        total = Math.floor(count / limit) + 1;
      }

      res.json({ blogs, total });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getBlog: async (req, res) => {
    try {
      const blog = await Blogs.findById(req.params.id).populate(
        "user",
        "-password"
      );

      if (!blog) {
        return res.status(400).json({ msg: "Blog dose not exist." });
      }

      res.json(blog);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default blogCtrl;
