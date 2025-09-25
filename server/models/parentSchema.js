const mongoose = require("mongoose");
const {Schema} = mongoose;

const parentSchema = new Schema({

    fatherName:{
        type:String,
        minLength:5,
        maxLength:20
    },
    fatherContact:{
        type:Number,
        Length:10,
    },
    motherName:{
        type:String,
        minLength:5,
        maxLength:20
    },
    motherContact:{
        type:Number,
        Length:10,
    },
    parentEmail:{
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        immutable: true
    },
    

})

const Parent = mongoose.model('parent',parentSchema)
module.exports = Parent
