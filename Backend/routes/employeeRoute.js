const express = require('express');
const router=express.Router();
const {loginUser , logoutUser}=require("../controllers/employeeAuthController")
const{createEmployee}=require("../controllers/employeeCreationController")
const employeeModel=require("../models/employee-model")
const leaveModel=require("../models/leave-model")
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
    const empleaves = await leaveModel.find({ employeeId: employee._id });
    res.json({ employee: employee, empimg:employeeImages ,empleaves:empleaves});
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



router.post("/punchIn",async function(req, res){
  try {
    console.log("Punch In")
    const { punchInTime } = req.body;
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
    // Find the employee and update punch-in time
  employee.punchRecords.push({
    date: new Date(),
    punchInTime: punchInTime,
    punchOutTime: null,
    workDuration: null,
  });
 console.log(employee.punchRecords);
  await employee.save();

  res.status(200).send('Punch-in time recorded successfully.');

  
  } catch (error) {
    res.status(500).send('Error recording punch-in time');
  }
})

router.post('/punchOut' , async function(req, res) {
 
  try{
    console.log("Punch Out")
    const { punchOutTime } = req.body;
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
  const punchRecord = employee.punchRecords.pop();
  punchRecord.punchOutTime = punchOutTime;
  const workDuration = (punchRecord.punchOutTime - punchRecord.punchInTime)/ (1000 * 60 * 60); ;
  punchRecord.workDuration = workDuration;
  employee.punchRecords.push(punchRecord);
  
  await employee.save();

  res.status(200).json({ message: 'Punched out successfully', punchRecord });


}catch (e) {
  res.status(500).json({ error: error.message });
}
  
})


router.post("/addLeave", async function(req, res){
  const {leaveType,fromDate,toDate,fromTime,toTime,reason,leaveStation,vacationAddress,contactNumber}=req.body
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

const leave = new leaveModel({
  typeofLeaves: leaveType,
  fromDate: fromDate,
  toDate: toDate,
  employeeId: employee._id,
  fromTime: fromTime,
  toTime: toTime,
  reason: reason,
  vocationalAddress: leaveStation,
  contactno: contactNumber
})

await leave.save();

const leaveid=await leaveModel.findOne({employeeId: employee._id});

employee.leaves.push(leaveid._id);
res.json({ message: "Leave request sent successfully", leave });

})

router.get('/deleteLeaves/:leaveId', async (req, res) => {
  try {
    const { leaveId } = req.params;
    await leaveModel.findByIdAndDelete(leaveId);
    res.status(200).json({ message: 'Leave successfully canceled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error canceling leave' });
  }
});


  module.exports = router;