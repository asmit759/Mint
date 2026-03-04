
const nodemailer = require("nodemailer");

const mentorMailSender = async (mentorEmailId, studentEmailArray, title, body) => {
  try {

    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 6,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },

});


    // Send emails to all students
    const results = await Promise.all(
      studentEmailArray.map((studentEmail) =>
        transporter.sendMail({
          from: `"MINT Notifications" <${process.env.MAIL_USER}>`, // valid from
          replyTo: mentorEmailId,                                   // reply goes to mentor
          to: studentEmail,
          subject: title,
          html: body,
        })
      )
    );

    return results;

  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw new Error("Failed to send emails");
  }
};

module.exports = mentorMailSender;
