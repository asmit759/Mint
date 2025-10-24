// require("dotenv").config();
const otpGenerator = require("otp-generator")
const SMS_sender = (student,leave,parentNumber)=>{
    try {    
        const otp = otpGenerator.generate(6, { 
                        upperCaseAlphabets: true,
                        lowerCaseAlphabets:true
                    });

        const body = `Dear Parent,
        Your ward ${student.name} (${student.roll_no}) has applied for leave from ${leave.fromDate} to ${leave.toDate}.

        * To approve this request, kindly reply with the code: ${otp}.
        * To deny, you may ignore this message.

        Thank you,
        School of Computer Engineering, KIIT Deemed to be University`;
    
        const accountSid = process.env.TWILIO_SID;
        const authToken = process.env.TWILIO_TOKEN;

        const client = require('twilio')(accountSid, authToken);

        // client.messages
        // .create({

        //     from: process.env.TWILIO_PHONENO,
        //     to: parentNumber,
        //     body: body,

        // })
        console.log(otp);
        return otp;

    } catch (error) {
        
        return error;

    }
}

module.exports = SMS_sender;