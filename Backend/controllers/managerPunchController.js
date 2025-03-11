
const jwt=require("jsonwebtoken")
const managerModel=require("../models//manager-model")

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
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
      
      const manager = await managerModel.findOne({username:decoded.user}); 
      
      const alreadyPunchedIn = manager.punchRecords.some(
        punch => new Date(punch).setHours(0, 0, 0, 0) === today.getTime()
      );
      console.log(alreadyPunchedIn)
      if (alreadyPunchedIn) {
        return res.status(400).json({ message: 'Already punched in today' });
      }
  
      manager.punchRecords.push({
        date: new Date(),
        punchInTime: punchInTime,
        punchOutTime: null,
        workDuration: null,
        status:"P"
      });
     
      const attendanceToday = manager.attendance.find(
        record => new Date(record.date).setHours(0, 0, 0, 0) === today.getTime()
      );
  
      if (attendanceToday) {
        attendanceToday.status = 'P';
      } else {
        manager.attendance.push({ date: today, status: 'P' });
      }
  
    
     
      await manager.save();
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
          const manager = await managerModel.findOne({username:decoded.user});
          if (!manager) {
            return res.status(404).json({ message: 'Employee not found' });
          }
          const punchRecord = manager.punchRecords.pop();
          punchRecord.punchOutTime = punchOutTime;
          const workDuration = (punchRecord.punchOutTime - punchRecord.punchInTime)/ (1000 * 60 * 60); ;
          punchRecord.workDuration = workDuration;
          manager.punchRecords.push(punchRecord);
          
         
          await manager.save();
          
        
          res.status(200).json({ message: 'Punched out successfully', punchRecord });
        
        
        }catch (e) {
          res.status(500).json({ error: e.message });
        }
    }