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
router.get("/messages", async (req, res) => {
    try {
      const messages = await messageModel.find(); 
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });
module.exports = router