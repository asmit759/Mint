const studentModel = require("../models/studentSchema");
const SMS_sender = require("../utils/SMS_sender");

exports.sendSMS = async(req,res)=>{
    try {
        
        const {email_id} = req.body;

        const studentDetails = await studentModel.findOne({email_id});   //omm make it _id from token from middleware

        const parentNumber = `+91${studentDetails.fatherContact}`;
        const studentName = studentDetails.name;
        const studentRoll = studentDetails.roll_no;

        const msgData = SMS_sender(parentNumber,studentName,studentRoll);

        if(msgData){
            return res.status(200).json({
                success:true,
                message:"SMS sent success",
                msgData
            })
        }

    } catch (error) {
        return res.status(401).json({
                success:false,
                message:"Unable to send message",
                error:error.message,         
            })
    }
}