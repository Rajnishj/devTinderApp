const express = require('express')

const app = express()

app.use("/login",(req,res)=> {
    res.send("Loginned is successfully insyalled page")
})

app.use("/",(req,res)=> {
    res.send("Hello from server")
})


app.listen("3001",() => {
    console.log("Server is started")
})