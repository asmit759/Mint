const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
console.log(process.env.RESEND_API_KEY)

const mentorMailSender = async (
  mentorEmailId,
  studentEmailArray,
  title,
  body
) => {
  try {

    const results = await Promise.all(
      studentEmailArray.map((studentEmail) =>
        resend.emails.send({
          from: "MINT Notifications <onboarding@resend.dev>",
          to: studentEmail,
          subject: title,
          html: body,
          reply_to: mentorEmailId,
        })
      )
    );

    return results;

  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send emails");
  }
};

module.exports = mentorMailSender;