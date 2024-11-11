const express = require('express')
const router=express.Router()
const managerModel=require("../models/manager-model")
const employeeModel=require('../models/employee-model')
const internModel=require("../models/intern-model")
const empimageModel=require("../models/employeeimg-model")
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

    const employees=await employeeModel.find({}).populate("Image")
    const managers=await managerModel.find({}).populate("Image")
    const interns=await internModel.find({}).populate("Image")
    res.json({employees,managers,interns})
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
})
module.exports = router