const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subject:{
    type:String
    },
    facultyName:{
        type:String
    },
    facultyId:{
        type:String
    },
    totalDays:{
        type:Number
    },
    present:{
        type:Number
    },
    absent:{
        type:Number
    },
    excuses:{
        type:Number,
        default:0
    },
    percentage:{
        type:Number,
    }
});


const semesterSchema = new mongoose.Schema({
  semester: { 
        type: String, 
        enum: ["Autumn", "Spring"], 
        required: true 
    },
  subjects: [subjectSchema],
});

const yearSchema = new mongoose.Schema({
  year: { 
        type: String, 
        required: true 
    }, // eg ::::::::2025-26
  semesters: [semesterSchema],
});

const attendanceSchema = new mongoose.Schema({
  course: { 
        type: String, 
        default: "B.Tech"  //for now it is btech we can update it later to all courses
    },
  studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Student",
        required: true 
    },
  attendance: [yearSchema],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
