
const jwt = require("jsonwebtoken")
const adminLogin = async(req,res)=>{
    try{
        const {email,password} = req.body;

        if(email!=process.env.ADMIN_EMAIL && password!=process.env.ADMIN_PASS){
           return res.status(201).json({ error: "Invalid admin credentials" })
        }

        const token = jwt.sign({email,role:"admin"},process.env.JWT_SERVER_KEY,{expiresIn:"2h"})
        res.cookie('token',token,{maxAge:24*60*60*1000});

        res.status(200).send("Login Successfully as admin")

    }catch(err){
        res.status(500).send("Login Failed")
    }
}

module.exports = {adminLogin};