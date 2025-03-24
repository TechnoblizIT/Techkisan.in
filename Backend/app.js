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
const managerModel=require("./models/manager-model")
const internModel=require("./models/intern-model")
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

const onlineUsers = new Map();

io.on("connection", (socket) => {
 

  socket.on("userOnline", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("updateUserStatus", Array.from(onlineUsers.keys())); // Send online users
  });

  socket.on("disconnect", () => {
    let disconnectedUserId;
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("updateUserStatus", Array.from(onlineUsers.keys())); // Update UI
   
  });

  // Handling message sending
  socket.on("sendMessage", async (messageData) => {
   console.log("message")
    const { senderId, receiverId, text, file } = messageData;
    const fileData = file
      ? {
          data: Buffer.from(file.data, "base64"), // Decode Base64 to Buffer
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

    io.emit("receiveMessage", message);
  });
});
cron.schedule('59 23 * * *', async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    // Function to update attendance
    const updateAttendance = async (users) => {
      for (const user of users) {
        const punchedInToday = user.punchRecords.some(punch => {
          const punchDate = new Date(punch);
          punchDate.setHours(0, 0, 0, 0);
          return punchDate.getTime() === today.getTime();
        });

        if (punchedInToday) {
          user.attendance.push({ date: today, status: 'P' });
        } else {
          if (!['CL', 'SL', 'H', 'P'].includes(user.status)) {
            user.attendance.push({ date: today, status: 'A' });
          }
        }

        await user.save();
      }
    };

    // Fetch all employees, managers, and interns
    const employees = await employeeModel.find();
    const managers = await managerModel.find();
    const interns = await internModel.find();

    // Update attendance for all
    await updateAttendance(employees);
    await updateAttendance(managers);
    await updateAttendance(interns);

    console.log('Attendance updated for all employees, managers, and interns.');
  } catch (error) {
    console.error('Error updating attendance:', error);
  }
});




server.listen(8000, () => {
  console.log("Server running on port 8000");
});