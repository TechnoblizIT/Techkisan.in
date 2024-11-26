const express = require('express')
const router=express.Router()
const managerModel=require("../models/manager-model")
const employeeModel=require('../models/employee-model')
const internModel=require("../models/intern-model")
const empimageModel=require("../models/employeeimg-model")
const jwt =require("jsonwebtoken")
const messageModel = require('../models/message-model')
router.get('/', function(req, res){
    res.send('Hello, World!')
})

router.get("/assignments" , async function(req, res){
const employee=await employeeModel.findOne({username:"pradumankathade3ec2e4"})
const manager=await managerModel.findOne({username:"johndoea9465d"})
employee.manager=manager._id

manager.employees=employee._id
await manager.save()
await employee.save()
res.send("Assigned successfully")


})

router.get("/messages", async (req, res) => {
    try {
      const messages = await messageModel.find();
     
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });
  
module.exports = router