const Student = require("../models/studentSchema");
const Mentor = require("../models/mentor");

const Hostel = require("../models/hostelSchema")

const Grievance = require("../models/greivanceSchema");

const grievances= async(req,res)=>{
    try{
        const {text} = req.body;
        const student = req.result;
        const mentorid = student.mentor;

        console.log(student,mentorid)

        if (!text || text.trim().length < 10) {
            return res.status(400).json({ error: "Grievance message is too short." });
        }

        const grievance = await Grievance.create({
            student:student.id,
            mentor:mentorid,
            message:text,
            resolved:false,
        })

        console.log(grievance)

        res.status(201).json({
            message: "Grievance submitted successfully.",
            grievance,
        });

    }catch(err){
        res.status(500).json({ error: "Failed to submit grievance." });
    }
}

const getMenteeGrievances = async(req,res)=>{
    try{
        const mentorId = req.user?._id || req.user?.id;

        if (!mentorId) {
            return res.status(400).json({ error: "Mentor ID missing from token" });
        }
        const grievances = await Grievance.find({ mentor: mentorId }).populate("student", "name roll_no email_id");

        res.status(200).json({ grievances });

    }catch(err){
        res.status(500).json({ error: "failed to get grievances." });
    }
}


const resolveGrievance= async(req,res)=>{
    try{
        const { grievanceId, response } = req.body;

        const grievance = await Grievance.findById(grievanceId);
        if (!grievance) return res.status(404).json({ error: "Greivance not found." });

        grievance.resolved = true;
        grievance.response = response || "Resolved by mentor.";
        await grievance.save();

        res.json({ message: "Grievance marked as resolved.", grievance });

    }catch(err){
        res.status(500).json({ error: "Failed to resolve grievance." });
    }
}

// Based on Geolocation



module.exports = {grievances,getMenteeGrievances,resolveGrievance};