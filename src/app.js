const express = require("express");
const connectDB = require("./config/database");
const cookiesParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookiesParser());

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/request")
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
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
