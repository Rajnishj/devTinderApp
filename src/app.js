const express = require("express");
const connectDB = require("./config/database");
const cookiesParser = require("cookie-parser");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000", // Allow only requests from this origin
  methods: ["GET", "POST",'PATCH','PUT','DELETE'], // Allow only specific HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers\
  credentials: true,
};

// Enable CORS with the options


const app = express();
app.use(express.json());
app.use(cookiesParser());
app.use(cors(corsOptions));

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/userRouter");
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
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
