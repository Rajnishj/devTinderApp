const express = require("express");
var bcrypt = require("bcryptjs");
const User = require("../models/user");
const { validateData, convertImageToInCloudnary } = require("../utils/validation");

const upload  = require("../middleware/multer");

const authRouter = express.Router();



authRouter.post("/signup",upload.single("photo"), async (req, res) => {
  const SAFE_USER_DATA = "firstName lastName photo age gender skill";
  try {
    const file = req.file;
    validateData(req);
    const cloudResponse = await convertImageToInCloudnary(file)

    const { firstName, lastName, emailId, password, skills, age, gender, about } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      password: passwordHash,
      emailId,
      skills,
      photo: cloudResponse.secure_url,
      age,
      gender,
      about,
    });
    await user.save();
    const userResponse = {
      firstName: user.firstName,
      lastName: user.lastName,
      photo: user.photo,
      age: user.age,
      gender: user.gender,
      skills: user.skills,
      about: user.about,
    }
    res.status(201).json({
      message: "User added successfully",
      user: userResponse,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      res.status(400).json({
        message: "Email has already been used. Please enter another email ID to proceed.",
      });
    } else {
      res.status(400).json({
        message: "Error during form handling",
        error: error.message,
      });
    }
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    //use findOne method so the data will be object instead of array as we know find method will return array of object
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials.");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        httpOnly: true, // Prevents access to the cookie via client-side JavaScript
        //secure: process.env.NODE_ENV === "production", // Ensures cookies are only sent over HTTPS in production
        sameSite: "strict", // Prevents CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiry (1 week)
      }).json({
        message: "Logged in successfully",
        user,
      });
    } else {
      throw new Error("Invalid credentials.");
    }
  } catch (error) {
    res.status(400).json({
      message: "Error during form Login",
      error: error.message,
    });
  }
});
authRouter.post("/logout", async (req, res) => {
res.cookie("token",null,{
  expires: new Date(Date.now())
})
res.send({
  message: "Logout Successfully",
});
});

module.exports = authRouter;
