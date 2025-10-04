require("dotenv").config();

const mentorMailSender = require("../utils/mentorMailSender");

const mentor = require("../models/mentor");
const studentModel = require("../models/studentSchema");


exports.alertStudent = async(req,res) =>{
    try {
        
        const mentorData = await mentor.findById(req.user.id);
        
        //mentor data validation  
        if (!mentorData) {
            return res.status(404).json({
                success: false,
                message: "Mentor not found"
            });
        }
        const mentorEmail = mentorData.email;

        const {studentEmailArray} = req.body;
        //validating the studentn array
        if (!studentEmailArray) {
            return res.status(400).json({
                success: false,
                message: "Student email array is required"
            });
        }

        const {title, body} = req.body;

        const response = await mentorMailSender(mentorEmail,studentEmailArray,title,body);

        return res.status(200).json({
            success:true,
            message:"Mail sent to all student successfully",
            response
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            error:error.message,
            message:"failed to send the mail"
        })
    }
}