const mongoose = require("mongoose");

const {Schema} = mongoose

const grievanceSchema = new Schema({

    student:{
        type:Schema.Types.ObjectId,
        ref:'studentModel',
        required: true
    },
    mentor:{
        type:Schema.Types.ObjectId,
        ref:'mentor',
        required:true
    },
    message: {
        type: String,
        required: true,
        trim: true,
        minLength: 10,
        maxLength: 1000,
    },
    resolved: {
        type: Boolean,
        default: false,
    },
    response: {
        type: String,
        default: "",
    },
},{timestamps:true});

const Grievance = mongoose.model("grievance",grievanceSchema);

module.exports = Grievance

