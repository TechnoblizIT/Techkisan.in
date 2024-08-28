
const jwt=require("jsonwebtoken")
const employeeModel=require("../models/employee-model")

module.exports.punchIn=async(req,res)=>{
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
    }

    module.exports.punchOut=async(req,res)=>{
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
    }