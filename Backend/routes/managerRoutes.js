const express = require('express');
const router = express.Router();
const managerModel=require("../models/manager-model")
const crypto = require("crypto")
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt =require("jsonwebtoken")
const leaveModel=require("../models/leave-model")
const empimageModel=require("../models/employeeimg-model")
const upload=require("../configs/mutler-setup")
router.post("/create", upload.single("Image"), async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    console.log(req.body);

    let username =
      firstName.toLowerCase() + lastName.toLowerCase() + crypto.randomBytes(3).toString("hex");
    username = username.replaceAll(" ", "");
    const password = crypto.randomBytes(6).toString("hex");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newManager = new managerModel({
      ...req.body,
      username,
      password: hashedPassword,
      Image: [],
    });
    console.log(newManager);

    await newManager.save();

    if (req.file) {
      const newEmpimg = new empimageModel({
        employee: newManager._id,
        Image: req.file.buffer,
        Imagetype: req.file.mimetype,
      });
      

      await newEmpimg.save();
      
      newManager.Image.push(newEmpimg._id);

      await newManager.save();
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
      subject: "Your Manager Account Details",
      text: `Hello ${firstName},\n\nYour account has been created. Here are your login details:\n\nUsername: ${username}\nPassword: ${password}\n\nPlease change your password after logging in for the first time.\n\nThank you!\n\nTechkisan Automation :)`,
    };

    // Use async/await for sending the email to avoid double response issue
    await transporter.sendMail(mailOptions);
    console.log("Email sent");

    // Send the final success response
    res.status(200).json({ message: "Email sent and created employee successfully" });

  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "Failed to create employee" });
  }
});


router.get('/managerdata', async (req, res) => {
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
    const manager = await managerModel.findOne({username:decoded.user}); 
  
    if (!manager) {
        return res.status(404).json({ message: 'Manager not found' });
    }

    const employeeImages = await empimageModel.find({ employee: manager._id });
    console.log(employeeImages)
    const empleaves = await leaveModel.find({ employeeId: manager._id });
    res.status(200).json({ employee: manager, empimg:employeeImages ,empleaves:empleaves});
} catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
}
});





module.exports=router;