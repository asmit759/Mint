const Student = require("../models/studentSchema");
const mentor = require("../models/mentor");
const Leave = require("../models/leaveSchema");
const SMS_sender = require("../utils/SMS_sender");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    }
});

const requestLeave = async(req,res)=>{

    try{  
        const id = req.result.id;

        const student = await Student.findById(id);
        
        if(!student.mentor)
        {
            throw new Error("No mentor assigned Till now");
        }

        const{reason, fromDate, toDate} = req.body;

        const leave = await Leave.create({
            studentId:student.id,
            mentor:student.mentor,
            reason,
            fromDate, 
            toDate

        })

        // sms 
        const parentNumber = `+91${student.fatherContact}`;
        const otp = SMS_sender(student,leave,parentNumber);
        leave.passotp = String(otp);
        await leave.save();
        // mail
        // console.log(msgData);
        console.log(student.parentEmail);

        const formLink = `https://mint-1zij.onrender.com/leave/parent-form?leaveId=${leave._id}`;

        await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: student.parentEmail,
        subject: `Leave Request for ${student.name}`,
        html: `
            <p>Dear Parent,</p>
            <p>Your child <b>${student.name}</b> has requested leave from 
            <b>${new Date(fromDate).toDateString()}</b> to 
            <b>${new Date(toDate).toDateString()}</b>.</p>
            <p>Reason: ${reason}</p>
            <p>An OTP has been sent to your registered phone number via SMS.</p>
            <p>Please approve by entering OTP here: 
            <a href="${formLink}">Enter OTP</a>
            </p>
        `,
        });

        res.status(201).json({
        message: "Leave request created. OTP sent via SMS. Approval form sent via email.",
        leaveId: leave._id,
        });

    }catch(err){
        console.error(err);
        res.status(500).send("Server error");
        
    }

}

const renderParentForm = async (req, res) => {
  try {
    const { leaveId } = req.query;
    const leave = await Leave.findById(leaveId)
      .populate({ path: 'studentId', select: 'name roll_no' }); 
    if (!leave) return res.status(404).send("Leave not found");

    res.send(`
      <h2>Approve Leave Request</h2>
      <p>Child: ${leave.studentId.name}</p>
      <form method="POST" action="/leave/verify-parent">
        <input type="hidden" name="leaveId" value="${leaveId}" />
        <label>Enter OTP (sent via SMS):</label>
        <input type="text" name="otp" required />
        <button type="submit">Submit</button>
      </form>
    `);
  } catch (err) {
    res.status(500).send("Error loading form");
  }
};

const verifyParentApproval = async (req, res) => {
  try {
    const { leaveId, otp } = req.body;
    const leave = await Leave.findById(leaveId)
      .populate({ path: 'studentId', select: 'name roll_no' })
      .populate({ path: 'mentor', select: 'name email' });
    if (!leave) return res.status(404).send("Leave not found");

    if (String(leave.passotp) === String(otp)) {
      leave.parentApproval = true;
      await leave.save();

       await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: leave.mentor.email,
        subject: 'Leave Request Awaiting Your Decision',
        html: `
          <p>Dear ${leave.mentor.name},</p>
          <p>${leave.studentId.name} (${leave.studentId.roll_no}) has requested leave from 
          <b>${leave.fromDate.toDateString()}</b> to <b>${leave.toDate.toDateString()}</b>.</p>
          <p>Reason: ${leave.reason}</p>
          <p>Parent has already <b>APPROVED</b> this leave.</p>
        `,
      });

      return res.send("<h2>Parent approval verified. Mentor notified.</h2>");
    } else {
      return res.status(400).send("<h2>Invalid OTP</h2>");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const approveLeave = async(req,res)=>{
    try {
    const { leaveId, decision } = req.body;

    const leave = await Leave.findById(leaveId);
    if (!leave){
      return res.status(404).json({
        success:false,
        message:"leave not able to fetch"
      })
    }

    if (!leave.parentApproval) {
      return res.status(400).json({ 
        success:false,
        message: "Parent approval required first" 
      });
    }

    if (decision === "Approved") {
      leave.mentorApproval = true;
      leave.status = "Approved";
    } else {
      leave.mentorApproval = false;
      leave.status = "Rejected";
    }

    await leave.save();
    return res.status(200).json({
       message: `Leave ${decision} by mentor`, 
       leave 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in mentor approval", error });
  }

}

const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find();

    const leavesWithStudent = await Promise.all(
      leaves.map(async (leave) => {
        const student = await Student.findById(leave.studentId);
        return {
          ...leave._doc,
          studentName: student?.name || "Unknown",
          studentEmail: student?.email_id || "N/A",
          studentParentContact: student?.fatherContact || "N/A",
        };
      })
    );

    res.status(200).json(leavesWithStudent);

  } catch (error) {
    console.error("Error fetching leaves:", error);
    res.status(500).json({ message: "Leaves not found", error });
  }
};


module.exports = {requestLeave,renderParentForm,verifyParentApproval,approveLeave,getLeaves}