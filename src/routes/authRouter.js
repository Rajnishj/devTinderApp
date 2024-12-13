const express = require("express");
var bcrypt = require("bcryptjs");
const User = require("../models/user");
const { validateData } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const reqBody = req.body;

    validateData(req);
    const { firstName, lastName, emailId, password, skills, photo, age, gender, about } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      password: passwordHash,
      emailId,
      skills,
      photo,
      age,
      gender,
      about,
    });
    await user.save();
    res.status(201).json({
      message: "User added successfully",
      user: user, // Include the user data in the response
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      res.status(400).json({
        message: "Email has already been used. Please enter another email ID to proceed.",
      });
    } else {
      // Handle other errors
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
      res.cookie("token", token);
      res.send({
        message: "Logined in successfully.",
        user: user,
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
