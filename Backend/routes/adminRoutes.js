const express = require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const adminModel=require('../models/admin-model');
const employeeModel=require('../models/employee-model');
const {loginUser}=require("../controllers/adminController")
router.post('/create', async(req, res) => {
    try{ bcrypt.genSalt("admin123", async function (err, salt) {
     const hashedPassword = await bcrypt.hash("admin123", 10);
      const newadmin = new adminModel({
       Name: "Test Admin",
       Email: "test@admin.com",
       Password: hashedPassword
      })
      await newadmin.save()
      console.log(newadmin)
     res.send("Successfully created Admin")
     })}catch(err){ console.log(err) }
     });

router.post("/login",loginUser)

router.get('/admindata',async function (req, res){
    try {
        const authHeader = req.headers.authorization;
        
        
       
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
    
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }
    
        const employee = await employeeModel.find()
        const employeeCount = await employeeModel.countDocuments()
        const admin = await adminModel.find()
        if (!employee) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!admin){
            return res.status(401).json({ message: 'Invalid credentials' });
        }
      
        res.status(200).json({
            success: true,
            employeeCount: employeeCount,
            employee: employee,})
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
    });
    
    


   
module.exports = router