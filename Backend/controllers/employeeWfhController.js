const wfhModel=require("../models/work-from-home-model")
const employeeModel=require("../models/employee-model")
const jwt=require("jsonwebtoken")
module.exports.addWfh=async(req,res)=>{
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
    
        const wfhRecord = new wfhModel({
            ...req.body,
            startDate:req.body.startDate1,
            endDate:req.body.endDate1,
            employeeId:employee._id
        
        });
        await wfhRecord.save();
        res.status(201).send('Record saved successfully');
      } catch (error) {
        console.error('Error saving record:', error);
        res.status(500).send('Internal Server Error');
      }
}