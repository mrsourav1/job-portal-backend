const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    password:String,
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"company",
    },
    jobPosted:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job",
    }]
})

module.exports = mongoose.model("Employee",employeeSchema)