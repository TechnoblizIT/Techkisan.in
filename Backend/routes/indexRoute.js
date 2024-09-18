const express = require('express')
const router=express.Router()
const managerModel=require("../models/manager-model")
const employeeModel=require('../models/employee-model')
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
module.exports = router