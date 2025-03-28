import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  tableRef,
} from "react";
import ManagerNavigation from "./ManagerNavigation";
import { DownloadTableExcel } from "react-export-table-to-excel";
import "../styles/ManagerDashboard.css";
import axios from "axios";
// import profileimg from "../assets/img-dashboard.jpg";
// import bdayimg from "../assets/P.jpg";
import cakeimg from "../assets/cake-img.png";
import profile from "../assets/P.jpg";
// import image from "../assets/img-dashboard.jpg";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
// import { type } from "@testing-library/user-event/dist/type";
import APIEndpoints from "./endPoints";
import io from "socket.io-client";

function ManagerDashboard() {
  // for export to excel
  const tableRef5 = useRef(null);
  const tableRef6 = useRef(null);
  const tableRef7 = useRef(null);
  const tableRef8 = useRef(null);
  // for manager-chat-area
  const [selectedChat, setSelectedChat] = useState("");
  // ============================================================
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [file, setFile] = useState([]);
  const [input, setInput] = useState("");
  const [attendance, setAttendance] = useState([]);
  const Endpoints = new APIEndpoints();
  const socket = io(Endpoints.BASE_URL);
  const [employeedata, setemployeedata] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [activeSection, setActiveSection] = useState("home");
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeRequestPage, setActiveRequestPage] = useState("leave");
  const [activeReportPage, setActiveReportPage] = useState("leave-balance");
  const [punchRecord, setPunchRecord] = useState([]);
  const [pendingleaves, setPendingleaves] = useState([]);
  const [startDate, setstartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  //   function getCookie(name) {
  //     const value = `; ${document.cookie}`;
  //     const parts = value.split(`; ${name}=`);
  //     if (parts.length === 2) return parts.pop().split(';').shift();
  // }

  const joiningDate = new Date(employeedata.dateOfHire);
  const currentDate = new Date();

  const diffInTime = currentDate - joiningDate;

  let diffInYears = currentDate.getFullYear() - joiningDate.getFullYear();
  let diffInMonths = currentDate.getMonth() - joiningDate.getMonth();
  let diffInDays = currentDate.getDate() - joiningDate.getDate();
  const [entryconut, setentryconut] = useState(10);

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

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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

  const handlePunchIn = async () => {
    const currentTime = new Date();
    setPunchInTime(currentTime);
    setIsPunchedIn(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        Endpoints.MANAGER_PUNCH_IN,
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
        Endpoints.MANAGER_PUNCH_OUT,
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
  const notificationSound = new Audio("/sounds/notificationChat.mp3"); // Sound file in 'public' folder

  //this is for handling the leave approve
  const handleApprove = (leaveId) => {
    fetch(`${Endpoints.MANAGER_APPROVE_LEAVE}/${leaveId}`, { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        fetchPendingLeaves();
      })
      .catch((error) => {
        console.error(error.message);
      });
  };
  // this is for handling leave deny
  const handleDeny = (leaveId) => {
    fetch(`${Endpoints.MANAGER_DENY_LEAVE}/${leaveId}`, { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        fetchPendingLeaves();
      })
      .catch((error) => {
        console.error(error.message);
      });
  };
  // this functions is for converting image to base64
  const convertImageToBase64 = (imageData, imageType) => {
    if (!imageData) return null; // Handle missing images
    const binaryString = new Uint8Array(imageData).reduce(
      (acc, byte) => acc + String.fromCharCode(byte),
      ""
    );
    const base64String = btoa(binaryString);
    return `data:${imageType};base64,${base64String}`;
  };
  //this function is for fetching new leaves from backend
  async function fetchPendingLeaves() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      const decode = jwtDecode(token);
      if (decode.role !== "manager") {
        navigate("/");
        return;
      }

      const response = await axios.get(Endpoints.MANAGER_GET_PENDING_LEAVES, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setPendingleaves(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }
  // this is for filter out the details or records as per date input
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

  // this is for calculating work duration for in out details
  const calculateWorkDuration = (punchIn, punchOut) => {
    if (!punchIn || !punchOut) return "-";

    const inTime = new Date(punchIn);
    const outTime = new Date(punchOut);

    const diffMs = outTime - inTime; // Difference in milliseconds
    if (diffMs <= 0) return "0 hrs 0 mins"; // Prevent negative values
  };

  // Fetch all required data in parallel
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const decode = jwtDecode(token);
        if (decode.role !== "manager") {
          navigate("/");
          return;
        }

        // Fetch all required data in parallel
        const [employeeResponse, usersResponse, messagesResponse] =
          await Promise.all([
            axios.get(Endpoints.MANAGER_DASHBOARD, {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }),
            axios.get(Endpoints.GET_USERS_MANAGER, {
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
          setAnnouncements(empdata.Announcement);
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
          ...usersResponse.data.employees,
          ...usersResponse.data.filtermanager,
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
      notificationSound
        .play()
        .catch((error) => console.error("Sound play error:", error));
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
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
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

    setMessages((prevMessages) => [
      ...prevMessages,
      { ...messageData, temp: true },
    ]);

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

  // this is for getting attendence and map over the attendence table
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
          <div className="manager-dashboard-container">
            <div className="manager-left-side">
              <div className="manager-profile-section">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="manager-profile-image"
                  />
                ) : (
                  <p>Loading....</p>
                )}
                <h2 className="manager-name">
                  {employeedata
                    ? employeedata.firstName + " " + employeedata.lastName
                    : "Loading..."}
                </h2>
                <p className="manager-role">
                  {employeedata ? employeedata.jobTitle : "Loading"}
                </p>
                <div className="manager-work-duration">
                  <p>
                    {" "}
                    At work for: {diffInYears} year{diffInYears !== 1 && "s"}{" "}
                    {diffInMonths} month{diffInMonths !== 1 && "s"} {diffInDays}{" "}
                    day{diffInDays !== 1 && "s"}
                  </p>
                </div>
                <div className="manager-button-section">
                  <button
                    className="manager-punch-button"
                    onClick={handlePunchIn}
                    disabled={isPunchedIn}
                  >
                    Punch In
                  </button>
                  <button
                    className="manager-punch-button"
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
                <div className="attendance-awards">
                  <div className="manager-attendance-column">
                    <p className="num">0/28</p>
                    <p className="labels">Attendance</p>
                  </div>
                  <div className="manager-leaves-column">
                    <p className="num">0/440</p>
                    <p className="labels">Leaves</p>
                  </div>
                  <div className="manager-awards-column">
                    <p className="num">0</p>
                    <p className="labels">Awards</p>
                  </div>
                </div>
                <div className="birthdays-sctn">
                  <p>
                    <span>
                      <img className="cake-img" src={cakeimg} alt="" />
                    </span>{" "}
                    &nbsp; Birthdays
                  </p>
                  <div className="birthday-prsn">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Birthday Person"
                        className="birthday-img"
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
            <div className="manager-right-side">
              <div className="manager-details-container">
                <div className="manager-personal-details">
                  <div className="personal-info">
                    <div className="info">
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
                  <div className="company-info">
                    <div className="info">
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
                <div className="notice-board-holidays">
                  <div className="notice-brd">
                    <div className="info">
                      <h3>
                        <i className="fa-solid fa-bullhorn"></i>&nbsp; Notice
                        Board
                      </h3>
                    </div>
                    <div className="manager-notice-space">
                      {announcements && announcements.length > 0 ? (
                        announcements.map((item, index) => (
                          <p key={index}>
                            {item.Announcement}{" "}
                            <span
                              style={{
                                float: "right",
                                fontWeight: "bold",
                                color: "#007bff",
                              }}
                            >
                              {"(" +
                                formatTime(item.Date).toString() +
                                " " +
                                formatDate(item.Date).toString() +
                                ")"}
                            </span>
                          </p>
                        ))
                      ) : (
                        <p>No New Announcements</p>
                      )}
                    </div>
                  </div>
                  <div className="manager-overall-ticket">
                    <div className="info">
                      <h3>
                        <i class="fa-solid fa-circle-info"></i>&nbsp; Help Desk
                        Status
                      </h3>
                    </div>
                    <div className="manager-tickets">
                      <p>
                        <i class="fa-solid fa-people-group"></i>&nbsp; Total
                        Ticket Raised
                      </p>
                      <p className="manager-ticket-raised">7</p>
                    </div>
                    <div className="manager-tickets">
                      <p>
                        <i class="fa-solid fa-phone-flip"></i>&nbsp; Open
                        tickets
                      </p>
                      <p className="manager-open-ticket">0</p>
                    </div>
                    <div className="manager-tickets">
                      <p>
                        <i class="fa-solid fa-ticket"></i>&nbsp; Closed tickets
                      </p>
                      <p className="manager-close-ticket">7</p>
                    </div>
                  </div>
                  <div className="manager-upcoming-holidays">
                    <div className="info">
                      <h3>
                        <i className="fa-solid fa-paper-plane"></i>&nbsp;
                        Upcoming Holidays
                      </h3>
                    </div>
                    <div className="holidy">
                      <p>Office Off</p>
                      <p>01/01/2024</p>
                    </div>
                    <div className="holidy">
                      <p>Office Off</p>
                      <p>15/08/2024</p>
                    </div>
                    <div className="holidy">
                      <p>Office Off</p>
                      <p>25/12/2024</p>
                    </div>
                    <div className="holidy">
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
          <div className="manager-request-section">
            <nav className="manager-request-nav">
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

            <div className="manager-request-content">
              {activeRequestPage === "leave" && (
                <>
                  <div className="content-wrap">
                    <div className="leave-left-block">
                      <div className="leave-date-section">
                        <h4>Date:</h4>
                        <p>16/08/2024</p>
                      </div>
                      <div className="leave-contact">
                        <h4>1st leave contact:</h4>
                        <p>14-Sankalp Dhekwar</p>
                      </div>
                      <div className="joining-date">
                        <h4>Date of Joining:</h4>
                        <p>01/06/2020</p>
                      </div>
                    </div>
                    <div className="leave-right-block">
                      <form className="manager-leave-form">
                        <div className="manager-form-row">
                          <div className="manager-form-group">
                            <label>Type of leave:</label>
                            <select>
                              <option>-Select-</option>
                              <option>Sick Leave</option>
                              <option>Casual Leave</option>
                              <option>Earned Leave</option>
                            </select>
                          </div>
                        </div>
                        <div className="manager-form-row">
                          <div className="manager-form-group">
                            <label>From Date:</label>
                            <input type="date" />
                          </div>
                          <div className="manager-form-group">
                            <label>To Date:</label>
                            <input type="date" />
                          </div>
                        </div>
                        <div className="manager-form-row">
                          <div className="manager-form-group">
                            <select>
                              <option>FULL DAY</option>
                              <option>HALF DAY</option>
                            </select>
                          </div>
                          <div className="manager-form-group">
                            <select>
                              <option>FULL DAY</option>
                              <option>HALF DAY</option>
                            </select>
                          </div>
                        </div>
                        <div className="manager-form-row">
                          <div className="manager-form-group">
                            <label>Reason:</label>
                            <input type="text" />
                          </div>
                          <div className="manager-form-group">
                            <label>Leave Station:</label>
                            <select>
                              <option>No</option>
                              <option>Out of Town</option>
                            </select>
                          </div>
                        </div>
                        <div className="manager-form-row">
                          <div className="manager-form-group">
                            <label>Vacation Address:</label>
                            <input type="text" />
                          </div>
                          <div className="manager-form-group">
                            <label>Contact Number:</label>
                            <input type="text" />
                          </div>
                        </div>
                        <div className="manager-form-row">
                          <div className="manager-form-group">
                            <input
                              className="form-add"
                              type="submit"
                              value="Add"
                              disabled
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="previous-leaves">
                    <h4>Previous Leaves</h4>
                    <div className="table-div">
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
                          <tr>
                            <td>
                              <button>Approved</button>
                            </td>
                            <td>08/01/2024</td>
                            <td>First Half</td>
                            <td>08/01/2024</td>
                            <td>First Half</td>
                            <td>0.5</td>
                            <td>Sick Leave</td>
                            <td></td>
                            <td>
                              <button className="cancelled">Cancel</button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <button>Approved</button>
                            </td>
                            <td>15/01/2024</td>
                            <td>Full Day</td>
                            <td>15/01/2024</td>
                            <td>Full Day</td>
                            <td>1</td>
                            <td>Casual Leave</td>
                            <td></td>
                            <td>
                              <button className="cancelled">Cancel</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
              {activeRequestPage === "attendance-regularization" && (
                <>
                  <div className="attendance-regularization-sectn">
                    {/* Search Block */}
                    <div className="attendance-search">
                      <div className="inputsearch">
                        <input type="date" placeholder="Start Date" />
                        <input type="date" placeholder="End Date" />
                        <button className="search-btns">Search</button>
                      </div>
                      <button className="search-btn-bottom">Search....</button>
                    </div>

                    {/* Attendance Records Table */}
                    <div className="attendance-regularization-table">
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
                          <tr>
                            <td>01/04/2024</td>
                            <td>01/04/2024</td>
                            <td>10:17</td>
                            <td>01/04/2024</td>
                            <td>21:05</td>
                            <td></td>
                            <td>-</td>
                            <td>
                              <button className="update-btn">Update</button>
                            </td>
                          </tr>
                          <tr>
                            <td>02/04/2024</td>
                            <td>02/04/2024</td>
                            <td>09:00</td>
                            <td>02/04/2024</td>
                            <td>18:00</td>
                            <td></td>
                            <td>-</td>
                            <td>
                              <button className="update-btn">Update</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="attendance-regularization-pagination">
                        <p>Showing 1 to 10 of 51 entries</p>
                        <div className="attendance-regularization-pagination-controls">
                          <span>Show</span>
                          <input type="number" min="0" defaultValue="0" />
                          <span>entries</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {activeRequestPage === "on-duty" && (
                <p className="comming-soon-employee">Coming Soon.....</p>
                // <div className="on-duty-section">
                //   <div className="on-duty-form-container">
                //     <form>
                //       <div className="row-input">
                //         <div className="group-input">
                //           <label htmlFor="start-date">Start Date</label>
                //           <input
                //             type="date"
                //             id="start-date"
                //             name="start-date"
                //           />
                //         </div>
                //         <div className="group-input">
                //           <label htmlFor="end-date">End Date</label>
                //           <input type="date" id="end-date" name="end-date" />
                //         </div>
                //       </div>

                //       <div className="row-input">
                //         <div className="group-input day-type-group">
                //           <label htmlFor="day-type">Day Type</label>
                //           <select id="day-type" name="day-type">
                //             <option value="">--Select--</option>
                //             <option value="working">Working</option>
                //             <option value="holiday">Holiday</option>
                //             <option value="sick">Sick Leave</option>
                //             <option value="half-day">Half Day</option>
                //             <option value="other">Other</option>
                //           </select>
                //         </div>
                //       </div>

                //       <div className="row-input">
                //         <div className="group-input">
                //           <label htmlFor="in-time">In Time</label>
                //           <input type="time" id="in-time" name="in-time" />
                //         </div>
                //         <div className="group-input">
                //           <label htmlFor="out-time">Out Time</label>
                //           <input type="time" id="out-time" name="out-time" />
                //         </div>
                //       </div>

                //       <div className="row-input">
                //         <div className="group-input">
                //           <label htmlFor="remark">Remark</label>
                //           <input type="text" id="remark" name="remark" />
                //         </div>
                //       </div>

                //       <div className="row-input">
                //         <button type="submit" className="save-btn">
                //           Save
                //         </button>
                //       </div>
                //     </form>
                //   </div>
                //   <div className="no-record-block">
                //     No previous record found for current month.
                //   </div>
                // </div>
              )}

              {activeRequestPage === "permission" && (
                <p className="comming-soon-employee">Coming Soon.....</p>
              )}
            </div>
          </div>
        );
      case "report":
        return (
          <div className="manager-report-section">
            <nav className="manager-report-nav">
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

            <div className="manager-report-content">
              {activeReportPage === "leave-balance" && (
                <div class="leave-balance-section">
                  <div class="search-block">
                    <input type="text" placeholder="Search..."></input>
                  </div>

                  <div class="leave-balance-table-block">
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
                            <button class="action-btn">View Used</button>
                            <button class="action-btn">View Debited</button>
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
                            <button class="action-btn">View Used</button>
                            <button class="action-btn">View Debited</button>
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
                            <button class="action-btn">View Used</button>
                            <button class="action-btn">View Debited</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="leave-blnce-pagination">
                    <p>Showing 1 to 5 of 5 entries</p>
                    <div className="leave-blnce-pagination-controls">
                      <span>Show</span>
                      <input type="number" min="0" defaultValue="0" />
                      <span>entries</span>
                    </div>
                  </div>
                </div>
              )}
              {activeReportPage === "in-out-details" && (
                <div className="in-out-details-container">
                  <div className="report-type-block">
                    <div className="in-out-block">
                      <label htmlFor="report-type">Report Type</label>
                      <select id="report-type" name="report-type">
                        <option value="">Select Report Type</option>
                        <option value="daily">Daily Report</option>
                        <option value="weekly">Weekly Report</option>
                        <option value="monthly">Monthly Report</option>
                        <option value="yearly">Yearly Report</option>
                      </select>
                    </div>
                    <div className="in-out-block">
                      <label htmlFor="from-date">From Date</label>
                      <input type="date" id="from-date" name="from-date" />
                    </div>
                    <div className="in-out-block">
                      <label htmlFor="to-date">To Date</label>
                      <input type="date" id="to-date" name="to-date" />
                    </div>
                    <div className="btn-block">
                      <button className="btn-search">Search</button>
                      {/* <button className="export-btn">Export to Excel</button> */}
                      <DownloadTableExcel
                        filename="in-out-table"
                        sheet="users"
                        currentTableRef={tableRef5.current}
                      >
                        <button className="export-btn">Export to Excel</button>
                      </DownloadTableExcel>
                    </div>
                  </div>
                  <div class="srch-btn">
                    <input type="text" placeholder="Search..."></input>
                  </div>
                  <div className="in-out-table-block">
                    <div className="in-out-table-container">
                      <div className="in-out-table-section">
                        <table className="in-out-details-table" ref={tableRef5}>
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
                            {filteredRecords
                              .slice(-entryconut)
                              .map((record) => (
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
                    </div>
                    <div className="in-out-pagination">
                      <p>Showing 1 to 5 of 5 entries</p>
                      <div className="in-out-pagination-controls">
                        <span>Show</span>
                        <input type="number" min="0" defaultValue="0" />
                        <span>entries</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeReportPage === "leave-details" && (
                <div className="leave-details-section">
                  <div className="leave-details-fil">
                    <div className="leave-details-container">
                      <label htmlFor="leave-status">Leave status</label>
                      <select id="leave-status" name="leave-status">
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="leave-details-container">
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
                    <div className="leave-details-container">
                      <label htmlFor="from-date">From Date</label>
                      <input type="date" id="from-date" name="from-date" />
                    </div>
                    <div className="leave-details-container">
                      <label htmlFor="to-date">To Date</label>
                      <input type="date" id="to-date" name="to-date" />
                    </div>
                    <div className="button-container">
                      <button className="srch-button">Search</button>
                      {/* <button className="dwnld-button">Download</button> */}
                      <DownloadTableExcel
                        filename="leave-details"
                        sheet="users"
                        currentTableRef={tableRef6.current}
                      >
                        <button className="dwnld-button">Download</button>
                      </DownloadTableExcel>
                    </div>
                  </div>
                  <div className="table-container">
                    <table
                      className="leave-details-table-container"
                      ref={tableRef6}
                    >
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
                        <tr>
                          <td>
                            <button className="status-button-approved">
                              Approved
                            </button>
                          </td>
                          <td>12/07/2024</td>
                          <td>Full Day</td>
                          <td>12/07/2024</td>
                          <td>Full Day</td>
                          <td>1</td>
                          <td>sick leave</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>
                            <button className="status-button-approved">
                              Approved
                            </button>
                          </td>
                          <td>15/07/2024</td>
                          <td>Full Day</td>
                          <td>15/07/2024</td>
                          <td>Full Day</td>
                          <td>1</td>
                          <td>sick leave</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>
                            <button className="status-button approved">
                              Approved
                            </button>
                          </td>
                          <td>18/07/2024</td>
                          <td>Full Day</td>
                          <td>18/07/2024</td>
                          <td>Second half</td>
                          <td>0.5</td>
                          <td>Casual Leave</td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="leave-details-pagination">
                      <p>Showing 1 to 3 of 3 entries</p>
                      <div className="leave-details-pagination-controls">
                        <span>Show</span>
                        <input type="number" min="0" defaultValue="0" />
                        <span>entries</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeReportPage === "annual-attendance-summary" && (
                <div className="annual-attendance-summary">
                  <div className="selectyear-block">
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
                      currentTableRef={tableRef7.current}
                    >
                      <button className="exprt-button">Export to Excel</button>
                    </DownloadTableExcel>
                  </div>

                  {/* Second Block: Attendance Table */}
                  <div className="manager-second-block">
                    <table className="manager-attendance-table" ref={tableRef7}>
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
                      filename="holiday-table"
                      sheet="users"
                      currentTableRef={tableRef8.current}
                    >
                      <button> Export excel </button>
                    </DownloadTableExcel>
                  </div>

                  <div className="holidays-table-section">
                    <table className="holidays-table" ref={tableRef8}>
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
                <p className="comming-soon-employee">Coming Soon.....</p>
              )}
            </div>
          </div>
        );
      case "pending":
        return (
          <div className="pending-section">
            <div className="pending-leave-container">
              <h4>Pending Leave</h4>
              <div className="div-pending-table">
                <table className="pending-leaves-table">
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Leave Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Number of Days</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingleaves.length > 0 ? (
                      pendingleaves.map((leave) => (
                        <tr key={leave._id}>
                          <td>
                            {leave.employeeId.firstName +
                              " " +
                              leave.employeeId.lastName}
                          </td>
                          <td>{leave.typeofLeaves}</td>
                          <td>
                            {new Date(leave.fromDate).toLocaleDateString()}
                          </td>
                          <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                          <td>
                            {Math.ceil(
                              (new Date(leave.toDate) -
                                new Date(leave.fromDate)) /
                                (1000 * 60 * 60 * 24)
                            ) + 1}
                          </td>
                          <td>
                            <button
                              className="pending-approved-button"
                              onClick={() => handleApprove(leave._id)}
                            >
                              Approve
                            </button>
                            <button
                              className="pending-cancel-button"
                              onClick={() => handleDeny(leave._id)}
                            >
                              Deny
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">No pending leaves found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
                          <span
                            className={`online-indicator ${
                              onlineUsers.includes(user._id)
                                ? "online"
                                : "offline"
                            }`}
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
                                };base64,${btoa(
                                  String.fromCharCode(
                                    ...new Uint8Array(message.file.data.data)
                                  )
                                )}`}
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
                                };base64,${btoa(
                                  String.fromCharCode(
                                    ...new Uint8Array(message.file.data.data)
                                  )
                                )}`}
                                download={message.file.name}
                                className="download-btn"
                              >
                                <i className="fa-solid fa-download"></i>{" "}
                                {message.file.name}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  <div ref={messagesEndRef}></div>{" "}
                  {/* Add this at the bottom */}
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

      case "tasks":
        return <p className="comming-soon-employee">Coming Soon.....</p>;
      case "tickets":
        return <p className="comming-soon-employee">Coming Soon.....</p>;

      default:
        return null;
    }
  };
  return (
    <div className="manager-dashboard">
      <ManagerNavigation
        activeSection={activeSection}
        onNavigate={setActiveSection}
      />
      {renderSection()}
    </div>
  );
}

export default ManagerDashboard;
