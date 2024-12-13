const express = require("express");
const connectDB = require("./config/database");
const { userAuth } = require("./middleware/auth");
const User = require("./models/user");

const app = express();
app.use(express.json());


// app.post("/signup", async (req, res) => {
//   const reqBody = req.body;

//   // API-level validation
//   const errors = [];

//   // Validate firstName
//   if (!reqBody.firstName || reqBody.firstName.trim().length < 2 || reqBody.firstName.trim().length > 50) {
//     errors.push("First name must be between 2 and 50 characters long.");
//   }

//   // Validate lastName (optional in schema but can be validated at API level)
//   if (reqBody.lastName && (reqBody.lastName.trim().length < 2 || reqBody.lastName.trim().length > 50)) {
//     errors.push("Last name must be between 2 and 50 characters long.");
//   }

//   // Validate email
//   const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
//   if (!reqBody.emailId || !emailRegex.test(reqBody.emailId)) {
//     errors.push("Please provide a valid email address.");
//   }

//   // Validate password
//   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!$#%*?&])[A-Za-z\d@!$#%*?&]{8,}$/;
//   if (!reqBody.password || !passwordRegex.test(reqBody.password)) {
//     errors.push(
//       "Password must be at least 8 characters long, contain at least one letter, one number, and one special character (@, !, $, #, %, *, ?, &)."
//     );
//   }

//   // Validate age
//   if (reqBody.age && (reqBody.age < 18 || reqBody.age > 100)) {
//     errors.push("Age must be between 18 and 100.");
//   }

//   // Validate gender
//   if (reqBody.gender && !["Male", "Female", "Other"].includes(reqBody.gender)) {
//     errors.push("Gender must be Male, Female, or Other.");
//   }

//   // Validate skills
//   if (!Array.isArray(reqBody.skills) || reqBody.skills.length === 0) {
//     errors.push("At least one skill is required.");
//   }

//   // Validate photo URL
//   const photoRegex = /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)$/;
//   if (reqBody.photo && !photoRegex.test(reqBody.photo)) {
//     errors.push("Photo must be a valid image URL (jpg, gif, png, jpeg).");
//   }

//   // Validate about
//   if (reqBody.about && reqBody.about.length > 500) {
//     errors.push("About must be less than 500 characters.");
//   }

//   // If there are errors, return them
//   if (errors.length > 0) {
//     return res.status(400).json({
//       message: "Validation failed",
//       errors,
//     });
//   }

//   // Proceed with saving the user if no validation errors
//   const user = new User(reqBody);
//   try {
//     await user.save();
//     res.status(201).json({
//       message: "User added successfully",
//       user, // Include the user data in the response
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       // Handle duplicate key error
//       res.status(400).json({
//         message: "Email has already been used. Please enter another email ID to proceed.",
//       });
//     } else {
//       // Handle other errors
//       res.status(500).json({
//         message: "Error during form handling",
//         error: error.message,
//       });
//     }
//   }
// });

app.post("/signup", async (req, res) => {
  const reqBody = req.body;
  const user = new User(reqBody);

  try {
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

app.get("/user", async (req, res) => {
  console.log(req.body);
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).json({
        message: "User not found.",
      });
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});
app.delete("/user", async (req, res) => {
  console.log(req.body);
  const userId = req.body.userId;

  try {
    await User.findByIdAndDelete(userId);
    res.send({
      message: "User Deleted Successfully.",
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

app.patch("/user/:UserId", async (req, res) => {
  const userId = req.params.UserId;
  const data = req.body;
  const ALLOWED_USERS = ["photo", "firstName", "lastName", "age", "gender", "skills", "about"];
  const isAllowedUpdate = Object.keys(data).every((key) => ALLOWED_USERS.includes(key));
  try {
    if (!isAllowedUpdate) {
      throw new Error('User not allowed to update the field or invalid request');
    } 
    if (data.skills.length > 10) {
      throw new Error('Skills cannot be more than 10.');
    }
    await User.findByIdAndUpdate({ _id: userId }, data,{runValidators:true});
    res.send({
      message: "User Updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});
connectDB()
  .then(() => {
    console.log("Database connecting established...");
    app.listen("8000", () => {
      console.log("Server is started at port 8000");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected");
  });
