const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const mentorMailSender = async (mentorEmail, students, title, body) => {
  return await Promise.all(
    students.map(email =>
      resend.emails.send({
        from: "MINT <no-reply@mint.kiit>",
        to: email,
        subject: title,
        html: body,
        reply_to: mentorEmail,
      })
    )
  );
};

module.exports = mentorMailSender;
