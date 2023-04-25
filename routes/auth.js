const express = require("express")
const router = express.Router()

const {register,studentDetails,employee,company,job,jobApplied,getJobs, singleJob,login,employeeLogin,getJobApplicants,getJobApplicant} = require('../controllers/user.js')
const { verifyToken } = require("../middleware/auth.js")

// I am not good with naming something if someone working with this code and dont find naming convention good 'I am Sorry!!!' 

// routes for register user who are applying for job
router.route('/register').post(register) 


// routes for login who are applying for job
router.route("/login").post(login)

// routes for employee login who wants to hire
router.route('/employee-login').post(employeeLogin)
// router.route('/student-details').post(studentDetails)

// routes for employee register who wants to hire
router.route('/employee-register').post(employee)

// routes for employee adding company details
router.route('/company-register').post(company)

// routes for employee for adding a job
router.route('/job-post').post(job)

// routes for user where he/she can apply on job
router.route('/apply/:jobId').post(jobApplied)
// router.route('/apply').post(jobApplied)

// routes for someone who wants to see list of available job adding verifytoken just for test case and its working
router.route('/available-jobs').get(getJobs)
// router.get("/available-jobs", verifyToken, getJobs);

// routes for someone who wants to see details about single job
router.route('/available-jobs/:id').get(singleJob)    
// getting list of employee who applied

// routes to show list of user who applied for the job
router.route('/user-applied/:jobId').get(getJobApplicants)

// routes to show detail of the user who applied for the job
router.route('/user-applied/:jobId/:userId').get(getJobApplicant)

module.exports = router;