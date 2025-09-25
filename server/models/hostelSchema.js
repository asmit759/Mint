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
        minLength:9,
        maxLength:10,
    },
    hostelEmail:{
        type:String,
        minLength:7,
        maxLength:20
    }
},{timestamps:true})