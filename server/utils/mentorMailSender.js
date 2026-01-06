const nodemailer = require("nodemailer");

const mentorMailSender = async (
  mentorEmailId,
  studentEmailArray,
  title,
  body
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,              // ✅ REQUIRED
      secure: false,          // ✅ TLS
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });


    const results = await Promise.all(
      studentEmailArray.map((studentEmail) =>
        transporter.sendMail({
          from: `"MINT Notifications" <${process.env.MAIL_USER}>`,
          replyTo: mentorEmailId,                                   
          to: studentEmail,
          subject: title,
          html: body,
        })
      )
    );

    return results;

  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = mentorMailSender;
