require("dotenv").config();
const otpGenerator = require("otp-generator")
const SMS_sender = (to,studentName,studentRoll)=>{
    try {    


        const otp = otpGenerator.generate(6, { 
                        upperCaseAlphabets: true,
                        lowerCaseAlphabets:true
                    });

        const body = `Dear Parent,
            Your ward ${studentName} (${studentRoll}) has applied for leave on {leaveDate we add later}.

            * To approve this request, kindly reply with the code: ${otp}.
            * To deny, you may ignore this message.

            Thank you,
            School of Computer Engineering, KIIT Deemed to be University`;
    
        const accountSid = process.env.TWILIO_SID;
        const authToken = process.env.TWILIO_TOKEN;

        const client = require('twilio')(accountSid, authToken);

        client.messages
        .create({

            from: process.env.TWILIO_PHONENO,
            to: to,
            body: body,

        })
        return message.sid;

    } catch (error) {
        
        return error;

    }
}

module.exports = SMS_sender;