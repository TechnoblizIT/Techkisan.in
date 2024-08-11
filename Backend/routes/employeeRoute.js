const express = require('express');
const router=express.Router();
const {loginUser}=require("../controllers/employeeAuthController")
const employeeModel=require("../models/employee-model")
const nodemailer = require('nodemailer');
const crypto=require("crypto")
const bcrypt=require("bcrypt")
router.post('/login',loginUser)
router.post('/create', async(req, res) => {
  const { firstName, lastName ,email} = req.body;
  const username = firstName.toLowerCase() + lastName.toLowerCase() + crypto.randomBytes(3).toString('hex');
  const password = crypto.randomBytes(6).toString('hex');
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const newEmployee = new employeeModel({
    ...req.body,
    username,
    password:hashedPassword
  });
  
  await newEmployee.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'praduman.228@gmail.com',
      pass: 'fyig lxjy bscl qqkk'
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Your Employee Account Details',
    text: `Hello ${firstName},\n\n Your account has been created. Here are your login details:\n\nUsername: ${username}\nPassword: ${password}\n\nPlease change your password after logging in for the first time.\n\nThank you!\n\nTechkisan Automation :)`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send email' });
    }
    console.log('Email sent:', info.response);
  });

    console.log(newEmployee)
})


  module.exports = router;