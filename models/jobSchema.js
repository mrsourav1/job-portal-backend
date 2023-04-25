const mongoose = require("mongoose")


const jobSchema = new mongoose.Schema({
    jobTitle:{
        type:String
    },
    jobType:{
        type:String,
        enum:["internship","job"]
    },
    jobLocationCategory:{
        type:String,
        enum:["work from home","on-site","hybrid"]
    },
    jobDescription:String,
    ctc:String,
    numberOfOpening:Number,
    location:String,
    minExperience:{
        type:String,
        enum:["fresher","less than 1","1","2","3","4","5","6","7","8","9","10"]
    },
    // company:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"Company"
    // },
    postBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee"
    },
    appliedBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserProfile"
    }]
})


module.exports = mongoose.model("Job",jobSchema)