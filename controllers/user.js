const User = require("../models/userSchema.js")
const UserProfile = require("../models/userProfileSchema.js")
const Employee = require("../models/employeeSchema.js")
const Company = require("../models/companySchema.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Job = require("../models/jobSchema.js")
const mongoose = require('mongoose')


const register = async (req,res)=>{

    let userExist = await User.findOne({"email":req.body.email});
    console.log(userExist)
    if(userExist){
        res.status(401).json("already Exist");
        return;
    }
    let hashPassword = await bcrypt.hash(req.body.password,10);
    let response = new User({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        password:hashPassword,
    })
    await response.save()
    res.status(201).json(response)
}
  
const login = async (req,res)=>{
   try{
      const { email,password } = req.body;
      const user = await User.findOne({email:email});
      if (!user) return res.status(400).json({msg:"User Does not exist ."})
      const isMatch = await bcrypt.compare(password,user.password)
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " }) 
      const token = jwt.sign({ id: user._id }, "secret123");
      delete user.password;
      res.status(200).json({ token, user });
   }catch(error){
    res.status(500).json({error:error.message})
   }
}

const employeeLogin = async (req,res)=>{
  try{
     const { email,password } = req.body;
     const employee = await Employee.findOne({email:email});
     if (!employee) return res.status(400).json({msg:"employee Does not exist ."})
     const isMatch = await bcrypt.compare(password,employee.password)
     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " }) 
     const token = jwt.sign({ id: employee._id }, "secret123");
     delete employee.password;
     res.status(200).json({ token, employee });
  }catch(error){
   res.status(500).json({error:error.message})
  }
}


const studentDetails = async (req, res) => {
  const { user, gender, phoneNumber, currentLocation, intermediateDetails, graduationDetails,mastersDetails,resume } = req.body;
  console.log(req.body)
  const userProfile = new UserProfile({
    user,
    gender,
    phoneNumber,
    currentLocation,
    intermediateDetails,
    graduationDetails, 
    mastersDetails,
    resume: req.file.id
  });
  await userProfile.save();
  // res.status(200).json({message:"Done"});
  
    const foundUser = await User.findById(user);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
  
    const email = foundUser.email;
    const updateRegister = await User.findOneAndUpdate(
      { email: email },
      { userDetails: userProfile._id }, 
      { new: true, upsert: true, setDefaultsOnInsert: false }
    ).lean();
  
    if (!updateRegister) {
      return res.status(404).json({ message: "User not found" });
    }
  
    res.status(200).json({ message: "Update successful" });
  };
  

const employee = async (req,res)=>{
    try{

      let userExist = await Employee.findOne({"email":req.body.email});
        console.log(userExist)
        if(userExist){
            res.status(401).json("already Exist");
            return;
        }

        const { firstName,lastName,email,password } = req.body
        const studentEmail = await User.findOne({"email":req.body.email});
        if (studentEmail){
            res.status(401).json("Email alredy registered as Student")
            return;
        }
        let hashPassword = await bcrypt.hash(req.body.password,10);
        // const company = await Company.findById(companyId)
        const newEmployee = new Employee({
            firstName,
            lastName,
            email,
            password:hashPassword,
        })
        await newEmployee.save();
        const employee = await Employee.find();
        res.status(201).json(employee)
    }catch(err){
        res.status(409).json({message:err.message})
    }
}


// const company = async (req, res) => {
//     try {
//       const { companyName, companyDescription, companyAddress, companyEmail, companyPhone, companyLogoUrl, companyWebsiteUrl, companyIndustryType, companyJobs, employeeId } = req.body;

//       const existingCompany = await Company.findOne({ companyEmail });
//       if (existingCompany) {
//         existingCompany.employeeId.push(req.body.employeeId);
//         await existingCompany.save();
//         // const foundEmployee = existingCompany.employeeId[employeeId.length-1]
//         const foundEmployee = existingCompany.employeeId[existingCompany.employeeId.length-1];
//         console.log("THis is foundEmployee",foundEmployee)
//         if(foundEmployee){
//             const updateEmployee = await Employee.findOneAndUpdate(
//               {_id:foundEmployee},
//               {company:existingCompany._id }, 
//               { new:true, upsert:true, setDefaultsOnInsert:false }
//             ).lean();
//         }else{ 
//             console.log("Employee not found")
//         }
//         res.status(200).json({ message: 'Employee ID updated for existing company.' });
//       }else{
//         const newCompany = new Company({
//           companyName,
//           companyDescription,
//           companyAddress,
//           companyEmail,
//           companyPhone,
//           companyLogoUrl,
//           companyWebsiteUrl,
//           companyIndustryType,
//           companyJobs,
//           employeeId: [req.body.employeeId],
//         });
//         await newCompany.save();  
//         // const foundEmployee = existingCompany.employeeId[employeeId.length-1]
//         const foundEmployee = existingCompany.employeeId[existingCompany.employeeId.length-1];
//         console.log("THis is foundEmployee",foundEmployee)
//         if(foundEmployee){
//             const updateEmployee = await Employee.findOneAndUpdate(
//                 {_id:foundEmployee},
//                 {company:newCompany._id },
//                 { new:true, upsert:true, setDefaultsOnInsert:false }
//             ).lean();
//         }else{
//             console.log("Employee not found")
//         }   
//         if(!updateEmployee){
//           res.status(400).json({message:"not updated"})
//         }else{
//           res.status(200).json({message:"updated Succcessful"})
//         }    
//         res.status(201).json({ message: 'New company created.' });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal server error.' });
//     }
//   };

const company = async (req, res) => {
  try {
    const { companyName, companyDescription, companyAddress, companyEmail, companyPhone, companyLogoUrl, companyWebsiteUrl, companyIndustryType, companyJobs, employeeId } = req.body;

    const existingCompany = await Company.findOne({ companyEmail });
    if (existingCompany) {
      if (existingCompany.employeeId) {
        existingCompany.employeeId.push(req.body.employeeId);
      } else {
        existingCompany.employeeId = [req.body.employeeId];
      }
      await existingCompany.save();
      const foundEmployee = existingCompany.employeeId[existingCompany.employeeId.length-1];
      console.log("This is foundEmployee", foundEmployee)
      if (foundEmployee) {
        const updateEmployee = await Employee.findOneAndUpdate(
          { _id: foundEmployee },
          { company: existingCompany._id },
          { new: true, upsert: true, setDefaultsOnInsert: false }
        ).lean();
      } else {
        console.log("Employee not found")
      }
      res.status(200).json({ message: 'Employee ID updated for existing company.' });
    } else {
      const newCompany = new Company({
        companyName,
        companyDescription,
        companyAddress,
        companyEmail,
        companyPhone,
        companyLogoUrl,
        companyWebsiteUrl,
        companyIndustryType,
        companyJobs,
        employeeId: [req.body.employeeId],
      });
      await newCompany.save();
      const foundEmployee = newCompany.employeeId[newCompany.employeeId.length-1];
      console.log("This is foundEmployee", foundEmployee)

      const updateEmployee = await Employee.findOneAndUpdate(
        { _id: foundEmployee },
        { company: newCompany._id },
        { new: true, upsert: true, setDefaultsOnInsert: false }
      ).lean();
      
      if (!updateEmployee) {
        console.log('Employee not updated');
        res.status(400).json({ message: 'Employee not updated' });
      } else {
        console.log('Employee updated successfully');
        res.status(200).json({ message: 'Employee updated successfully' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

  

const job = async (req,res)=>{
    try{
        const { 
            jobTitle,
            jobType,
            jobLocationCategory,
            jobDescription,
            ctc,
            numberOfOpening,
            location,
            minExperience,
            postBy,
            appliedBy
        } = req.body
        const jobProfile = new Job(req.body);
        await jobProfile.save();
        const foundEmployee = await Employee.findOne({_id:postBy})
        if (foundEmployee){
          foundEmployee.jobPosted.push(jobProfile._id)
          await foundEmployee.save()
        }else{
        res.status(401).json({message: "Couldn't find Employee"})
        }
        res.status(201).json({message: "Job created successfully"});
    }catch(err){
        res.status(409).json({message:err.message})
    } 
}

// const job = async (req, res) => {
//   try {
//     const {
//       jobTitle,
//       jobType,
//       jobLocationCategory,
//       jobDescription,
//       ctc,
//       numberOfOpening,
//       location,
//       minExperience,
//       company,
//       postBy,
//       appliedBy,
//     } = req.body;

//     const jobProfile = new Job({
//       jobTitle,
//       jobType,
//       jobLocationCategory,
//       jobDescription,
//       ctc,
//       numberOfOpening,
//       location,
//       minExperience,
//       company,
//       postBy,
//       appliedBy,
//     });

//     // Populate the postBy field with the corresponding Employee object
//     await jobProfile.populate("postBy").execPopulate();

//     // Get the Company object from the Employee object
//     const updatedCompany = jobProfile.postBy.company;

//     // Set the company field in jobProfile
//     jobProfile.company = updatedCompany;

//     await jobProfile.save();

//     // Update the companyJobs array in the Company object
//     await Company.findByIdAndUpdate(
//       company,
//       { $push: { companyJobs: jobProfile._id } },
//       { new: true }
//     );

//     res.status(201).json({ message: "Job created successfully" });
//   } catch (err) {
//     res.status(409).json({ message: err.message });
//   }
// };




// const jobApplied =  async (req,res)=>{
//   try {
//     const { jobId,userId }  = req.params
//     console.log(jobId,userId)
//     // const { userId }  = req.params.userId;
//     // console.log(userId)
//     const job = await Job.findOne({_id:jobId});
//     if(job){
//       job.appliedBy.push(req.params.userId)
//       await job.save()
//     }
    
//     const userprofile = await UserProfile.findOne({ user:userId });
//     if(userprofile){
//       userprofile.applied.push(jobId);
//       await userprofile.save();
//       res.status(200).json({ message: 'Job application successful!' });
//     }else{
//       res.status(404).json({ message: 'User not found!' });
//     }
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: 'Server error' });
//   }
// }

const jobApplied =  async (req,res)=>{
  try {
    const jobId= req.params.jobId
    const  { userId }  = req.body
    console.log(jobId,userId)
    // const { userId }  = req.params.userId;
    // console.log(userId)
    const job = await Job.findOne({_id:jobId});
    if(job){
      if(!job.appliedBy.includes(req.body.userId)){
        job.appliedBy.push(req.body.userId)
        await job.save()
      }else{
        res.status(404).json({ message: 'Already Applied by User' });
      }  
    }else{
        res.status(404).json({ message: 'job not found!' });
    }
    const userprofile = await UserProfile.findOne({ user:userId });

    if(userprofile){
      if(!userprofile.applied.includes(jobId)){
        userprofile.applied.push(jobId);
        await userprofile.save();
        res.status(201).json({ message: 'Job application successful!' });
      }else{
        res.status(404).json({message:"already apllied"})
      }
    }else{
      res.status(404).json({ message: 'User not found!' });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' });
  }
}

// const getJobs = async(req,res)=>{
//   try {
//     const availableJobs = await Job.find({})
//     console.log(availableJobs)
//     res.status(200).json(availableJobs)
//   } catch (error) {
//     console.log(error)
//     res.status(404).json({message:error.message})
//   }
// }

const getJobs = async (req, res) => {
  try {
    const query = {};
    let page = Number(req.query.page) || 1

    let limit = Number(req.query.limit) || 20

    let skip = (page-1) * limit



    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.location) {
      query.location = req.query.location;
    }

    // const availableJobs = await Job.find(query);
    const availableJobs = await Job.find(query).skip(skip).limit(limit)
    console.log(availableJobs);
    if(availableJobs){
      res.status(200).json(availableJobs);
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};



const singleJob = async (req,res)=>{
  // console.log(req)
  const id = req.params.id;
  console.log(id)
  const response = await Job.findOne({_id:id})
  res.status(200).json(response)
}


// User who applied for the job

const getJobApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    let page = Number(req.query.page) || 1

    let limit = Number(req.query.limit) || 10

    let skip = (page-1) * limit

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const applicantIds = job.appliedBy;
    const applicants = await User.find({ _id: { $in: applicantIds } }).populate('userDetails').skip(skip).limit(limit)

    const applicantDetails = applicants.map((applicant) => {
      const userDetails = applicant.userDetails;

      return {
        userId: applicant._id,
        firstName: applicant.firstName,
        lastName:applicant.lastName,
        email: applicant.email,
        gender: userDetails.gender,
        phoneNumber:userDetails.phoneNumber,
        currentLocation:userDetails.currentLocation,
        intermediateDetails:userDetails.intermediateDetails,
        graduationDetails:userDetails.graduationDetails,
        mastersDetails:userDetails.mastersDetails
      };
    });

    res.status(200).json({ applicants: applicantDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const getJobApplicant = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.params.userId;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // const applicant = await User.findOne({
    //   _id: userId,
    //   _id: { $in: job.appliedBy },
    // }).populate('userDetails');

    const applicant = await User.findOne({
      _id: userId,
      _id: { $in: job.appliedBy },
    }).populate({
      path: 'userDetails',
      populate: { path: 'resume' }
    });

  
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    const userDetails = applicant.userDetails;
    console.log("userDetails",userDetails)

    const applicantDetails = {
      userId: applicant?._id,
      firstName: applicant?.firstName,
      lastName: applicant?.lastName,
      email: applicant?.email,
      gender: userDetails?.gender,
      phoneNumber: userDetails?.phoneNumber,
      currentLocation: userDetails?.currentLocation,
      intermediateDetails: userDetails?.intermediateDetails,
      graduationDetails: userDetails?.graduationDetails,
      mastersDetails: userDetails?.mastersDetails,
    };

    res.status(200).json({ applicant: applicantDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const getJobApplicantSingle=()=>{
  
}

module.exports = { register,studentDetails,employee,job,company,jobApplied,getJobs,singleJob,login,employeeLogin,getJobApplicants,getJobApplicantSingle,getJobApplicant}