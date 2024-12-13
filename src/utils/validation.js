const Validator = require('validator')

const validateData = (req) => {
    const {firstName,lastName,emailId,password} = req.body
    if(!firstName || !lastName){
        throw new Error("Please enter Firstname or lastName")
    }else if(!Validator.isEmail(emailId)){
        throw new Error("Please Enter valid Email address")
    }else if(!Validator.isStrongPassword(password)){
        throw new Error("Please Enter strong password")
    }
}

module.exports = {validateData}