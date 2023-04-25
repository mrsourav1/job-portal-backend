const mongoose = require("mongoose")

uri = "mongodb+srv://hmwork:hmwork@cluster0.pjd0aj0.mongodb.net/?retryWrites=true&w=majority"
const uri = "mongodb+srv://hmwork:hmwork@cluster0.eiiayjc.mongodb.net/?retryWrites=true&w=majority";


const connect = ()=>{
    mongoose.set('strictQuery',false)
    
    return mongoose.connect(uri,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log("Db is Connected")
    })
}

module.exports = connect;