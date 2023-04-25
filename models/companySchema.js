const mongoose = require("mongoose")

const companySchema = new mongoose.Schema({
    companyName:{
        type:String,
        required:true
    },
    companyDescription:{
        type:String,
        required:true,
    },
    companyAddress:{
        type:String,
        required:true
    },
    companyEmail:{
        type:String,
        required:true,
        unique:false
    },
    companyPhone:{
        type:String,
        required:true
    },
    companyLogoUrl:{
        type:String
    },
    companyWebsiteUrl:{
        type:String
    },
    companyIndustryType:{
        type:String
    },
    companyJobs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job"
    }],
    employeeId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee"
    }]
})


module.exports = mongoose.model("Company",companySchema)