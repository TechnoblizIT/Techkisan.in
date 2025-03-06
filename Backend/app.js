require('dotenv').config()
const express =require('express');
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const cors = require('cors');
const path=require('path');
const cookieParser=require('cookie-parser');
const expressSession = require('express-session');
const db=require('./configs/mongoose-connection')
const messageModel=require("./models/message-model")
const indexRoute=require("./routes/indexRoute")
const employeesRoute=require("./routes/employeeRoute")
const adminRoute=require("./routes/adminRoutes")
const managerRoute=require("./routes/managerRoutes")
const internRoute=require("./routes/internRoutes")
const cron = require('node-cron');
const employeeModel=require("./models/employee-model")
app.use(cookieParser())
const origin = process.env.ORIGIN
? process.env.ORIGIN.split(",").map((origin) => origin.trim())
: "*";
app.use(
  cors({
    origin: origin || "*", 
    methods: ['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'], 
    credentials: true,  }
  )
);
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
app.use("/intern",internRoute);

const io = new Server(server, {
  cors: {   origin: origin || "*", 
    methods: ['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true,  }
});

io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle message events from client
  socket.on("sendMessage", async (messageData) => {
    const { senderId, receiverId,  text,file } = messageData;
    const fileData = file
    ? {
        data: Buffer.from(file.data, 'base64'), // Decode Base64 to Buffer
        contentType: file.contentType,
        name: file.name,
      }
    : null;

   
    const message = new messageModel({
      sender: senderId,
      recipient: receiverId,
      message: text,
      file: fileData,
      timestamp: new Date(),
      isRead: false,  
     });
    await message.save();
    console.log("Message saved to database");

    // Emit message to other connected clients
    io.emit("receiveMessage", message);
   
    
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
})
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



server.listen(8000, () => {
  console.log("Server running on port 8000");
});