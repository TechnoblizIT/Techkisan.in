const express = require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const adminModel=require('../models/admin-model');
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
   
module.exports = router