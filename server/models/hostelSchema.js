const mongoose = require("mongoose");
const {Schema} = mongoose;

const HostelSchema = new Schema ({
    hostelIncharge:{
            type:Schema.Types.ObjectId,
            ref:'mentor'
    },
    hostelName:{
        type:String,
        minLength:3,
        maxLength:10  
    },
    hostelAddress:[
        {
            street: {
                type: String,
                minLength: 5,
                maxLength: 40
            },
            city: {
                type: String,
                minLength: 5,
                maxLength: 10
            },
            pincode: {
                type: Number,
                min: 100000, 
                max: 999999
            },
            state: {
                type: String,
                minLength: 3,
                maxLength: 20
            },
            country: {
                type: String,
                minLength: 5,
                maxLength: 30
            }
        }
    ],
    hostelContact:{
        type:Number,
        minLength:10,
        maxLength:10,
    },
    hostelEmail:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        immutable: true
    },
    messContact:{
        type:Number,
        minLength:10,
        maxLength:10
    },
    messService: {
        type: String,
        minLength:10,
        maxLength:20
    }

},{timestamps:true});

const Hostel = mongoose.model('hostel',HostelSchema);
module.exports = Hostel

