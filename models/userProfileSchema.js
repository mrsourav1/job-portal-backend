const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userProfileSchema =  Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  gender: {
    type: String,
    enum: ['male', 'female', 'prefer not to say'],
    required: true
  },
  phoneNumber: { type: Number, required: true, },
  currentLocation: { type: String },
  intermediateDetails:[
    {schoolName:{type:String},
    startYear:{
        type:Date
    },
    endYear:{
        type:Date  
    },
    class:{type:String},
    stream:{type:String},
    grades:{type:Number}
    }
  ],  
  graduationDetails:[
    {
      universityName:String,
      collegeName:{type:String},
    isCompleted:{
        type:String,
        enum:['pursuing','completed']
    },
    startYear:{
        type:Date
    },
    endYear:{
        type:Date  
    },
    degree:{type:String},
    stream:{type:String},
    grades:{type:Number}
    }
  ],
  mastersDetails:[
    { 
    universityName:String,
    collegeName:{type:String},
    isCompleted:{
        type:String,
        enum:['pursuing','completed']
    },
    startYear:{
        type:Date
    },
    endYear:{
        type:Date  
    },
    degree:{type:String},
    stream:{type:String},
    grades:{type:Number}
    }
  ],
  resume:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"file1.chunks"
  },
  applied:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Job"
  }]
});

let UserProfile= mongoose.model('UserProfile', userProfileSchema);
module.exports=UserProfile