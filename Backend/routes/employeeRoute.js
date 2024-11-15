const express = require('express');
const router=express.Router();
const {loginUser , logoutUser,changePassword}=require("../controllers/employeeAuthController")
const{createEmployee}=require("../controllers/employeeCreationController")
const employeeModel=require("../models/employee-model")
const internModel=require("../models/intern-model")
const managerModel = require('../models/manager-model');
const leaveModel=require("../models/leave-model")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const empimageModel=require("../models/employeeimg-model")
const upload=require("../configs/mutler-setup")
const {punchIn,punchOut}=require("../controllers/employeePunchController")
const {addWfh}=require("../controllers/employeeWfhController");
const nodemailer = require("nodemailer")
router.post('/login',loginUser)


router.post('/logout',loginUser)

router.post('/create', upload.single("Image"),createEmployee);



router.get('/empdata', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
   
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await employeeModel.findOne({username:decoded.user}).populate("manager")
    
  
    if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
    }

    const employeeImages = await empimageModel.find({ employee: employee._id });
    const empleaves = await leaveModel.find({ employeeId: employee._id });
    res.json({ employee: employee, empimg:employeeImages ,empleaves:empleaves});
} catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
}
});

router.post("/addWfh",addWfh)



router.post("/changepassword", changePassword)



router.post("/punchIn",punchIn)

router.post('/punchOut' , punchOut)


router.get("/getLeaves",async(req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET); 

  const employee = await employeeModel.findOne({username:decoded.user}); 

  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  const empleaves = await leaveModel.find({ employeeId: employee._id });
  res.json(empleaves);
})


router.post("/addLeave", async function(req, res){
  const {leaveType,fromDate,toDate,fromTime,toTime,reason,leaveStation,vacationAddress,contactNumber}=req.body
const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
}

const token = authHeader.split(' ')[1];

if (!token) {
    return res.status(401).json({ message: 'Token missing' });
}

const decoded = jwt.verify(token, process.env.JWT_SECRET); 

const employee = await employeeModel.findOne({username:decoded.user}).populate("manager"); 

if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
}

const leave = new leaveModel({
  typeofLeaves: leaveType,
  fromDate: fromDate,
  toDate: toDate,
  employeeId: employee._id,
  fromTime: fromTime,
  toTime: toTime,
  reason: reason,
  managerId: employee.manager._id,
  vocationalAddress: leaveStation,
  contactno: contactNumber
})

await leave.save();

const leaveid=await leaveModel.findOne({employeeId: employee._id});

employee.leaves.push(leaveid._id);

const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: employee.manager.email,
          subject: `Leave Request Submitted by ${employee.firstName+" "+employee.lastName}`,
          text: `Dear ${employee.manager.firstName+" "+employee.manager.lastName},\n\nThis is to inform you that ${employee.firstName} has submitted a leave request through the employee dashboard.\n\n Leave Type: ${leave.typeofLeaves}\n Leave Dates: ${new Date(leave.fromDate).toLocaleDateString()} to  ${new Date(leave.toDate).toLocaleDateString()} \n Reason : ${leave.reason}\n Please review and take the necessary action to approve or deny this request on your manager dashboard.\n\n Thank you for your prompt attention to this request.\n\n Best regards,\n\n TechKisan Automations`
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Failed to send email' });
          }
          console.log('Email sent:', info.response);
        });
    
        
        res.status(200);
      


res.json({ message: "Leave request sent successfully",leave:leave}).status(200);


})

router.get('/deleteLeaves/:leaveId', async (req, res) => {
  try {
    const { leaveId } = req.params;
    await leaveModel.findByIdAndDelete(leaveId);
    res.status(200).json({ message: 'Leave successfully canceled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error canceling leave' });
  }
});
router.get("/allusers" , async function(req, res){
  try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
          return res.status(401).json({ message: 'Authorization header missing' });
      }
      const token = authHeader.split(' ')[1];
      if (!token) {
          return res.status(401).json({ message: 'Token missing' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const employees=await employeeModel.find({}).populate("Image")
  const filteredEmployees = employees.filter(employee => employee.username.toString() !== decoded.user.toString());
  const managers=await managerModel.find({}).populate("Image")
  const interns=await internModel.find({}).populate("Image")
 
  res.json({filteredEmployees,managers,interns})
  } catch (error) {
      res.status(401).json({ message: 'Unauthorized' });
  }
})

  module.exports = router;