const Validator = require("validator");

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
  

module.exports = { validateData, validateEditProfileData };
