const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const toUser = await User.findById(toUserId);
    console.log(toUser)

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status type " + status,
      });
    }
    // if (String(fromUserId) === String(toUserId)) {
    //     return res.status(400).json({
    //       message: "Cannot send the request to himselft",
    //     });
    //   }
    if (!toUser) {
        return res.status(404).json({
          message: "User not found ",
        });
      }
    const connectRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionRequest) {
      return res.status(400).send({
        message: "Connection Request Already Exist!!",
      });
    }
    const data = await connectRequest.save();
    res.json({
      message: "Connecttion request send successfully.",
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error during form Login",
      error: error.message,
    });
  }
});
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
      const loggedInUser = req.user
      const {status,requestId} = req.params

      const allowedStatus = ["accepted","rejected"]
  
     
  
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message:"Status not allowed"})
    }
    const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser,
        status:"interested"
    })
    if(!connectionRequest){
        return res.status(404).json({message:"Connection request not found"})
    }
    connectionRequest.status = status
    const data = await connectionRequest.save()
    res.send({
        message:"Connection request " + status,
        data
    })
    } catch (error) {
      res.status(400).json({
        message: "Error during form Login",
        error: error.message,
      });
    }
  });
module.exports = requestRouter;
