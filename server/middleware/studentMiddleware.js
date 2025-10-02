const jwt = require("jsonwebtoken");
const Student  = require("../models/studentSchema")
const studMid = async(req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token Not present");
        }
        const payload =jwt.verify(token,process.env.JWT_SERVER_KEY);
        const {_id} = payload;
        if(!_id) throw new Error("Id Not present");

        const result = await Student.findById(_id);
        if(!result) throw new Error("Student doesn't exist");

        req.result = result;

        next();  
        
    }catch(err){
        res.status(401).send("Error"+err);
    }
}

module.exports = {studMid}