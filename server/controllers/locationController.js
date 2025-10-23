const Student  = require("../models/studentSchema")
const mentor = require("../models/mentor")

exports.shareLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const studid = req.result._id
        if (!studid || !latitude || !longitude) {
        return res.status(400).json({
            success: false,
            message: "write all the feilds,,,,some feildss are missing",
        });
        }

        //location updated in student database
        const student = await Student.findByIdAndUpdate(studid,
            {
                lastKnownLocation: { latitude, longitude, timestamp: new Date() }
            },
            { new: true }
        );

        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        const mentorId = student.mentor;

        const mentorDetails = await mentor.findById(mentorId);
        

        mentorDetails.menteeLocation.menteeName = student.name;
        mentorDetails.menteeLocation.location = mapUrl;
        
        return res.status(200).json({
            success: true,
            message: "Location shared successfully",
            mapUrl,
            mentorDetails
        });


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"error getting the data",
            error:error.message
        })
    }
};




//  Mentor gets last known student location as student shares the location
//ask omm how to implement in mentor

exports.getStudentLocation = async (req, res) => {


    try {

        //i want mentor comes ..select a student from the drop down and then from that student we fetch the cordinates or we directly ek sectiion hoga maps ka then koi agar share kiya ho we just populate it  from the corinates??
        const { studentEmail } = req.query;
        
        const student = await Student.findOne({ email_id: studentEmail });

        
        console.log(student)
        if (!student || !student.lastKnownLocation) {
        return res.status(404).json({
            success: false,
            message: "Location not found for this student",
        });
        }
        

        const { latitude, longitude, timestamp } = student.lastKnownLocation;

        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        return res.status(200).json({
            success: true,
            message:"the map is displayed",
            mapUrl
        });



    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"error getting the data",
            error:error.message
        })
    }
};
