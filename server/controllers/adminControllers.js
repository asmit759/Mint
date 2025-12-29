
const jwt = require("jsonwebtoken")

const mentor = require("../models/mentor");
const student = require("../models/studentSchema");

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


const assign = async (req,res)=>{
    try {
        
        const {mentor:mentorEmail,student: studentEmailArr} = req.body;

        if(!mentorEmail || studentEmailArr.length === 0){
            return res.status(400).json({
                message:"mentor email or student email is not entered"
            })
        }

        const mentorData = await mentor.findOne({email:mentorEmail});
        if(!mentorData){
            return res.status(400).json({
                message:"mentor not found"
            })
        }

        const students = await student.find({
            email_id: { $in: studentEmailArr },
            mentor: null
        });

        // if(!students.length !== studentEmailArr.length){
        //     return res.status(400).json({
        //         message:"Some students not found or already assigned a mentor"
        //     })
        // }

        
        const studentIds = students.map(s => s._id);

        await student.updateMany(
            { _id: { $in: studentIds } },
            { $set: { mentor: mentorData._id } }
        );

        await mentor.updateOne(
            { _id: mentorData._id },
            { $push: { mentees: { $each: studentIds } } }
        );
        

        return res.status(200).json({
            message: "Mentor assigned to students successfully",
            mentor: mentorData.email,
            studentsAssigned: studentIds.length
            
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"some error occured",
            error,
        })
    }
}

module.exports = {adminLogin,assign};