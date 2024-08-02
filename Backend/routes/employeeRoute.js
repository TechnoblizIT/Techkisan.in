const express = require('express');
const router=express.Router();
const {loginUser}=require("../controllers/employeeAuthController")
const employeeModel=require("../models/employee-model")
const bcrypt=require("bcrypt")
router.post('/login',loginUser)
router.post('/create', async(req, res) => {
 try{ bcrypt.genSalt("test123", async function (err, salt) {
  const hashedPassword = await bcrypt.hash("test123", 10);
   const newemployee = new employeeModel({
    Name: "Test Employee",
    Email: "test@example.com",
    Password: hashedPassword
   })
   await newemployee.save()
   console.log(newemployee)
  res.send("Successfully created employee")
  })}catch(err){ console.log(err) }
  });


  module.exports = router;