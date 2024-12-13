var jwt = require('jsonwebtoken');
const User = require("../models/user");
const userAuth = async(req,res,next) => {
    try {
        const cookie = req.cookies
        const { token} = cookie
        if(!token){
          throw new Error("Invalid token")
        }
        const decodeMessage = await jwt.verify(token,"Dev@Tinder1234")
        const {_id }= decodeMessage
        //to exclude password email in response we need to use select feature on findById
        const user = await User.findById(_id).select("-password -emailId -skills")
        if(!user){
          throw new Error("User does not exist")
        }
        req.user = user
        next()
      } catch (error) {
        res.status(400).json({
          message: "Error during form Login",
          error: error.message,
        });
      }
}
module.exports = {
    userAuth
}