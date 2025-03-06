import React, { useEffect, useState } from "react";
import NavigationBar from "./NavigationBar";
import "../styles/EmployeeDashboard.css";
import axios from "axios";
import cakeimg from "../assets/cake-img.png";
import profile from "../assets/P.jpg";
import image from "../assets/img-dashboard.jpg";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import APIEndpoints from "./endPoints";
import io from "socket.io-client";
import { Buffer } from "buffer";

function EmployeeDashboard() {
  // for my ticket area
  const [activeTab, setActiveTab] = useState("open");
  const [page, setPage] = useState("dashboard");

  // State for Add Form
  const [addFormData, setAddFormData] = useState({
    subject: "",
    priority: "",
    group: "",
    description: "",
    file: null,
    tags: "",
  });

  async function CreateTicket() {
    try {
      await axios.post("http://localhost:4000/createticket", {
        data: addFormData,
      });
    } catch (error) {
      console.log(error);
    }
  }

  // State for Filter Form
  const [filterData, setFilterData] = useState({
    ticketId: "",
    title: "",
    status: "",
    priority: "",
    tagname: "",
  });

  async function FilterTicket() {
    try {
      await axios.post("http://localhost:4000/createticket", {
        data: filterData,
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Add Form Change
  const handleAddFormChange = (e) => {
    const { name, value, type, files } = e.target;
    setAddFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterData((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const openTickets = [
    {
      ticketNo: "TCK001",
      title: "Login Issue",
      createdDate: "2024-02-27",
      status: "Closed",
      priority: "High",
      agentAssigned: "John Doe",
      action: "View",
    },
    {
      ticketNo: "TCK002",
      title: "Payment Failure",
      createdDate: "2024-02-26",
      status: "Closed",
      priority: "Medium",
      agentAssigned: "Jane Smith",
      action: "View",
    },
  ];

  const closedTickets = [
    {
      ticketNo: "TCK003",
      title: "Facing issue with Laptop ",
      createdDate: "2024-02-25",
      status: "Closed",
      priority: "Low",
      agentAssigned: "Mike Ross",
    },
    {
      ticketNo: "TCK004",
      title: "Refund Request",
      createdDate: "2024-02-24",
      status: "Closed",
      priority: "Medium",
      agentAssigned: "Rachel Zane",
    },
  ];

  // for chat-area
  const [selectedChat, setSelectedChat] = useState([]);
  // ============================================================
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

  const Endpoints = new APIEndpoints();
  const socket = io(Endpoints.BASE_URL);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  const [entryconut, setentryconut] = useState(10);
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

        // Fetch employee data and users concurrently
        const [employeeResponse, usersResponse] = await Promise.all([
          axios.get(Endpoints.EMPLOYEE_DASHBOARD, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }),
          axios.get(Endpoints.GET_USERS_EMPLOYEES, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }),
        ]);

        // Check if the employee data fetch is successful
        if (employeeResponse.status === 200) {
          const empdata = employeeResponse.data;
          setemployeedata(empdata.employee);
          setLeaves(empdata.empleaves);
          setPunchRecord(empdata.employee.punchRecords);

          if (empdata.empimg && empdata.empimg[0]) {
            const binaryString = new Uint8Array(
              empdata.empimg[0].Image.data
            ).reduce((acc, byte) => acc + String.fromCharCode(byte), "");

            const base64String = btoa(binaryString);
            const imageUrl = `data:${empdata.empimg[0].Imagetype};base64,${base64String}`;
            setAvatarUrl(imageUrl);
          }
        } else {
          console.error("Failed to fetch employee data");
        }

        // Handle fetching and processing users
        const allUsers = [
          ...usersResponse.data.filteredEmployees,
          ...usersResponse.data.managers,
          ...usersResponse.data.interns,
        ];

        const usersWithImageUrls = allUsers.map((user) => ({
          ...user,
          imageUrl:
            user.Image && user.Image[0]
              ? convertImageToBase64(
                  user.Image[0].Image.data,
                  user.Image[0].Imagetype
                )
              : "loading",
        }));

        setUsers(usersWithImageUrls);

        // Fetch messages after all user and employee data is ready
        const res = await fetch(Endpoints.GET_MESSAGES);
        const messagesData = await res.json();
        setMessages(messagesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    // Listen for new messages from the server using Socket.IO
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [navigate]);

  // for sending messages
  const sendMessage = () => {
    if (!input && !file) return;

    const messageData = {
      senderId: employeedata._id,
      receiverId: selectedChat._id,
      text: input,
      file: null,
    };
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        messageData.file = {
          data: reader.result.split(",")[1], // Extract Base64 data
          contentType: file.type, // MIME type
          name: file.name, // Original file name
        };

        // Emit the message with the file
        socket.emit("sendMessage", messageData);
        setInput("");
        setFile(null);
      };
      reader.readAsDataURL(file);
    } else {
      // Emit the message without a file
      socket.emit("sendMessage", messageData);
      setInput("");
    }
  };

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
                <div className="on-duty-container">
                  <div className="form-block">
                    <form onSubmit={handleSubmitwfh}>
                      {/* Input fields */}
                      <div className="input-row">
                        <div className="input-group">
                          <label htmlFor="start-date">Start Date</label>
                          <input
                            type="date"
                            id="start-date"
                            name="start-date"
                            value={startDate1}
                            onChange={(e) => setStartDate1(e.target.value)}
                          />
                        </div>
                        <div className="input-group">
                          <label htmlFor="end-date">End Date</label>
                          <input
                            type="date"
                            id="end-date"
                            name="end-date"
                            value={endDate1}
                            onChange={(e) => setEndDate1(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="input-row">
                        <div className="input-group day-type-group">
                          <label htmlFor="day-type">Day Type</label>
                          <select
                            id="day-type"
                            name="day-type"
                            value={dayType}
                            onChange={(e) => setDayType(e.target.value)}
                          >
                            <option value="">--Select--</option>
                            <option value="working">Working</option>
                            <option value="holiday">Holiday</option>
                            <option value="sick">Sick Leave</option>
                            <option value="half-day">Half Day</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="input-row">
                        <div className="input-group">
                          <label htmlFor="in-time">In Time</label>
                          <input
                            type="time"
                            id="in-time"
                            name="in-time"
                            value={inTime}
                            onChange={(e) => setInTime(e.target.value)}
                          />
                        </div>
                        <div className="input-group">
                          <label htmlFor="out-time">Out Time</label>
                          <input
                            type="time"
                            id="out-time"
                            name="out-time"
                            value={outTime}
                            onChange={(e) => setOutTime(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="input-row">
                        <div className="input-group">
                          <label htmlFor="remark">Remark</label>
                          <input
                            type="text"
                            id="remark"
                            name="remark"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="input-row">
                        <button type="submit" className="save-button">
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="no-record-block">
                    No previous record found for current month.
                  </div>
                </div>
              )}

              {activeRequestPage === "permission" && (
                <h1>This is the Permission Page</h1>
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
                          <td>2</td>
                          <td>8</td>
                          <td>0</td>
                          <td>3</td>
                          <td>7</td>
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
                          <td>2</td>
                          <td>8</td>
                          <td>0</td>
                          <td>3.5</td>
                          <td>0.5</td>
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
                      <button className="export-button">Export to Excel</button>
                    </div>
                  </div>
                  <div class="search-btn">
                    <input type="text" placeholder="Search..."></input>
                  </div>
                  <div className="table-container">
                    <div className="in-out-table-section">
                      <table className="in-out-details-table">
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
                              <td>-</td>
                              <td>-</td>
                              <td>{formatTime(record.punchInTime)}</td>
                              <td>{formatTime(record.punchOutTime)}</td>
                              <td>{record.workDuration * 10}</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
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
                    <button className="exprt-button">Export to Excel</button>
                  </div>

                  {/* Second Block: Attendance Table */}
                  <div className="second-block">
                    <table className="attendance-table">
                      <thead>
                        <tr>
                          <th>Month</th>
                          {[...Array(31).keys()].map((day) => (
                            <th key={day}>{day + 1}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>January</td>
                          <td className="H">H</td>
                          <td className="CL">CL</td>
                          <td className="CL">CL</td>
                          <td className="CL">CL</td>
                          <td className="CL">CL</td>
                          <td className="W">W</td>
                          <td className="W">W</td>
                          <td className="fh-sl-p">FH-SL/P</td>
                          <td className="P">P</td>
                          <td className="I">I</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="A">A</td>
                          <td className="A">A</td>
                          <td className="A">A</td>
                          <td className="A">A</td>
                          <td className="A">A</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="SL">SL</td>
                          <td className="SL">SL</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="W">W</td>
                        </tr>
                        <tr>
                          <td>February</td>
                          <td className="A">A</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="I">I</td>
                          <td className="W">W</td>
                          <td className="CL">CL</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="A">A</td>
                          <td className="A">A</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="W">W</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="H">H</td>
                          <td className="A">A</td>
                          <td className="SL">SL</td>
                          <td className="SL">SL</td>
                          <td className="P">P</td>
                          <td className="I">I</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="CL">CL</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="A">A</td>
                          <td className="P">P</td>
                          <td className="W">W</td>
                          <td className="P">P</td>
                          <td className="A">A</td>
                        </tr>
                        <tr>
                          <td>March</td>
                          <td className="P">P</td>
                          <td className="A">A</td>
                          <td className="P">P</td>
                          <td className="SL">SL</td>
                          <td className="CL">CL</td>
                          <td className="P">P</td>
                          <td className="I">I</td>
                          <td className="A">A</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="H">H</td>
                          <td className="W">W</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="CL">CL</td>
                          <td className="SL">SL</td>
                          <td className="W">W</td>
                          <td className="P">P</td>
                          <td className="A">A</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="I">I</td>
                          <td className="W">W</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="A">A</td>
                          <td className="P">P</td>
                          <td className="SL">SL</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                        </tr>
                        <tr>
                          <td>April</td>
                          <td className="W">W</td>
                          <td className="H">H</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="I">I</td>
                          <td className="A">A</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="CL">CL</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="SL">SL</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="A">A</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="H">H</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="W">W</td>
                          <td className="P">P</td>
                          <td className="CL">CL</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="A">A</td>
                          <td className="SL">SL</td>
                          <td className="P">P</td>
                        </tr>
                        <tr>
                          <td>May</td>
                          <td className="CL">CL</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="I">I</td>
                          <td className="W">W</td>
                          <td className="P">P</td>
                          <td className="H">H</td>
                          <td className="P">P</td>
                          <td className="A">A</td>
                          <td className="SL">SL</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="A">A</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="CL">CL</td>
                          <td className="W">W</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="H">H</td>
                          <td className="P">P</td>
                          <td className="SL">SL</td>
                          <td className="P">P</td>
                          <td className="A">A</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                          <td className="P">P</td>
                        </tr>
                        <tr>
                          <td>August</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>September</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>October</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>November</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>December</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeReportPage === "holidays" && (
                <div className="holidays-page">
                  <div className="holidays-buttons">
                    <button className="print-btn">Print</button>
                    <button className="excel-btn">Export to Excel</button>
                  </div>

                  <div className="holidays-table-section">
                    <table className="holidays-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Reason</th>
                          <th>Day</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1st January, 2024</td>
                          <td>New Year's Day</td>
                          <td>Monday</td>
                        </tr>
                        <tr>
                          <td>15th January, 2024</td>
                          <td>Makar Sankranti</td>
                          <td>Monday</td>
                        </tr>
                        <tr>
                          <td>26th January, 2024</td>
                          <td>Republic Day</td>
                          <td>Friday</td>
                        </tr>
                        <tr>
                          <td>8th March, 2024</td>
                          <td>Maha Shivratri</td>
                          <td>Friday</td>
                        </tr>
                        <tr>
                          <td>25th March, 2024</td>
                          <td>Holi</td>
                          <td>Monday</td>
                        </tr>
                        <tr>
                          <td>1st May, 2024</td>
                          <td>Maharashtra Day</td>
                          <td>Wednesday</td>
                        </tr>
                        <tr>
                          <td>15th August, 2024</td>
                          <td>Independence Day</td>
                          <td>Thursday</td>
                        </tr>
                        <tr>
                          <td>7th September, 2024</td>
                          <td>Ganesh Chaturthi</td>
                          <td>Saturday</td>
                        </tr>
                        <tr>
                          <td>16th September, 2024</td>
                          <td>Eid-e-Milad</td>
                          <td>Monday</td>
                        </tr>
                        <tr>
                          <td>2nd October, 2024</td>
                          <td>Gandhi Jayanti</td>
                          <td>Wednesday</td>
                        </tr>
                        <tr>
                          <td>12th October, 2024</td>
                          <td>Dussehra/Vijaya Dasami</td>
                          <td>Saturday</td>
                        </tr>
                        <tr>
                          <td>31st October, 2024</td>
                          <td>Diwali/Deepawali</td>
                          <td>Thursday</td>
                        </tr>
                        <tr>
                          <td>1st November, 2024</td>
                          <td>Diwali/Deepawali</td>
                          <td>Friday</td>
                        </tr>
                        <tr>
                          <td>25th December, 2024</td>
                          <td>Christmas</td>
                          <td>Wednesday</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeReportPage === "on-duty" && (
                <h1>This is the On Duty Page</h1>
              )}
            </div>
          </div>
        );
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
                    onClick={() => setSelectedChat(user)} // select chat on click
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
                        {/* <span className="preview-time">10:00 AM</span> Adjust as needed */}
                      </div>
                      {/* <p className="preview-message">{mostRecentMessage
              ? mostRecentMessage.message 
              : "Loading.."}</p> */}
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
                      .filter(
                        (user) =>
                          user.firstName + " " + user.lastName ===
                          selectedChat.firstName + " " + selectedChat.lastName
                      )
                      .map((user) => (
                        <div key={user._id}>
                          <img
                            src={user.imageUrl}
                            alt="profile"
                            className="profile-main"
                          />
                          <span className="chat-name">
                            {user.firstName + " " + user.lastName}
                          </span>
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
                        (message.sender === employeedata._id &&
                          message.recipient === selectedChat._id) ||
                        (message.sender === selectedChat._id &&
                          message.recipient === employeedata._id)
                    )
                    .map((message, index) => (
                      <div
                        key={index}
                        className={
                          message.sender === employeedata._id
                            ? "message-right"
                            : "message-left"
                        }
                      >
                        {message.message && <p>{message.message}</p>}
                        {message.file && (
                          <div>
                            {message.file.contentType.startsWith("image/") ? (
                              <img
                                src={`data:${
                                  message.file.contentType
                                };base64,${Buffer.from(
                                  message.file.data
                                ).toString("base64")}`}
                                alt={message.file.name}
                                style={{
                                  maxWidth: "200px",
                                  maxHeight: "200px",
                                }}
                              />
                            ) : (
                              <a
                                href={`data:${
                                  message.file.contentType
                                };base64,${Buffer.from(
                                  message.file.data
                                ).toString("base64")}`}
                                download={message.file.name}
                              >
                                Download {message.file.name}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {/* Message Input Box */}
                <div className="message-input">
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Type a new message"
                      value={file ? file.name : input}
                      onChange={(e) => setInput(e.target.value)}
                      readOnly={!!file}
                    />
                    {file && (
                      <button
                        type="button"
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          marginRight: "5%",
                        }}
                        onClick={() => setFile(null)} // Clear the file and preview
                      >
                        Remove
                      </button>
                    )}

                    <i className="fa-regular fa-face-smile emoji-icon"></i>
                    <input
                      type="file"
                      id="fileUpload"
                      onChange={(e) => setFile(e.target.files[0])}
                      style={{ display: "none" }}
                    />

                    <label htmlFor="fileUpload">
                      <i className="fa-solid fa-paperclip attach-icon"></i>
                    </label>
                  </div>
                  <i
                    className="fa-solid fa-paper-plane send-icon"
                    onClick={sendMessage}
                  ></i>
                </div>
              </div>
            )}
          </div>
        );

      //code for ticket section======================================================================
      case "ticket":
        return (
          <div className="ticket-dashboard">
            {/* code for top buttons */}
            <div className="top-btns">
              <button
                className={`add-btn ${page === "add" ? "active-btn" : ""}`}
                onClick={() => setPage(page === "add" ? "dashboard" : "add")}
              >
                {page === "add" ? "X Close" : "+ Add"}
              </button>
              <button
                className={`filter-btn ${
                  page === "filter" ? "active-btn" : ""
                }`}
                onClick={() =>
                  setPage(page === "filter" ? "dashboard" : "filter")
                }
              >
                {page === "filter" ? "X Close" : "Filter"}
              </button>
            </div>

            {/* Add Ticket Form */}
            {page === "add" && (
              <div className="add-form-container">
                <form className="add-form">
                  <div className="form-field">
                    <label htmlFor="subject">Subject:</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={addFormData.subject}
                      onChange={handleAddFormChange}
                      required
                      placeholder="Enter subject"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="priority">Priority:</label>
                    <select
                      id="priority"
                      name="priority"
                      value={addFormData.priority}
                      onChange={handleAddFormChange}
                      required
                    >
                      <option value="">Select Priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="group">Group:</label>
                    <select
                      id="group"
                      name="group"
                      value={addFormData.group}
                      onChange={handleAddFormChange}
                      required
                    >
                      <option value="">Select Group</option>
                      <option value="travel">Travel</option>
                      <option value="payroll">Payroll</option>
                      <option value="admin">Admin</option>
                      <option value="it-support">IT Support</option>
                      <option value="hr">HR</option>
                      <option value="reimbursement">Reimbursement</option>
                      <option value="pocket-hrms">Pocket HRMS</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="description">Description:</label>
                    <textarea
                      id="description"
                      name="description"
                      value={addFormData.description}
                      onChange={handleAddFormChange}
                      required
                      placeholder="Enter description..."
                    ></textarea>
                  </div>

                  <div className="form-field file-upload">
                    <label htmlFor="file">Attach File:</label>
                    <input
                      type="file"
                      id="file"
                      name="file"
                      accept=".png,.jpg,.jpeg,.doc,.docx,.pdf"
                      onChange={handleAddFormChange}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="tags">Tags:</label>
                    <select
                      id="tags"
                      name="tags"
                      value={addFormData.tags}
                      onChange={handleAddFormChange}
                    >
                      <option value="">Select Tag</option>
                      <option value="query">Tag Name - Query</option>
                      <option value="problem">Tag Name - Problem</option>
                    </select>
                  </div>

                  <div className="button-container">
                    <button type="submit" className="submit-btn">
                      Create
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Filter Ticket Form */}
            {page === "filter" && (
              <div className="filter-page">
                <h2>Filter By:-</h2>
                <form className="filter-ticket-form">
                  <div className="filter-form">
                    <div className="filter-field">
                      <label htmlFor="ticketId">Filter by Ticket ID:</label>
                      <input
                        type="text"
                        id="ticketId"
                        name="ticketId"
                        value={filterData.ticketId}
                        onChange={handleFilterChange}
                        placeholder="Enter Ticket ID"
                      />
                    </div>

                    <div className="filter-field">
                      <label htmlFor="title">Filter by Title:</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={filterData.title}
                        onChange={handleFilterChange}
                        placeholder="Enter Title"
                      />
                    </div>

                    <div className="filter-field">
                      <label htmlFor="status">Filter by Status:</label>
                      <select
                        id="status"
                        name="status"
                        value={filterData.status}
                        onChange={handleFilterChange}
                      >
                        <option value="">Select Status</option>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <div className="filter-field">
                      <label htmlFor="priority">Filter by Priority:</label>
                      <select
                        id="priority"
                        name="priority"
                        value={filterData.priority}
                        onChange={handleFilterChange}
                      >
                        <option value="">Select Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>

                    <div className="filter-field">
                      <label htmlFor="tagname">Filter by Tag Name:</label>
                      <select
                        id="tagname"
                        name="tagname"
                        value={filterData.tagname}
                        onChange={handleFilterChange}
                      >
                        <option value="">Select Tag Name</option>
                        <option value="query">Query</option>
                        <option value="problem">Problem</option>
                      </select>
                    </div>

                    <div className="filter-btn-container">
                      <button type="button" className="apply-btn">
                        Apply
                      </button>
                      <button type="button" className="create-btn">
                        Create
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {page === "dashboard" && (
              <>
                {/* Open & Close Buttons */}
                <div className="openclose-btns">
                  <button
                    className="status-btn"
                    onClick={() => setActiveTab("open")}
                  >
                    <span
                      className={`number-badge ${
                        activeTab === "open" ? "blue-badge" : "grey-badge"
                      }`}
                    >
                      2
                    </span>{" "}
                    Open
                  </button>
                  <button
                    className="status-btn"
                    onClick={() => setActiveTab("closed")}
                  >
                    <span
                      className={`number-badge ${
                        activeTab === "closed" ? "blue-badge" : "grey-badge"
                      }`}
                    >
                      7
                    </span>{" "}
                    Closed
                  </button>
                </div>

                {/* Table Section */}
                <div className="ticket-table">
                  <div className="div-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Ticket No.</th>
                          <th>Title</th>
                          <th>Created Date</th>
                          <th>Status</th>
                          <th>Priority</th>
                          <th>Agent Assigned</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(activeTab === "open"
                          ? openTickets
                          : closedTickets
                        ).map((ticket, index) => (
                          <tr key={index}>
                            <td className={`left-border color-${index % 5}`}>
                              &nbsp;{ticket.ticketNo}
                            </td>
                            <td>{ticket.title}</td>
                            <td>{ticket.createdDate}</td>
                            <td>
                              <span className="status-text">
                                {ticket.status}
                              </span>
                            </td>
                            <td className={`left-border color-${index % 5}`}>
                              &nbsp;{ticket.priority}
                            </td>
                            <td>{ticket.agentAssigned}</td>
                            <td className="action-icons">
                              <button className="edit-btn">
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                              <button className="delete-btn">
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      //code for ticket-report section======================================================================
      case "ticket-report":
        return (
          <div className="ticket-dashboard">
            <h1>this is ticket report page</h1>
          </div>
        );
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
