const mongoose = require("mongoose")

// const File = mongoose.model('File', {
//     filename: String,
//     contentType: String,
//     size: Number,
//     uploadDate: Date,
//   });

const fileSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"company",
    },
    filename: String,
    contentType: String,
    size: Number,
    uploadDate: Date,
})