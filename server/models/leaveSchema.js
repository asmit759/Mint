const mongoose = require("mongoose");
const { Schema } = mongoose;

const leaveSchema = new Schema({
  student: { 
    type: Schema.Types.ObjectId, 
    ref: "studentModel", 
    required: true
   },
  mentor: { 
    type: Schema.Types.ObjectId, 
    ref: "mentor", 
    required: true
   },
  reason: { 
    type: String, 
    required: true 
    },
  fromDate: { 
    type: Date, 
    required: true 
    },
  toDate: { 
    type: Date, 
    required: true 
    },
  parentApproval: { 
    type: Boolean, 
    default: false 
    },
  mentorApproval: { 
    type: Boolean, 
    default: false 
    },
  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Rejected"], 
    default: "Pending" 
    },
    passotp: {
    type: Number,
    min: 100000,
    max: 999999,
    default: 100000
    }

}, { timestamps: true });

const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;
