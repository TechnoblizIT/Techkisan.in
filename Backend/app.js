const express =require('express');

const app = express();
const cors = require('cors');
const path=require('path');
const cookieParser=require('cookie-parser');
const expressSession = require('express-session');
const db=require('./configs/mongoose-connection')
const indexRoute=require("./routes/indexRoute")
const employeesRoute=require("./routes/employeeRoute")
const adminRoute=require("./routes/adminRoutes")
const managerRoute=require("./routes/managerRoutes")
const cron = require('node-cron');
const employeeModel=require("./models/employee-model")
require('dotenv').config()
app.use(cookieParser())
app.use(cors({
  origin:[`${process.env.FRONTEND_URI}`], 
  methods: ['POST','GET','DELETE'],
  credentials: true,               
}));
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,

}))
app.use(express.static(path.join(__dirname,"public")));

app.use("/",indexRoute);
app.use("/employees",employeesRoute);
app.use("/admin",adminRoute);
app.use("/manager",managerRoute);



cron.schedule('59 23 * * *', async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const employees = await employeeModel.find();

    for (const employee of employees) {
      const punchedInToday = employee.punchRecords.some(
        punch => new Date(punch).setHours(0, 0, 0, 0) === today.getTime()
      );

      if (!punchedInToday) {
        if (employee.punchRecords.status !== 'CL'|| employee.punchRecords.status !== 'SL' || employee.punchRecords.status !== 'H')
        employee.attendance.push({ date: today, status: 'A' });
      } else {
        employee.attendance.push({ date: today, status: 'P' });
      }

      await employee.save();
    }

    console.log('Attendance updated for all employees');
  } catch (error) {
    console.error('Error updating attendance:', error);
  }
});



app.listen(8000);