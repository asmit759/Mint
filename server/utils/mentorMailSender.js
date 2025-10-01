const nodemailer = require("nodemailer");
require("dotenv").config();

const mentorMailSender = async (mentorEmailId, studentEmailArray, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        let results = await Promise.all(
            studentEmailArray.map(studentEmail => 
                transporter.sendMail({
                    from: `MINT : ${mentorEmailId}`,
                    to: `${studentEmail}`,
                    subject: `${title}`,
                    html: `${body}`
                })
            )
        );

        return results;

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = mentorMailSender;
