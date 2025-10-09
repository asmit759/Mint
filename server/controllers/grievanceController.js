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

// Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const createGeoGrievance = async (req, res) => {
  try {
    const studentId = req.user?._id || req.result?.id;
    const { message,currentLat, currentLong } = req.body;

    if (!message || !currentLat || !currentLong) {
      return res.status(400).json({ error: "Message and location required" });
    }

    console.log("studentId:", studentId);
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    if (!student.hostel) return res.status(400).json({ error: "Hostel not assigned" });
    
    const hostel = await Hostel.findById(student.hostel);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });
    const { latitude, longitude } = hostel.hostelAddress[0];
    if (!latitude || !longitude)
      return res.status(400).json({ error: "Hostel location not set" });
    const distance = calculateDistance(currentLat, currentLong, latitude, longitude);
    console.log(`Distance from hostel: ${distance} km`);
     
    const allowedRadius = 0.4;//200 meters of stud location
    if (distance > allowedRadius) {
      return res.status(403).json({
        error: "You are not near your hostel. Grievance submission denied."
      });
    }
    const grievance = await Grievance.create({
      student: student._id,
      mentor: student.mentor,
      hostel: student.hostel,
      message
    });

    res.status(201).json({
      success: true,
      message: "grievance submitted successfully",
      grievance
    });

  } catch (err) {
    res.status(500).json({ error: "failed to submit grievance" });
  }
};




module.exports = {grievances,getMenteeGrievances,resolveGrievance,createGeoGrievance};