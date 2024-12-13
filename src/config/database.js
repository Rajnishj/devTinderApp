const mongoose = require("mongoose")

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://kalwarraj94:s7pWoUJpSIeUdMKb@rajnish.xf6hc.mongodb.net/devTinder")
}
module.exports = connectDB
