
const Student = require('../models/studentSchema')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const validate= require("../utils/validator")

const studentRegister = async (req,res)=>{
    try {
        validate(req.body);
        const {email_id,name,password} = req.body;
        req.body.password= await(bcrypt.hash(password,10));
        const student = await Student.create(req.body);

        const token = jwt.sign({_id:student._id,email_id:email_id,},process.env.JWT_SERVER_KEY,{expiresIn:60*60})
        res.cookie('token',token,{maxAge:60*60*1000})
        const reply = {
            name:student.name,
            email_id:student.email_id,
            roll_no:student.roll_no,
            address:student.address,
            profilePhotoUrl:student.profilePhotoUrl,
            mentor:student.mentor,
            parent:student.parent,
        }

        res.status(200).json({
            message:"Registered Sucessfully",
            student:reply
        })
 
    }catch(error){
        res.status(404).send("Error:"+error);
    }
}
const studentLogin = async (req,res)=>{
    try {

        const {email_id,password} = req.body;

        if(!email_id)throw new Error("Email Missing");
        if(!password)throw new Error("Password missing");
        const student = await Student.findOne({email_id});

        isPassed = bcrypt.compare(password,student.password);
        if(!isPassed)throw new Error("invalid Credentials");

        const token = jwt.sign({_id:student._id,email_id:email_id,},process.env.JWT_SERVER_KEY,{expiresIn:60*60})
        res.cookie('token',token,{maxAge:60*60*1000})

        const reply = {
            name:student.name,
            email_id:student.email_id,
            roll_no:student.roll_no,
            address:student.address,
            profilePhotoUrl:student.profilePhotoUrl,
            mentor:student.mentor,
            parent:student.parent,
        }

        res.status(200).json({
            message:"Login Sucessfully",
            student:reply
        })
    }
    catch(error){
        res.status(200).send("Error:"+error);
    }
}

const studentLogout = async (req,res)=>{
    try{
        res.cookie('token',null,{expires:new Date(Date.now())})

        res.status(200).send("Logout Sucessfull");
        
    }catch(error){
        res.status(401).send("Error:"+error);
    }
}

module.exports = {studentLogin,studentLogout,studentRegister};

