const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).json({
      message: "Error during form Login",
      error: error.message,
    });
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
   
   if(!validateEditProfileData(req)){
    throw new Error("Invalid Edit Request")
   }
   const loggedInUser = req.user;
   Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])
   await loggedInUser.save()
   res.json({
    message: `${loggedInUser.firstName} your profile updated successfully.`,
    data: loggedInUser
  })
  } catch (error) {
    res.status(400).json({
      message: "Error during updating profile",
      error: error.message,
    });
  }
});
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
   
   if(!validateEditProfileData(req)){
    console.log(validateEditProfileData(req))
    throw new Error("Invalid Edit Request")
   }
   const loggedInUser = req.user;
   Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])
   await loggedInUser.save()
   res.json({
    message: `${loggedInUser.firstName} your profile updated successfully.`,
    data: loggedInUser
  })
  } catch (error) {
    res.status(400).json({
      message: "Error during updating profile",
      error: error.message,
    });
  }
});
module.exports = profileRouter;
