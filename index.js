const express = require('express')
const app = express()
const cors = require('cors')
const port = 443
const helmet = require('helmet')
const morgan = require('morgan')
const connect = require('./connect/conn.js')
const route = require("./routes/auth.js")
const bodyParser = require("body-parser")
const multer = require("multer")
const {studentDetails} = require('./controllers/user')
const mongoose = require("mongoose")
const path = require('path');
const { GridFsStorage } = require('multer-gridfs-storage');
const { ObjectId } = require("mongoose")
const UserProfile = require('./models/userProfileSchema.js')
// app.use(multer().any())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
// app.use(cors(
//     origin:""
// ))
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common")); 

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000}));

// app.use("/assets", express.static(path.join(__dirname, "public/assets")));
const mongouri = 'mongodb+srv://hmwork:hmwork@cluster0.pjd0aj0.mongodb.net/?retryWrites=true&w=majority';

// const storage = new GridFsStorage({
//     url: mongouri,
//     file: (req, file) => {
//         return new Promise((resolve, reject) => {
//             const filename = file.originalname;
//             const fileInfo = {
//                 filename: filename+userProfile.phoneNumber,
//                 bucketName: "file1"
//             };
//             resolve(fileInfo);
//         });
//     }
// });

const storage = new GridFsStorage({
    url: mongouri,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const originalName = file.originalname;
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const filename = uniqueSuffix + '-' + originalName;
            const fileInfo = {
                filename: filename,
                bucketName: "file1"
            };
            resolve(fileInfo);
        });
    }
});


const upload = multer({
    storage
});

//creating bucket
let bucket;
mongoose.connection.on("connected", () => {
    var client = mongoose.connections[0].client;
    var db = mongoose.connections[0].db;
    bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "file1"
    });
    //console.log(bucket);
});


app.post("/api/v1/student-details",upload.single('resume'),studentDetails)
// app.get("/api/v1/fileinfo/:filename", async (req, res) => {
    // const file = await bucket
    //     .find({
    //         filename: req.params.filename
    //     })
    // // console.log((file))

//     bucket.openDownloadStreamByName(req.params.filename).pipe(res);
// });

app.get("/api/v1/fileinfo/:id", async (req, res) => {
    const id  = req.params.id
    console.log(id)
    const file = await bucket.find({ _id:id}).toArray()
    console.log((file))

    bucket.openDownloadStream(id).pipe(res);
});
// app.get('/api/:id', (req, res) => {
//     var bucket = new mongodb.GridFSBucket(mydb, {
//       bucketName: 'ls-config',
//     })
//     var downStream = bucket.openDownloadStream(req.params.id);
//     downStream.pipe(res);
//   })
  

app.use("/api/v1/",route)


const start = async ()=>{
    try{
        await connect()
        app.listen(port,()=>{
            console.log(`i am at ${port}`)
        });
    }catch(error){
        console.log(error)
}
};
start();

// 640f00d41539becabd1dedc1

// {
//     "user": "640f00d41539becabd1dedc1",
//     "gender": "male",
//     "phoneNumber": 1234512345,
//     "currentLocation": "New York City",
//     "graduationDetails": [
      
//         {"collegeName": "Example University",
//         "isCompleted": "completed",
//         "startYear": "2018-09-01T00:00:00.000Z",
//         "endYear": "2022-05-01T00:00:00.000Z",
//         "degree": "Bachelor of Science",
//         "stream": "Computer Science",
//         "grades": 75}
      
//     ]
//   }
  




// {
//     "companyName":"HmInnovance2",
//     "companyDescription":"Gurugram based company do nothing",
//     "companyAddress":"Jaipur",
//     "companyEmail":"thistogutr@gmail.com",
//     "companyPhone":"1234567345",
//     "companyLogoUrl":"https://images-platform.99static.com//Swv-bV_eHWTQEPuWvu34VSaq6Mc=/321x324:1605x1608/fit-in/500x500/99designs-contests-attachments/103/103739/attachment_103739439",
//     "companyWebsiteUrl":"www.google.com",
//     "companyIndustryType":"IT",
//     "employeeId":"6433fc6e6bf971d55f6bae30"
// }


// {
//     "jobTitle":"Full Stack Engineer",
//     "jobType":"internship",
//     "jobLocationCategory":"on-site",
//     "jobDescription":"THis is job for full stack enginner not for someone who cant code",
//     "ctc":"5 Lpa",
//     "numberOfOpening":5,
//     "location":"Bihar",
//     "minExperience":"1",
//     "postBy":"641306a9a6c06ef9ad8604c4"
// }


// _id
// 6433fc6e6bf971d55f6bae30
// firstName
// "asdfsd"
// lastName
// "sfdg"
// email
// "yosdfsdu@gmail.com"
// password
// "$2a$10$2ChGiT81LMzPmBUegFTBxuTVIM1Z42RRlxZvMpESrQNgu8qyWfsie"
// __v
// 0
// company
// 6435264176dfd694ca9f5bfe