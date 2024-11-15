const express = require('express');
const router =express.Router()
const upload=require("../configs/mutler-setup")
const internModel=require("../models/intern-model")
const managerModel = require('../models/manager-model');
const employeeModel = require('../models/employee-model');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt =require("jsonwebtoken")
const leaveModel=require("../models/leave-model")
const crypto = require("crypto")
const empimageModel=require("../models/employeeimg-model")

router.post('/create',upload.single("Image"), async function(req, res){
    
    try{
    const { firstName, lastName, email } = req.body;

    

    let username =  firstName.toLowerCase() + lastName.toLowerCase() + crypto.randomBytes(3).toString("hex");
    username = username.replaceAll(" ", "");
    const password = crypto.randomBytes(6).toString("hex");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newIntern = new internModel({
        ...req.body,
        username,
        password: hashedPassword,
        Image: [],
      });
      await newIntern.save();

    if (req.file) {
        const newEmpimg = new empimageModel({
          employee: newIntern._id,
          Image: req.file.buffer,
          Imagetype: req.file.mimetype,
        });
        await newEmpimg.save();
        newIntern.Image.push(newEmpimg._id);
        await newIntern.save();
    }
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Intern Account Details",
        text: `Hello ${firstName},\n\nYour account has been created. Here are your login details:\n\nUsername: ${username}\nPassword: ${password}\n\nPlease change your password after logging in for the first time.\n\nThank you!\n\nTechkisan Automation :)`,
      };
  
 
      await transporter.sendMail(mailOptions);
      console.log("Email sent");
  
     
      res.status(200).json({ message: "Email sent and created Intern successfully" });
  
    }catch(error) {
      console.error("Error creating intern:", error);
      res.status(500).json({ message: "Failed to create Inter" });
    }
})


router.get('/interndata', async (req, res) => {
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
    const intern = await internModel.findOne({username:decoded.user}).populate("manager")
    
  
    if (!intern) {
        return res.status(404).json({ message: 'Employee not found' });
    }

    const employeeImages = await empimageModel.find({ employee: intern._id });
    const empleaves = await leaveModel.find({ employeeId: intern._id });
    res.json({ employee: intern, empimg:employeeImages ,empleaves:empleaves});
} catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
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
  const managers=await managerModel.find({}).populate("Image")
  const interns=await internModel.find({}).populate("Image")
  const filteredIntern = interns.filter(intern => intern.username.toString() !== decoded.user.toString());
  res.json({employees,managers,filteredIntern})
  } catch (error) {
      res.status(401).json({ message: 'Unauthorized' });
  }
})

module.exports = router