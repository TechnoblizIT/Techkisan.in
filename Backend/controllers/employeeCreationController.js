const employeeModel=require("../models/employee-model")
const bcrypt = require('bcrypt');
const crypto=require("crypto")
const nodemailer = require('nodemailer');
const empimageModel=require("../models/employeeimg-model")


module.exports.createEmployee=async(req,res)=>{
    try {
        const { firstName, lastName, email } = req.body;
        const username = email.split('@')[0];
        username = username.replaceAll(" ", "");
        const password = crypto.randomBytes(6).toString('hex');
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
       const newEmployee = new employeeModel({
          ...req.body,
          username,
          password: hashedPassword,
          Image: [],
        });
    
        await newEmployee.save();
    
        
        if (req.file) {
          const newEmpimg = new empimageModel({
            employee: newEmployee._id,
            Image: req.file.buffer,
            Imagetype: req.file.mimetype,
          });
          console.log(newEmpimg)
    
          await newEmpimg.save();
         console.log(newEmpimg._id)
          newEmployee.Image.push(newEmpimg._id);
    
          console.log(newEmployee)
          await newEmployee.save();
        }
    
        
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
    
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Your Employee Account Details',
          text: `Hello ${firstName},\n\nYour account has been created. Here are your login details:\n\nUsername: ${username}\nPassword: ${password}\n\nPlease change your password after logging in for the first time.\n\nThank you!\n\nTechkisan Automation :)`
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Failed to send email' });
          }
          console.log('Email sent:', info.response);
        });
    
        console.log(newEmployee);
        res.status(200).json({ message: 'Email sent and created employee successfully' });
      } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({ message: 'Failed to create employee' });
      }
}