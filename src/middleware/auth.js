// var jwt = require('jsonwebtoken');
// const User = require("../models/user");
// const userAuth = async(req,res,next) => {
//     try {
//         const cookie = req.cookies
//         const { token} = cookie
//         if(!token){
//           throw new Error("Invalid token")
//         }
//         const decodeMessage = await jwt.verify(token,"Dev@Tinder1234")
//         const {_id }= decodeMessage
//         //to exclude password email in response we need to use select feature on findById
//         const user = await User.findById(_id).select("-password -emailId -skills")
//         if(!user){
//           throw new Error("User does not exist")
//         }
//         req.user = user
//         next()
//       } catch (error) {
//         res.status(400).json({
//           message: "Error during form Login",
//           error: error.message,
//         });
//       }
// }
// module.exports = {
//     userAuth
// }

var jwt = require('jsonwebtoken');
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        // Retrieve token from cookie or Authorization header
        const cookieToken = req.cookies?.token; // Token from cookies
        const authHeader = req.headers?.authorization; // Token from Authorization header
        const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        // Check if token exists in either source
        const token = cookieToken || bearerToken;

        if (!token) {
            throw new Error("Token not provided");
        }

        // Verify the token
        const decodeMessage = await jwt.verify(token, "Dev@Tinder1234");
        const { _id } = decodeMessage;

        // Fetch user and exclude sensitive fields
        const user = await User.findById(_id).select("-password -emailId -skills");
        if (!user) {
            throw new Error("User does not exist");
        }

        // Attach user to request object
        req.user = user;

        // Pass control to the next middleware
        next();
    } catch (error) {
        res.status(400).json({
            message: "Authentication failed",
            error: error.message,
        });
    }
};

module.exports = {
    userAuth,
};
