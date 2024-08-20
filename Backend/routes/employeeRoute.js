const express = require('express');
const router=express.Router();
const {loginUser , logoutUser}=require("../controllers/employeeAuthController")
const{createEmployee}=require("../controllers/employeeCreationController")
const employeeModel=require("../models/employee-model")

const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const empimageModel=require("../models/employeeimg-model")
const upload=require("../configs/mutler-setup")



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

    const employee = await employeeModel.findOne({username:decoded}); 

  
    if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
    }

    const employeeImages = await empimageModel.find({ employee: employee._id });

    res.json({ employee: employee, empimg:employeeImages });
} catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
}
});



router.post("/changepassword", async(req, res) => {
 const { currentPassword, newPassword } = req.body;
 const authHeader = req.headers.authorization;

 if (!authHeader) {
     return res.status(401).json({ message: 'Authorization header missing' });
 }

 const token = authHeader.split(' ')[1];

 if (!token) {
     return res.status(401).json({ message: 'Token missing' });
 }

 const username = jwt.verify(token, process.env.JWT_SECRET);
 
 const employee = await employeeModel.findOne({username: username });
 
 if (!employee) {
     return res.status(404).json({ message: 'Employee not found' });
 }
 bcrypt.compare(currentPassword, employee.password, (err, isMatch) => {
  if (err) return res.status(err).json({ message:"Server error"});
  if (isMatch) {
    const saltRounds = 10;
    bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
      if (err) return res.status(err).json({ message: "Server error" });
      employee.password = hashedPassword;
      employee.save().then(() => {
        res.json({ message: "Password changed successfully" });
      });
    });
  }
  else{
    res.json({ message: "Incorrect current password" });
  }
}
)})


  module.exports = router;