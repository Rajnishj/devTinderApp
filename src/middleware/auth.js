const userAuth = (req,res,next) => {
    console.log("Token is getting authorised")
    let token = "abc"
    let isAuthorised = token === "abc"
    if(!isAuthorised){
        res.status(401).send("Unauthorised user")
    }else{
        next()
    }
}
module.exports = {
    userAuth
}