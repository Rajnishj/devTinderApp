const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [50, "First name must be less than 50 characters"],
      trim: true, // Removes leading and trailing whitespace
    },
    lastName: {
      type: String,
     // required: [true, "Last name is required"],
      minlength: [2, "Last name must be at least 2 characters long"],
      maxlength: [50, "Last name must be less than 50 characters"],
      trim: true,
    },
    emailId: {
      type: String,
      required: [true, "Email ID is required"],
      unique: true,
      lowercase: true, // Converts email to lowercase
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
        validate: {
          validator: function (v) {
            // Password must contain at least one letter, one number, and may include special characters
            return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!$#%*?&])[A-Za-z\d@!$#%*?&]{8,}$/.test(v);
          },
          message:
            "Password must contain at least one letter, one number, and one special character (@, !, $, #, %, *, ?, &).",
        },
      },
      
    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
      max: [100, "Age must be less than 100"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    skills: {
        type: [String],
        validate: [
          {
            validator: function (arr) {
              return arr.length > 0;
            },
            message: "At least one skill is required",
          },
          {
            validator: function (arr) {
              return arr.length <= 10;
            },
            message: "A maximum of 10 skills is allowed",
          },
        ],
      },
      
    photo: {
      type: String,
      match: [
        /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)$/,
        "Photo must be a valid image URL",
      ],
    },
    about: {
      type: String,
      default: "This is about the user.",
      maxlength: [500, "About must be less than 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
