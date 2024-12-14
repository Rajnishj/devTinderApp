const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const SAFE_USER_DATA = "firstName lastName photo age gender skill";
userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loginedUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loginedUser._id,
      status: "interested",
    })
      .populate("fromUserId", SAFE_USER_DATA) //populate the data in response of from user
      .populate("toUserId", SAFE_USER_DATA);
    res.json({
      message: "Data fetched Successfully",
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error during form Login",
      error: error.message,
    });
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loginedUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loginedUser._id, status: "accepted" },
        { fromUserId: loginedUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_USER_DATA) //populate the data in response of from user
      .populate("toUserId", SAFE_USER_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loginedUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Data fetched Successfully",
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error during form Login",
      error: error.message,
    });
  }
});
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loginedUser = req.user;
    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit)
    limit = limit > 50 ? 50 : limit
    const skip = (page - 1) * limit
    
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ toUserId: loginedUser._id }, { fromUserId: loginedUser._id }],
    }).select("fromUserId toUserId");

    const hideFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideFromFeed.add(req.fromUserId.toString());
      hideFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({
      $and: [{ _id: { $nin: Array.from(hideFromFeed) } }, { _id: { $ne: loginedUser._id } }],
    }).select(SAFE_USER_DATA).skip(skip).limit(limit);
    res.send(users);
  } catch (error) {
    res.status(400).json({
      message: "Error during form Login",
      error: error.message,
    });
  }
});
module.exports = userRouter;
