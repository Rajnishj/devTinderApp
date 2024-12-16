const express = require("express");
const { userAuth } = require("../middleware/auth");
const {
  validateEditProfileData,
  convertImageToInCloudnary,
} = require("../utils/validation");
const User = require("../models/user");
const upload = require("../middleware/multer");

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
profileRouter.patch("/profile/edit", userAuth, upload.single("photo"), async (req, res) => {
  try {
    const file = req.file; // Multer stores the uploaded file in req.file
    const userId = req.user?._id; // Ensure req.user exists before accessing _id

    let cloudResponse;
    if (file) {
      try {
        cloudResponse = await convertImageToInCloudnary(file);
      } catch (error) {
        console.error("Cloudinary upload error:", error);
      }
    }

    const { firstName, lastName, emailId, password, skills, age, gender, about } = req.body;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Update user fields if they exist in the request
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (gender !== undefined) user.gender = gender;
    if (skills !== undefined) user.skills = skills;
    if (about !== undefined) user.about = about;
    if (age !== undefined) user.age = age;

    // Update user's photo if cloudResponse is available
    if (cloudResponse?.secure_url) {
      user.photo = cloudResponse.secure_url;
    }

    await user.save();
    console.log("User updated in database:", user);

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error during profile update:", error);
    res.status(400).json({
      message: "Error during form handling",
      error: error.message,
    });
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      console.log(validateEditProfileData(req));
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} your profile updated successfully.`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error during updating profile",
      error: error.message,
    });
  }
});
module.exports = profileRouter;
