const Validator = require("validator");
const sharp = require('sharp');
const getDataUri  = require("./datauri");
const cloudinary  = require("./cloudnary");
const validateData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Please enter Firstname or lastName");
  } else if (!Validator.isEmail(emailId)) {
    throw new Error("Please Enter valid Email address");
  } else if (!Validator.isStrongPassword(password)) {
    throw new Error("Please Enter strong password");
  }
};

const validateEditProfileData = (req) => {
    const data = req.body;
  
    if (
      data.photo &&
      !Validator.isURL(data.photo, { protocols: ["http", "https"], require_protocol: true })
    ) {
      throw new Error("Please add valid image")
    }
  
    const ALLOWED_USERS = ["photo", "firstName", "lastName", "age", "gender", "skills", "about"];
    const isAllowedEdit = Object.keys(data).every((key) => ALLOWED_USERS.includes(key));
  
    return isAllowedEdit;
  };
  

  const convertImageToInCloudnary = async(file) =>{
    const supportedFormats = ["image/jpeg", "image/png", "application/pdf"];
    if (!supportedFormats.includes(file.mimetype)) {
      return res.status(400).json({ message: "Unsupported file format" });
    }
    let cloudResponse;
    if (file.mimetype === "application/pdf") {
      // Handle PDF upload
      const fileUri = getDataUri(file);
      //console.log(fileUri,"fileuri")
      cloudResponse = await cloudinary.uploader.upload(fileUri, {
        resource_type: "raw", // Use 'raw' for non-image files like PDFs
        folder: "users/pdfs", // Optional: specify folder in Cloudinary
        format: "png",
      });
    } else {
      // Handle image upload (JPEG/PNG)
      const optimizedImageBuffer = await sharp(file.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();

      // Convert buffer to Data URI
      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
        "base64"
      )}`;

      cloudResponse = await cloudinary.uploader.upload(fileUri, {
        folder: "users/images", // Optional: specify folder in Cloudinary
      });
    }
  return cloudResponse
  }

module.exports = { validateData, validateEditProfileData,convertImageToInCloudnary };
