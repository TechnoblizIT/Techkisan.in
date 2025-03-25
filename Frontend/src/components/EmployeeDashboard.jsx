import React,{useEffect, useState,useRef,useCallback} from 'react';
import NavigationBar from './NavigationBar';
import '../styles/EmployeeDashboard.css';
import axios from 'axios';
import cakeimg from '../assets/cake-img.png'
import profile from '../assets/P.jpg';
import image from '../assets/img-dashboard.jpg'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import APIEndpoints  from "./endPoints"
import io from "socket.io-client";
import { Buffer } from "buffer";

function EmployeeDashboard() {
  const tableRef = useRef(null);
  // for chat-area
  const [selectedChat, setSelectedChat] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  // ============================================================
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const Endpoints = new APIEndpoints();
  const socket = io(Endpoints.BASE_URL);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const [entryconut, setentryconut] = useState(10);
  
  
  const notificationSound = new Audio("/sounds/notificationChat.mp3"); // Sound file in 'public' folder
  const formatTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const calculateWorkDuration = (punchIn, punchOut) => {
    if (!punchIn || !punchOut) return "-";

    const inTime = new Date(punchIn);
    const outTime = new Date(punchOut);

    const diffMs = outTime - inTime; // Difference in milliseconds
    if (diffMs <= 0) return "0 hrs 0 mins"; // Prevent negative values

    const hours = Math.floor(diffMs / (1000 * 60 * 60)); // Convert to hours
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // Remaining minutes

    return `${hours} hrs ${minutes} mins`;
  };

  const calculateDays = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  let dateObj = new Date();

  let month = String(dateObj.getMonth() + 1).padStart(2, "0");

  let day = String(dateObj.getDate()).padStart(2, "0");

  let year = dateObj.getFullYear();
  let todayDate = day + "/" + month + "/" + year;
  const [employeedata, setemployeedata] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [leaves, setLeaves] = useState([]);

  const navigate = useNavigate();
  const [startDate, setstartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDate2, setstartDate2] = useState("");
  const [endDate2, setEndDate2] = useState("");
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);
  const [startDate1, setStartDate1] = useState("");
  const [endDate1, setEndDate1] = useState("");
  const [dayType, setDayType] = useState("");
  const [inTime, setInTime] = useState("");
  const [users, setUsers] = useState([]);
  const [outTime, setOutTime] = useState("");
  const [remark, setRemark] = useState("");
  const messagesEndRef = useRef(null);
  const [formData, setFormData] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    fromTime: "FULL DAY", // Default value
    toTime: "FULL DAY", // Default value
    reason: "",
    leaveStation: "No", // Default value
    vacationAddress: "",
    contactNumber: "",
  });

  const [punchRecord, setPunchRecord] = useState([]);

  const [activeSection, setActiveSection] = useState("home");

  const [activeRequestPage, setActiveRequestPage] = useState("leave");
  const [activeReportPage, setActiveReportPage] = useState("leave-balance");

  const handlePunchIn = async () => {
    const currentTime = new Date();
    setPunchInTime(currentTime);
    setIsPunchedIn(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        Endpoints.EMPLOYEE_PUNCH_IN,
        {
          punchInTime: currentTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error punching in:", error);
    }
  };

  const handlePunchOut = async () => {
    const currentTime = new Date();
    setPunchOutTime(currentTime);
    setIsPunchedIn(false);

    // Send punch-out time to backend
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        Endpoints.EMPLOYEE_PUNCH_OUT,
        {
          punchOutTime: currentTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error punching out:", error);
    }
  };

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(Endpoints.EMPLOYEE_GET_LEAVES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeaves(response.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const token = localStorage.getItem("token");

  const handleSubmitwfh = async (event) => {
    event.preventDefault();

    const formData = {
      startDate1,
      endDate1,
      dayType,
      inTime,
      outTime,
      remark,
    };

    try {
      const response = await axios.post(Endpoints.EMPLOYEE_WFH, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Form data saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(Endpoints.EMPLOYEE_ADD_LEAVE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        fetchLeaves();

        console.log("Leave request submitted successfully!");
      } else {
        console.error("Failed to submit leave request");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Handle form submission

  //cancel leave

  const handleCancelLeave = async (leaveId) => {
    try {
      console.log("Leave request cancelled", leaveId);
      const response = await axios.get(
        `${Endpoints.EMPLOYEE_DEL_LEAVE}/${leaveId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setLeaves((prevLeaves) =>
          prevLeaves.filter((leave) => leave._id !== leaveId)
        );
        console.log("Leave successfully canceled");
      } else {
        console.error("Failed to cancel leave");
      }
    } catch (error) {
      console.error("Error canceling leave:", error);
    }
  };

  const handleStartDateChange = (event) => {
    setstartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleStartDateChange2 = (event) => {
    setstartDate2(event.target.value);
  };

  const handleEndDateChange2 = (event) => {
    setEndDate2(event.target.value);
  };
  const filteredRecords = punchRecord
    .filter((record) => {
      const recordDate = new Date(record.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return recordDate >= start && recordDate <= end;
      } else if (start) {
        return recordDate >= start;
      } else if (end) {
        return recordDate <= end;
      } else {
        return true;
      }
    })
    .slice()
    .reverse();

  //filtering the leaves

  const filteredLeave = leaves
    .filter((leave) => {
      const recordDate2 = new Date(leave.fromDate);
      const start2 = startDate2 ? new Date(startDate2) : null;
      const end2 = endDate2 ? new Date(endDate2) : null;
      if (start2 && end2) {
        return recordDate2 >= start2 && recordDate2 <= end2;
      } else if (start2) {
        return recordDate2 >= start2;
      } else if (end2) {
        return recordDate2 <= end2;
      } else {
        return true;
      }
    })
    .slice(-entryconut)
    .reverse();

  //   function getCookie(name) {
  //     const value = `; ${document.cookie}`;
  //     const parts = value.split(`; ${name}=`);
  //     if (parts.length === 2) return parts.pop().split(';').shift();
  // }
  const convertImageToBase64 = (imageData, imageType) => {
    if (!imageData) return null; // Handle missing images
    const binaryString = new Uint8Array(imageData).reduce(
      (acc, byte) => acc + String.fromCharCode(byte),
      ""
    );
    const base64String = btoa(binaryString);
    return `data:${imageType};base64,${base64String}`;
  };
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("userOnline", employeedata?._id);
  }, [employeedata]);

  // ✅ Fetch data as early as possible
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const decode = jwtDecode(token);
        if (decode.role !== "employee") {
          navigate("/");
          return;
        }

        // Fetch all required data in parallel
        const [employeeResponse, usersResponse, messagesResponse] = await Promise.all([
          axios.get(Endpoints.EMPLOYEE_DASHBOARD, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
          axios.get(Endpoints.GET_USERS_EMPLOYEES, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
          fetch(Endpoints.GET_MESSAGES).then((res) => res.json()),
        ]);

        if (employeeResponse.status === 200) {
          const empdata = employeeResponse.data;
          setAttendance(empdata.employee.attendance);
          setemployeedata(empdata.employee);
          setLeaves(empdata.empleaves);
          setPunchRecord(empdata.employee.punchRecords);
          if (empdata.empimg && empdata.empimg[0]) {
            const binaryString = new Uint8Array(
              empdata.empimg[0].Image.data
            ).reduce((acc, byte) => acc + String.fromCharCode(byte), "");

            const base64String = btoa(binaryString);
            setAvatarUrl(
              `data:${empdata.empimg[0].Imagetype};base64,${base64String}`
            );
          }

          if (empdata?.employee?._id) {
            socket.emit("userOnline", empdata.employee._id); // Ensure user is marked online
          }
        }

        setMessages(messagesResponse);

        const allUsers = [
          ...usersResponse.data.filteredEmployees,
          ...usersResponse.data.managers,
          ...usersResponse.data.interns,
        ];

        const usersWithImageUrls = allUsers.map((user) => ({
          ...user,
          imageUrl: user.Image && user.Image[0]
            ? convertImageToBase64(user.Image[0].Image.data, user.Image[0].Imagetype)
            : "loading",
        }));

        setUsers(usersWithImageUrls);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ Optimize socket event listeners
  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
     
      notificationSound.currentTime = 0; // Reset playback position for instant play
      notificationSound.play().catch(error => console.error("Sound play error:", error))

    };

    const handleUpdateUserStatus = (users) => {
      setOnlineUsers(users);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("updateUserStatus", handleUpdateUserStatus);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("updateUserStatus", handleUpdateUserStatus);
    };
  }, []);

  // ✅ Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  // ✅ Optimized sendMessage function
  const sendMessage = useCallback(() => {
    if (!input && !file) return;

    const messageData = {
      senderId: employeedata._id,
      receiverId: selectedChat._id,
      text: input,
      file: null,
    };

    setMessages((prevMessages) => [...prevMessages, { ...messageData, temp: true }]);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        messageData.file = {
          data: reader.result.split(",")[1],
          contentType: file.type,
          name: file.name,
        };

        socket.emit("sendMessage", messageData);
        setFile(null);
      };
      reader.readAsDataURL(file);
    } else {
      socket.emit("sendMessage", messageData);
    }

    setInput("");
  }, [input, file, employeedata, selectedChat]);

  
  //filtering out the most recent messages
  const userMessages = messages.filter(
    (message) =>
      message.sender === employeedata._id &&
      message.recipient === selectedChat._id
  );
  userMessages.reverse();
  const mostRecentMessage = userMessages.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )[0]; // Get the latest message

  const joiningDate = new Date(employeedata.dateOfHire);
  const currentDate = new Date();

  const diffInTime = currentDate - joiningDate;

  let diffInYears = currentDate.getFullYear() - joiningDate.getFullYear();
  let diffInMonths = currentDate.getMonth() - joiningDate.getMonth();
  let diffInDays = currentDate.getDate() - joiningDate.getDate();

  if (diffInDays < 0) {
    diffInMonths--;
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate();
    diffInDays += prevMonth;
  }

  if (diffInMonths < 0) {
    diffInYears--;
    diffInMonths += 12;
  }

  const generateAttendanceMap = () => {
    let attendanceMap = {};
    attendance.forEach((record) => {
      const date = new Date(record.date);
      const month = date.toLocaleString("default", { month: "long" });
      const day = date.getDate();

      if (!attendanceMap[month]) {
        attendanceMap[month] = Array(31).fill("");
      }

      attendanceMap[month][day - 1] = record.status;
    });

    return attendanceMap;
  };

  const attendanceMap = generateAttendanceMap();
  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="dashboard-container">
            <div className="left-side">
              <div className="profile-section">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="profile-image"
                  />
                ) : (
                  <p>Loading....</p>
                )}
                <h2 className="employee-name">
                  {employeedata
                    ? employeedata.firstName + employeedata.lastName
                    : "Loading..."}
                </h2>
                <p className="employee-role">
                  {employeedata ? employeedata.jobTitle : "Loading"}
                </p>
                <div className="work-duration">
                  <p>
                    {" "}
                    At work for: {diffInYears} year{diffInYears !== 1 && "s"}{" "}
                    {diffInMonths} month{diffInMonths !== 1 && "s"} {diffInDays}{" "}
                    day{diffInDays !== 1 && "s"}
                  </p>
                </div>
                <div className="button-section">
                  <button
                    className="punch-button"
                    onClick={handlePunchIn}
                    disabled={isPunchedIn}
                  >
                    Punch In
                  </button>
                  <button
                    className="punch-button"
                    onClick={handlePunchOut}
                    disabled={!isPunchedIn}
                  >
                    Punch Out
                  </button>
                  {punchInTime && (
                    <p>Punched In At: {punchInTime.toLocaleTimeString()}</p>
                  )}
                  {punchOutTime && (
                    <p>Punched Out At: {punchOutTime.toLocaleTimeString()}</p>
                  )}
                </div>

                <hr />
                <div className="attendance-leaves-awards">
                  <div className="attendance-column">
                    <p className="number">0/28</p>
                    <p className="label">Attendance</p>
                  </div>
                  <div className="leaves-column">
                    <p className="number">0/440</p>
                    <p className="label">Leaves</p>
                  </div>
                  <div className="awards-column">
                    <p className="number">0</p>
                    <p className="label">Awards</p>
                  </div>
                </div>
                <div className="birthdays-section">
                  <p>
                    <span>
                      <img className="cake-img" src={cakeimg} alt="" />
                    </span>{" "}
                    &nbsp; Birthdays
                  </p>
                  <div className="birthday-person">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Birthday Person"
                        className="birthday-image"
                      />
                    ) : (
                      <p>Loading Image...</p>
                    )}
                    <p>
                      <strong>
                        {employeedata
                          ? employeedata.firstName + " " + employeedata.lastName
                          : "Loading..."}
                      </strong>{" "}
                      has a birthday on{" "}
                      {employeedata
                        ? new Date(employeedata.dob).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            }
                          )
                        : "Loading..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="right-side">
              <div className="details-container">
                <div className="personal-company-details">
                  <div className="personal-details">
                    <div className="details">
                      <h3>
                        <i className="fa-solid fa-pen"></i> &nbsp;Personal
                        Details
                      </h3>
                    </div>
                    <p>
                      Name:
                      {employeedata
                        ? employeedata.firstName + " " + employeedata.lastName
                        : "Loading..."}
                    </p>
                    <hr />
                    <p>
                      Father's Name:
                      {employeedata ? employeedata.fatherName : "Loading..."}
                    </p>
                    <hr />
                    <p>
                      Date of Birth:{" "}
                      {employeedata
                        ? new Date(employeedata.dob).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            }
                          )
                        : "Loading..."}
                    </p>
                    <hr />
                    <p>
                      Gender:{" "}
                      {employeedata ? employeedata.gender : "Loading..."}
                    </p>
                    <hr />
                    <p>
                      Email:{employeedata ? employeedata.email : "Loading..."}
                    </p>
                    <hr />
                    <p>
                      Phone:{employeedata ? employeedata.mobile : "Loading..."}{" "}
                    </p>
                    <hr />
                    <p>Local Address: xyz</p>
                    <hr />
                    <p>Permanent Address: XYZ</p>
                  </div>
                  <div className="company-details">
                    <div className="details">
                      <h3>
                        <i className="fa-solid fa-briefcase"></i>&nbsp; Company
                        Details
                      </h3>
                    </div>
                    <p>
                      Employee ID:{" "}
                      {employeedata ? employeedata.employeeId : "Loading..."}
                    </p>
                    <hr></hr>
                    <p>
                      Department:{" "}
                      {employeedata ? employeedata.department : "Loading..."}
                    </p>
                    <hr></hr>
                    <p>
                      Designation:{" "}
                      {employeedata ? employeedata.jobTitle : "Loading"}
                    </p>
                  </div>
                </div>
                <div className="notice-board-upcoming-holidays">
                  <div className="notice-board">
                    <div className="details">
                      <h3>
                        <i className="fa-solid fa-bullhorn"></i>&nbsp; Notice
                        Board
                      </h3>
                    </div>
                    <div className="notice-space">
                      <p>
                        Office will be closed on the upcoming national holiday.
                        Enjoy your day off!
                      </p>
                      <p>
                        Monthly team meeting scheduled for tomorrow at 10 AM.
                        Please be on time.
                      </p>
                      <p>
                        Reminder: Annual office holiday party is scheduled for
                        this Friday. Don't miss it!
                      </p>
                      <p>
                        Important: Please submit your vacation requests before
                        the end of the week.
                      </p>
                      <p>
                        Office closed for maintenance on Saturday. Apologies for
                        any inconvenience.
                      </p>
                      <p>
                        Urgent: Team meeting on Monday to discuss upcoming
                        projects. Make sure you're prepared!
                      </p>
                    </div>
                  </div>
                  <div className="overall-ticket">
                    <div className="details">
                      <h3>
                        <i class="fa-solid fa-circle-info"></i>&nbsp; Help Desk
                        Status
                      </h3>
                    </div>
                    <div className="tickets">
                      <p>
                        <i class="fa-solid fa-people-group"></i>&nbsp; Total
                        Ticket Raised
                      </p>
                      <p className="ticket-raised">7</p>
                    </div>
                    <div className="tickets">
                      <p>
                        <i class="fa-solid fa-phone-flip"></i>&nbsp; Open
                        Tickets
                      </p>
                      <p className="open-ticket">0</p>
                    </div>
                    <div className="tickets">
                      <p>
                        <i class="fa-solid fa-ticket"></i>&nbsp; Closed Tickets
                      </p>
                      <p className="close-ticket">7</p>
                    </div>
                  </div>
                  <div className="upcoming-holidays">
                    <div className="details">
                      <h3>
                        <i className="fa-solid fa-paper-plane"></i>&nbsp;
                        Upcoming Holidays
                      </h3>
                    </div>
                    <div className="holiday">
                      <p>Office Off</p>
                      <p>01/01/2024</p>
                    </div>
                    <div className="holiday">
                      <p>Office Off</p>
                      <p>15/08/2024</p>
                    </div>
                    <div className="holiday">
                      <p>Office Off</p>
                      <p>25/12/2024</p>
                    </div>
                    <div className="holiday">
                      <p>Office Off</p>
                      <p>01/05/2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "request":
        return (
          <div className="request-section">
            <nav className="request-nav">
              <button
                onClick={() => setActiveRequestPage("leave")}
                className={activeRequestPage === "leave" ? "active" : ""}
              >
                Leave
              </button>
              <button
                onClick={() =>
                  setActiveRequestPage("attendance-regularization")
                }
                className={
                  activeRequestPage === "attendance-regularization"
                    ? "active"
                    : ""
                }
              >
                Attendance Regularization
              </button>
              <button
                onClick={() => setActiveRequestPage("on-duty")}
                className={activeRequestPage === "on-duty" ? "active" : ""}
              >
                On Duty/Work From Home
              </button>
              <button
                onClick={() => setActiveRequestPage("permission")}
                className={activeRequestPage === "permission" ? "active" : ""}
              >
                Permission
              </button>
            </nav>

            <div className="request-content">
              {activeRequestPage === "leave" && (
                <>
                  <div className="content-wrapper">
                    <div className="left-block">
                      <div className="date-section">
                        <h4>Date:</h4>
                        <p>{todayDate ? todayDate : "Loading.."}</p>
                      </div>
                      <div className="leave-contact-section">
                        <h4>1st leave contact:</h4>
                        <p>
                          {employeedata
                            ? employeedata.manager.firstName +
                              " " +
                              employeedata.manager.lastName
                            : "loading....."}
                        </p>
                      </div>
                      <div className="joining-date-section">
                        <h4>Date of Joining:</h4>
                        <p>
                          {employeedata
                            ? new Date(
                                employeedata.dateOfHire
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                              })
                            : "loading.."}
                        </p>
                      </div>
                    </div>
                    <div className="right-block">
                      <form className="leave-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Type of leave:</label>
                            <select
                              name="leaveType"
                              value={formData.leaveType}
                              onChange={handleChange}
                            >
                              <option value="">-Select-</option>
                              <option value="Sick Leave">Sick Leave</option>
                              <option value="Casual Leave">Casual Leave</option>
                              <option value="Earned Leave">Earned Leave</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>From Date:</label>
                            <input
                              type="date"
                              name="fromDate"
                              value={formData.fromDate}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-group">
                            <label>To Date:</label>
                            <input
                              type="date"
                              name="toDate"
                              value={formData.toDate}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <select
                              name="fromTime"
                              value={formData.fromTime}
                              onChange={handleChange}
                            >
                              <option value="FULL DAY">FULL DAY</option>
                              <option value="HALF DAY">HALF DAY</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <select
                              name="toTime"
                              value={formData.toTime}
                              onChange={handleChange}
                            >
                              <option value="FULL DAY">FULL DAY</option>
                              <option value="HALF DAY">HALF DAY</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Reason:</label>
                            <input
                              type="text"
                              name="reason"
                              value={formData.reason}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-group">
                            <label>Leave Station:</label>
                            <select
                              name="leaveStation"
                              value={formData.leaveStation}
                              onChange={handleChange}
                            >
                              <option value="No">No</option>
                              <option value="Out of Town">Out of Town</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Vacation Address:</label>
                            <input
                              type="text"
                              name="vacationAddress"
                              value={formData.vacationAddress}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-group">
                            <label>Contact Number:</label>
                            <input
                              type="text"
                              name="contactNumber"
                              value={formData.contactNumber}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <input className="add" type="submit" value="Add" />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="previous-leaves-table">
                    <h4>Previous Leaves</h4>
                    <div className="div-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Status</th>
                            <th>From Date</th>
                            <th>Half/Full Day</th>
                            <th>To Date</th>
                            <th>Half/Full Day</th>
                            <th>No. of Days</th>
                            <th>Leave Type</th>
                            <th>Attachment</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaves.length > 0 ? (
                            leaves.slice(-3).map((leave) => {
                              return (
                                <tr key={leave.id}>
                                  <td>{leave.leaveStatus}</td>
                                  <td>
                                    {leave.fromDate
                                      ? new Date(
                                          leave.fromDate
                                        ).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "2-digit",
                                        })
                                      : "no leave "}
                                  </td>
                                  <td>{leave.fromTime}</td>
                                  <td>
                                    {leave.toDate
                                      ? new Date(
                                          leave.toDate
                                        ).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "2-digit",
                                        })
                                      : "no leave "}
                                  </td>
                                  <td>{leave.toTime}</td>
                                  <td>
                                    {calculateDays(
                                      leave.fromDate,
                                      leave.toDate
                                    )}
                                  </td>
                                  <td>{leave.typeofLeaves}</td>
                                  <td>{leave.attachment}</td>
                                  <td>
                                    {leave.leaveStatus === "Pending" && (
                                      <button
                                        className="cancel"
                                        onClick={() =>
                                          handleCancelLeave(leave._id)
                                        }
                                      >
                                        Cancel
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="9">No Leaves are Present</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
              {activeRequestPage === "attendance-regularization" && (
                <>
                  <div className="attendance-regularization-section">
                    {/* Search Block */}
                    <div className="attendance-search-block">
                      <div className="search-inputs">
                        <input
                          type="date"
                          placeholder="Start Date"
                          value={startDate}
                          onChange={(event) => handleStartDateChange(event)}
                        />
                        <input
                          type="date"
                          placeholder="End Date"
                          value={endDate}
                          onChange={(event) => handleEndDateChange(event)}
                        />
                        <button className="search-button">Search</button>
                      </div>
                      <button className="search-button-bottom">
                        Search....
                      </button>
                    </div>

                    {/* Attendance Records Table */}
                    <div className="attendance-regularization-table-section">
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>In Date</th>
                            <th>In Time</th>
                            <th>Out Date</th>
                            <th>Out Time</th>
                            <th>Remarks</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRecords.slice(-entryconut).map((record) => (
                            <tr key={record._id}>
                              <td>{formatDate(record.date)}</td>
                              <td>{formatDate(record.punchInTime)}</td>
                              <td>{formatTime(record.punchInTime)}</td>
                              <td>{formatDate(record.punchOutTime)}</td>
                              <td>{formatTime(record.punchOutTime)}</td>
                              <td>{/* Add any remarks if needed */}</td>
                              <td>{/* Add status if needed */}</td>
                              <td>
                                <button className="update-button">
                                  Update
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="pagination">
                        <p>Showing 1 to 10 of 51 entries</p>
                        <div className="pagination-controls">
                          <span>Show</span>
                          <input
                            type="number"
                            min="0"
                            defaultValue="0"
                            value={entryconut}
                            onChange={(e) => {
                              setentryconut(e.target.value);
                            }}
                          />
                          <span>entries</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {activeRequestPage === "on-duty" && (
                // <div className="on-duty-container">
                //   <div className="form-block">
                //     <form onSubmit={handleSubmitwfh}>
                //       {/* Input fields */}
                //       <div className="input-row">
                //         <div className="input-group">
                //           <label htmlFor="start-date">Start Date</label>
                //           <input
                //             type="date"
                //             id="start-date"
                //             name="start-date"
                //             value={startDate1}
                //             onChange={(e) => setStartDate1(e.target.value)}
                //           />
                //         </div>
                //         <div className="input-group">
                //           <label htmlFor="end-date">End Date</label>
                //           <input
                //             type="date"
                //             id="end-date"
                //             name="end-date"
                //             value={endDate1}
                //             onChange={(e) => setEndDate1(e.target.value)}
                //           />
                //         </div>
                //       </div>

                //       <div className="input-row">
                //         <div className="input-group day-type-group">
                //           <label htmlFor="day-type">Day Type</label>
                //           <select
                //             id="day-type"
                //             name="day-type"
                //             value={dayType}
                //             onChange={(e) => setDayType(e.target.value)}
                //           >
                //             <option value="">--Select--</option>
                //             <option value="working">Working</option>
                //             <option value="holiday">Holiday</option>
                //             <option value="sick">Sick Leave</option>
                //             <option value="half-day">Half Day</option>
                //             <option value="other">Other</option>
                //           </select>
                //         </div>
                //       </div>

                //       <div className="input-row">
                //         <div className="input-group">
                //           <label htmlFor="in-time">In Time</label>
                //           <input
                //             type="time"
                //             id="in-time"
                //             name="in-time"
                //             value={inTime}
                //             onChange={(e) => setInTime(e.target.value)}
                //           />
                //         </div>
                //         <div className="input-group">
                //           <label htmlFor="out-time">Out Time</label>
                //           <input
                //             type="time"
                //             id="out-time"
                //             name="out-time"
                //             value={outTime}
                //             onChange={(e) => setOutTime(e.target.value)}
                //           />
                //         </div>
                //       </div>

                //       <div className="input-row">
                //         <div className="input-group">
                //           <label htmlFor="remark">Remark</label>
                //           <input
                //             type="text"
                //             id="remark"
                //             name="remark"
                //             value={remark}
                //             onChange={(e) => setRemark(e.target.value)}
                //           />
                //         </div>
                //       </div>

                //       <div className="input-row">
                //         <button type="submit" className="save-button">
                //           Save
                //         </button>
                //       </div>
                //     </form>
                //   </div>
                //   <div className="no-record-block">
                //     No previous record found for current month.
                //   </div>
                // </div>
                <p className="comming-soon-employee">Comming Soon.....</p>
              )}

              {activeRequestPage === "permission" && (
                <p className="comming-soon-employee">Comming Soon.....</p>
              )}
            </div>
          </div>
        );
      case "report":
        return (
          <div className="report-section">
            <nav className="report-nav">
              <button
                onClick={() => setActiveReportPage("leave-balance")}
                className={activeReportPage === "leave-balance" ? "active" : ""}
              >
                Leave Balance
              </button>
              <button
                onClick={() => setActiveReportPage("in-out-details")}
                className={
                  activeReportPage === "in-out-details" ? "active" : ""
                }
              >
                In-Out Details
              </button>
              <button
                onClick={() => setActiveReportPage("leave-details")}
                className={activeReportPage === "leave-details" ? "active" : ""}
              >
                Leave Details
              </button>
              <button
                onClick={() => setActiveReportPage("annual-attendance-summary")}
                className={
                  activeReportPage === "annual-attendance-summary"
                    ? "active"
                    : ""
                }
              >
                Annual Attendance Summary
              </button>
              <button
                onClick={() => setActiveReportPage("holidays")}
                className={activeReportPage === "holidays" ? "active" : ""}
              >
                Holidays
              </button>
              <button
                onClick={() => setActiveReportPage("on-duty")}
                className={activeReportPage === "on-duty" ? "active" : ""}
              >
                On Duty
              </button>
            </nav>

            <div className="report-content">
              {activeReportPage === "leave-balance" && (
                <div class="leave-balance-section">
                  <div class="search-container">
                    <input type="text" placeholder="Search..."></input>
                  </div>

                  <div class="leave-balance-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Leave Type</th>
                          <th>Opening</th>
                          <th>Credit</th>
                          <th>Debit</th>
                          <th>Used</th>
                          <th>Balance</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Casual Leave</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>
                            <button class="action-button">View Used</button>
                            <button class="action-button">View Debited</button>
                          </td>
                        </tr>
                        <tr>
                          <td>Emergency Leave</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>
                            <button class="action-button">View Used</button>
                            <button class="action-button">View Debited</button>
                          </td>
                        </tr>
                        <tr>
                          <td>LOSS OF PAY DAYS</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>
                            <button class="action-button">View Used</button>
                            <button class="action-button">View Debited</button>
                          </td>
                        </tr>
                        <tr>
                          <td>Paternity leave</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>
                            <button class="action-button">View Used</button>
                            <button class="action-button">View Debited</button>
                          </td>
                        </tr>
                        <tr>
                          <td>Sick leave</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>
                            <button class="action-button">View Used</button>
                            <button class="action-button">View Debited</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="leave-balance-pagination">
                    <p>Showing 1 to 5 of 5 entries</p>
                    <div className="leave-balance-pagination-controls">
                      <span>Show</span>
                      <input type="number" min="0" defaultValue="0" />
                      <span>entries</span>
                    </div>
                  </div>
                </div>
              )}
              {activeReportPage === "in-out-details" && (
                <div className="in-out-details-page">
                  <div className="report-filters">
                    <div className="filter-block">
                      <label htmlFor="report-type">Report Type</label>
                      <select id="report-type" name="report-type">
                        <option value="">Select Report Type</option>
                        <option value="daily">Daily Report</option>
                        <option value="weekly">Weekly Report</option>
                        <option value="monthly">Monthly Report</option>
                        <option value="yearly">Yearly Report</option>
                      </select>
                    </div>
                    <div className="filter-block">
                      <label htmlFor="from-date">From Date</label>
                      <input type="date" id="from-date" name="from-date" />
                    </div>
                    <div className="filter-block">
                      <label htmlFor="to-date">To Date</label>
                      <input type="date" id="to-date" name="to-date" />
                    </div>
                    <div className="button-block">
                      <button className="searchleave-button">Search</button>

                      <DownloadTableExcel
                        filename="in-out-table"
                        sheet="users"
                        currentTableRef={tableRef.current}
                      >
                        <button className="export-button">
                          Export to Excel
                        </button>
                      </DownloadTableExcel>
                    </div>
                  </div>
                  <div class="search-btn">
                    <input type="text" placeholder="Search..."></input>
                  </div>
                  <div className="table-container">
                    <div className="in-out-table-section">
                      <table className="in-out-details-table" ref={tableRef}>
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Entry Date</th>
                            <th>Location In</th>
                            <th>Location Out</th>
                            <th>In Time</th>
                            <th>Out Time</th>
                            <th>Total Working Hour</th>
                            <th>In Geolocation</th>
                            <th>Out Geolocation</th>
                            <th>Leave</th>
                            <th>Morning Late</th>
                            <th>Early</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRecords.slice(-entryconut).map((record) => (
                            <tr key={record._id}>
                              <td>{employeedata.employeeId}</td>
                              <td>
                                {employeedata.firstName +
                                  " " +
                                  employeedata.lastName}
                              </td>
                              <td>{formatDate(record.date)}</td>
                              <td>{record.locationIn || "-"}</td>
                              <td>{record.locationOut || "-"}</td>
                              <td>{formatTime(record.punchInTime)}</td>
                              <td>{formatTime(record.punchOutTime)}</td>
                              <td>
                                {calculateWorkDuration(
                                  record.punchInTime,
                                  record.punchOutTime
                                )}
                              </td>
                              <td>{record.inGeolocation || "-"}</td>
                              <td>{record.outGeolocation || "-"}</td>
                              <td>{record.leave || "-"}</td>
                              <td>{record.morningLate ? "Yes" : "No"}</td>
                              <td>{record.early ? "Yes" : "No"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="inout-pagination">
                      <p>Showing 1 to 5 of 5 entries</p>
                      <div className="inout-pagination-controls">
                        <span>Show</span>
                        <input
                          type="number"
                          min="0"
                          defaultValue="0"
                          value={entryconut}
                          onChange={(e) => setentryconut(e.target.value)}
                        />
                        <span>entries</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeReportPage === "leave-details" && (
                <div className="leave-details-page">
                  <div className="leave-details-filters">
                    <div className="leave-details-block">
                      <label htmlFor="leave-status">Leave status</label>
                      <select id="leave-status" name="leave-status">
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="leave-details-block">
                      <label htmlFor="leave-type">Leave type</label>
                      <select id="leave-type" name="leave-type">
                        <option value="">All</option>
                        <option value="casual">Casual Leave</option>
                        <option value="sick">Sick Leave</option>
                        <option value="earned">Earned Leave</option>
                        <option value="maternity">Maternity Leave</option>
                        <option value="paternity">Paternity Leave</option>
                        <option value="unpaid">Unpaid Leave</option>
                      </select>
                    </div>
                    <div className="leave-details-block">
                      <label htmlFor="from-date">From Date</label>
                      <input
                        type="date"
                        id="from-date"
                        name="from-date"
                        value={startDate2}
                        onChange={(e) => {
                          handleStartDateChange2(e);
                        }}
                      />
                    </div>
                    <div className="leave-details-block">
                      <label htmlFor="to-date">To Date</label>
                      <input
                        type="date"
                        id="to-date"
                        name="to-date"
                        value={endDate2}
                        onChange={(e) => {
                          handleEndDateChange2(e);
                        }}
                      />
                    </div>
                    <div className="button-block">
                      <button className="searchleave-button">Search</button>
                      <button className="download-button">Download</button>
                    </div>
                  </div>
                  <div className="table-block">
                    <table className="leave-details-table">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>From Date</th>
                          <th>Half/Full Day</th>
                          <th>To Date</th>
                          <th>Half/Full Day</th>
                          <th>No. of Days</th>
                          <th>Leave Type</th>
                          <th>Attachment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeave.length > 0 ? (
                          filteredLeave.map((leave) => (
                            <tr key={leave._id}>
                              <td>
                                <button
                                  className={`status-button ${leave.leaveStatus.toLowerCase()}`}
                                >
                                  {leave.leaveStatus}
                                </button>
                              </td>
                              <td>
                                {new Date(leave.fromDate).toLocaleDateString(
                                  "en-GB"
                                )}
                              </td>
                              <td>{leave.fromTime}</td>
                              <td>
                                {new Date(leave.toDate).toLocaleDateString(
                                  "en-GB"
                                )}
                              </td>
                              <td>{leave.toTime}</td>
                              <td>
                                {calculateDays(leave.fromDate, leave.toDate)}
                              </td>
                              <td>{leave.typeofLeaves}</td>
                              <td>{leave.attachment}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9">No Leaves are Present</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="leave-details-pagination">
                    <p>Showing 1 to 3 of 3 entries</p>
                    <div className="leave-details-pagination-controls">
                      <span>Show</span>
                      <input
                        type="number"
                        value={entryconut}
                        onChange={(e) => {
                          setentryconut(e.target.value);
                        }}
                      />
                      <span>entries</span>
                    </div>
                  </div>
                </div>
              )}
              {activeReportPage === "annual-attendance-summary" && (
                <div className="annual-attendance-summary">
                  <div className="first-block">
                    <label htmlFor="year-select">Select Year: </label>
                    <select id="year-select" name="year-select">
                      <option value="2024">01/01/2024 - 31/12/2024</option>
                      <option value="2025">01/01/2025 - 31/12/2025</option>
                      <option value="2026">01/01/2026 - 31/12/2026</option>
                      <option value="2027">01/01/2027 - 31/12/2027</option>
                      <option value="2028">01/01/2028 - 31/12/2028</option>
                      <option value="2029">01/01/2029 - 31/12/2029</option>
                      <option value="2030">01/01/2030 - 31/12/2030</option>
                    </select>
                    <button className="srch-button">Search</button>

                    <DownloadTableExcel
                      filename="attendance-table"
                      sheet="users"
                      currentTableRef={tableRef.current}
                    >
                      <button className="exprt-button">Export to Excel</button>
                    </DownloadTableExcel>
                  </div>

                  {/* Second Block: Attendance Table */}
                  <div className="second-block">
                    <table className="attendance-table" ref={tableRef}>
                      <thead>
                        <tr>
                          <th>Month</th>
                          {[...Array(31).keys()].map((day) => (
                            <th key={day}>{day + 1}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(attendanceMap).map((month) => (
                          <tr key={month}>
                            <td>{month}</td>
                            {attendanceMap[month].map((status, index) => (
                              <td key={index} className={status}>
                                {status || "-"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeReportPage === "holidays" && (
                <div className="holidays-page">
                  <div className="holidays-buttons">
                    <button
                      className="print-btn"
                      onClick={() => window.print()}
                    >
                      Print
                    </button>

                    <DownloadTableExcel
                      filename="holidays-table"
                      sheet="users"
                      currentTableRef={tableRef.current}
                    >
                      <button> Export excel </button>
                    </DownloadTableExcel>
                  </div>

                  <div className="holidays-table-section">
                    <table className="holidays-table" ref={tableRef}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Reason</th>
                          <th>Day</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            date: "January 1, 2025",
                            reason: "New Year's Day",
                            day: "Wednesday",
                          },
                          {
                            date: "January 26, 2025",
                            reason: "Republic Day",
                            day: "Sunday",
                          },
                          {
                            date: "February 19, 2025",
                            reason: "Chhatrapati Shivaji Maharaj Jayanti",
                            day: "Wednesday",
                          },
                          {
                            date: "February 26, 2025",
                            reason: "Maha Shivaratri",
                            day: "Wednesday",
                          },
                          {
                            date: "March 14, 2025",
                            reason: "Holi",
                            day: "Friday",
                          },
                          {
                            date: "March 30, 2025",
                            reason: "Gudi Padwa",
                            day: "Sunday",
                          },
                          {
                            date: "March 31, 2025",
                            reason: "Idul Fitr",
                            day: "Monday",
                          },
                          {
                            date: "April 6, 2025",
                            reason: "Ram Navami",
                            day: "Sunday",
                          },
                          {
                            date: "April 10, 2025",
                            reason: "Mahavir Jayanti",
                            day: "Thursday",
                          },
                          {
                            date: "April 14, 2025",
                            reason: "Dr. Babasaheb Ambedkar Jayanti",
                            day: "Monday",
                          },
                          {
                            date: "April 18, 2025",
                            reason: "Good Friday",
                            day: "Friday",
                          },
                          {
                            date: "May 1, 2025",
                            reason: "Maharashtra Day",
                            day: "Thursday",
                          },
                          {
                            date: "May 12, 2025",
                            reason: "Buddha Purnima",
                            day: "Monday",
                          },
                          {
                            date: "June 7, 2025",
                            reason: "Bakri Id (Id-Uz-Zuha)",
                            day: "Saturday",
                          },
                          {
                            date: "July 6, 2025",
                            reason: "Muharram",
                            day: "Sunday",
                          },
                          {
                            date: "August 15, 2025",
                            reason: "Independence Day / Parsi New Year",
                            day: "Friday",
                          },
                          {
                            date: "August 27, 2025",
                            reason: "Ganesh Chaturthi",
                            day: "Wednesday",
                          },
                          {
                            date: "September 5, 2025",
                            reason: "Id-E-Milad",
                            day: "Friday",
                          },
                          {
                            date: "October 2, 2025",
                            reason: "Mahatma Gandhi Jayanti / Dasara",
                            day: "Thursday",
                          },
                          {
                            date: "October 21, 2025",
                            reason: "Diwali Amavasya (Laxmi Pujan)",
                            day: "Tuesday",
                          },
                          {
                            date: "October 22, 2025",
                            reason: "Diwali (Bali Pratipada)",
                            day: "Wednesday",
                          },
                          {
                            date: "November 5, 2025",
                            reason: "Guru Nanak Jayanti",
                            day: "Wednesday",
                          },
                          {
                            date: "December 25, 2025",
                            reason: "Christmas",
                            day: "Thursday",
                          },
                        ].map((holiday, index) => (
                          <tr key={index}>
                            <td>{holiday.date}</td>
                            <td>{holiday.reason}</td>
                            <td>{holiday.day}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeReportPage === "on-duty" && (
                <p className="comming-soon-employee">Comming Soon.....</p>
              )}
            </div>
          </div>
        );

      // code for task box-------------------------------------------------------------------------------
      case "tasks":
        return <p className="comming-soon-employee">Comming Soon.....</p>;

      case "tickets":
        return <p className="comming-soon-employee">Comming Soon.....</p>;
      // code for chat box ======================================================================================
      case "chat":
        return (
          <div className="chat-app">
            {/* chat-sidebar */}
            <div className="chat-sidebar">
              <div className="chat-sidebar-icons">
                <div className="chat-sidebar-icon">
                  <i className="fa-regular fa-bell"></i>
                  <p>Activity</p>
                </div>
                <div className="chat-sidebar-icon">
                  <i className="fa-regular fa-message"></i>
                  <p>Chat</p>
                </div>
                <div className="chat-sidebar-icon">
                  <i className="fa-solid fa-people-group"></i>
                  <p>Teams</p>
                </div>
                <div className="chat-sidebar-icon">
                  <i className="fa-solid fa-calendar-days"></i>
                  <p>Calendar</p>
                </div>
                <div className="chat-sidebar-icon gear-icon">
                  <i className="fa-solid fa-gear"></i>
                  <p className="hidden">Setting</p>
                </div>
              </div>
              <div className="chat-sidebar-bottom">
                <img src={avatarUrl} alt="profile" className="profile-photo" />
              </div>
            </div>

            {/* chat-list */}
            <div className="chat-list">
              <div className="chat-list-header">
                <h1>Chat</h1>
                <div className="chat-icons">
                  <div
                    className="icon-container video-icon"
                    data-tooltip="Meet Now"
                  >
                    <i className="fa-solid fa-video"></i>
                  </div>
                  <div
                    className="icon-container add-icon"
                    data-tooltip="New Chat"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </div>
                </div>
              </div>
              <div className="chat-search-bar">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search..."
                />
              </div>
              <div className="chat-previews">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="chat-preview"
                    onClick={() => setSelectedChat(user)}
                  >
                    <img
                      src={user.imageUrl || profile}
                      alt="profile"
                      className="img-profile"
                    />
                    <div className="preview-details">
                      <div className="preview-header">
                        <span className="preview-name">
                          {user.firstName + " " + user.lastName}
                        </span>
                        <span
                          className={`online-indicator ${
                            onlineUsers.includes(user._id)
                              ? "online"
                              : "offline"
                          }`}
                        ></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* chat-area */}
            {selectedChat && (
              <div className="chat-area">
                <div className="chat-header">
                  <div className="chat-header-left">
                    {users
          .filter((user) => user.firstName+" "+user.lastName === selectedChat.firstName+" "+selectedChat.lastName)
          .map((user) => (
            <div key={user._id}>
              <img
                src={user.imageUrl} 
                alt="profile"
                className="profile-main"
              />
              <span className="chat-name">{user.firstName+" "+user.lastName}</span> 
              <span
                        className={`online-indicator ${onlineUsers.includes(user._id) ? "online" : "offline"}`}
                      ></span>
            </div>
          ))}

                    </div>
                    <div className="chat-header-icons">
                      <i className="fa-solid fa-video"></i>
                      <i className="fa-solid fa-phone"></i>
                      <i className="fa-solid fa-magnifying-glass"></i>
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </div>
                  </div>
        
                
                   {/* Messages Section */}
                   <div className="messages">
  {messages
    .filter(
      (message) =>
        (message.sender === employeedata._id && message.recipient === selectedChat._id) ||
        (message.sender === selectedChat._id && message.recipient === employeedata._id)
    )
    .map((message, index) => (
      <div
        key={index}
        className={message.sender === employeedata._id ? "message-right" : "message-left"}
      >
 {message.message && <p>{message.message}</p>}
{message.file && (
  <div>
    {message.file.contentType.startsWith("image/") ? (
      <img
        src={`data:${message.file.contentType};base64,${btoa(
          String.fromCharCode(...new Uint8Array(message.file.data.data))
        )}`}
        alt={message.file.name}
        style={{ maxWidth: "200px", maxHeight: "200px" }}
      />
    ) : (
<a
  href={`data:${message.file.contentType};base64,${btoa(
    String.fromCharCode(...new Uint8Array(message.file.data.data))
  )}`}
  download={message.file.name}
  className="download-btn"
>
  <i className="fa-solid fa-download"></i> {message.file.name}
</a>

    )}
  </div>
)}

      </div>
    ))}
  <div ref={messagesEndRef}></div> {/* Add this at the bottom */}
</div>

      default:
        return null;
    }
  };

  return (
    <div className="employee-dashboard">
      <NavigationBar
        activeSection={activeSection}
        onNavigate={setActiveSection}
      />
      {renderSection()}
    </div>
  );
}

export default EmployeeDashboard;
