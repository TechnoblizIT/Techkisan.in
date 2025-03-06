import React, { useEffect, useState } from "react";
import ManagerNavigation from "./ManagerNavigation";
import "../styles/ManagerDashboard.css";
import axios from "axios";
import profileimg from "../assets/img-dashboard.jpg";
import bdayimg from "../assets/P.jpg";
import cakeimg from "../assets/cake-img.png";
import profile from "../assets/P.jpg";
import image from "../assets/img-dashboard.jpg";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { type } from "@testing-library/user-event/dist/type";
import APIEndpoints from "./endPoints";
import io from "socket.io-client";
function ManagerDashboard() {
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

  // for manager-chat-area
  const [selectedChat, setSelectedChat] = useState("");
  // ============================================================
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const Endpoints = new APIEndpoints();
  const socket = io(Endpoints.BASE_URL);
  const [employeedata, setemployeedata] = useState("");
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

  //approve and deny of leaves if employee
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

  const convertImageToBase64 = (imageData, imageType) => {
    if (!imageData) return null; // Handle missing images
    const binaryString = new Uint8Array(imageData).reduce(
      (acc, byte) => acc + String.fromCharCode(byte),
      ""
    );
    const base64String = btoa(binaryString);
    return `data:${imageType};base64,${base64String}`;
  };

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

        // Fetch employee data and users concurrently
        const [employeeResponse, usersResponse] = await Promise.all([
          axios.get(Endpoints.MANAGER_DASHBOARD, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }),
          axios.get(Endpoints.GET_USERS_MANAGER, {
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

  const sendMessage = () => {
    const messageData = {
      senderId: employeedata._id,
      receiverId: selectedChat._id,
      text: input,
    };

    socket.emit("sendMessage", messageData);
    setInput("");
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
                    ? employeedata.firstName + employeedata.lastName
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
                <div className="on-duty-section">
                  <div className="on-duty-form-container">
                    <form>
                      <div className="row-input">
                        <div className="group-input">
                          <label htmlFor="start-date">Start Date</label>
                          <input
                            type="date"
                            id="start-date"
                            name="start-date"
                          />
                        </div>
                        <div className="group-input">
                          <label htmlFor="end-date">End Date</label>
                          <input type="date" id="end-date" name="end-date" />
                        </div>
                      </div>

                      <div className="row-input">
                        <div className="group-input day-type-group">
                          <label htmlFor="day-type">Day Type</label>
                          <select id="day-type" name="day-type">
                            <option value="">--Select--</option>
                            <option value="working">Working</option>
                            <option value="holiday">Holiday</option>
                            <option value="sick">Sick Leave</option>
                            <option value="half-day">Half Day</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="row-input">
                        <div className="group-input">
                          <label htmlFor="in-time">In Time</label>
                          <input type="time" id="in-time" name="in-time" />
                        </div>
                        <div className="group-input">
                          <label htmlFor="out-time">Out Time</label>
                          <input type="time" id="out-time" name="out-time" />
                        </div>
                      </div>

                      <div className="row-input">
                        <div className="group-input">
                          <label htmlFor="remark">Remark</label>
                          <input type="text" id="remark" name="remark" />
                        </div>
                      </div>

                      <div className="row-input">
                        <button type="submit" className="save-btn">
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
                      <button className="export-btn">Export to Excel</button>
                    </div>
                  </div>
                  <div class="srch-btn">
                    <input type="text" placeholder="Search..."></input>
                  </div>
                  <div className="in-out-table-block">
                    <div className="in-out-table-container">
                      <table className="in-out-info-table">
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
                          <tr>
                            <td>47</td>
                            <td>xyz</td>
                            <td>11/08/2024</td>
                            <td>-</td>
                            <td>-</td>
                            <td>WeekOff</td>
                            <td>Weekoff</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td>47</td>
                            <td>xyz</td>
                            <td>12/08/2024</td>
                            <td>-</td>
                            <td>-</td>
                            <td>Unswiped</td>
                            <td>Unswiped</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td>47</td>
                            <td>xyz</td>
                            <td>13/08/2024</td>
                            <td>-</td>
                            <td>-</td>
                            <td>WeekOff</td>
                            <td>Weekoff</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td>47</td>
                            <td>xyz</td>
                            <td>14/08/2024</td>
                            <td>-</td>
                            <td>-</td>
                            <td>Holiday</td>
                            <td>Independance Day</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                          </tr>
                        </tbody>
                      </table>
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
                      <button className="dwnld-button">Download</button>
                    </div>
                  </div>
                  <div className="table-container">
                    <table className="leave-details-table-container">
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
                    <button className="exprt-button">Export to Excel</button>
                  </div>

                  {/* Second Block: Attendance Table */}
                  <div className="manager-second-block">
                    <table className="manager-attendance-table">
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
                <div className="manager-holidays-page">
                  <div className="manager-holidays-buttons">
                    <button className="managerprint-button">Print</button>
                    <button className="managerexcel-button">
                      Export to Excel
                    </button>
                  </div>

                  <div className="manager-holidays-table-section">
                    <table className="manager-holidays-table">
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
                        {/* <span className="preview-time">
                   {mostRecentMessage ? new Date(mostRecentMessage.createdAt).toLocaleTimeString() : "N/A"}
                 </span> Adjust timestamp format */}
                      </div>
                      {/* <p className="preview-message">
                 {mostRecentMessage ? mostRecentMessage.message : "No messages yet"}
               </p> */}
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
                        {message.message}
                      </div>
                    ))}
                </div>

                {/* Message Input Box */}
                <div className="message-input">
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Type a new message"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <i className="fa-regular fa-face-smile emoji-icon"></i>
                    <i className="fa-solid fa-paperclip attach-icon"></i>
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
          <div className="manager-ticket-dashboard">
            {/* Top Buttons */}
            <div className="manager-top-btns">
              <button
                className={`manager-add-btn ${
                  page === "add" ? "active-btn" : ""
                }`}
                onClick={() => setPage(page === "add" ? "dashboard" : "add")}
              >
                {page === "add" ? "X Close" : "+ Add"}
              </button>
              <button
                className={`manager-filter-btn ${
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
              <div className="manager-add-form-container">
                <form className="manager-add-form">
                  <div className="manager-form-field">
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

                  <div className="manager-form-field">
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

                  <div className="manager-form-field">
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

                  <div className="manager-form-field">
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

                  <div className="manager-form-field file-upload-manager">
                    <label htmlFor="file">Attach File:</label>
                    <input
                      type="file"
                      id="file"
                      name="file"
                      accept=".png,.jpg,.jpeg,.doc,.docx,.pdf"
                      onChange={handleAddFormChange}
                    />
                  </div>

                  <div className="manager-form-field">
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

                  <div className="manager-button-container">
                    <button type="submit" className="submit-btn">
                      Create
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Filter Ticket Form */}
            {page === "filter" && (
              <div className="manager-filter-page">
                <h2>Filter By:-</h2>
                <form className="manager-filter-ticket-form">
                  <div className="manager-filter-form">
                    <div className="manager-filter-field">
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

                    <div className="manager-filter-field">
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

                    <div className="manager-filter-field">
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

                    <div className="manager-filter-field">
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

                    <div className="manager-filter-field">
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

                    <div className="manager-filter-btn-container">
                      <button type="button" className="manager-apply-btn">
                        Apply
                      </button>
                      <button type="button" className="manager-create-btn">
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
                <div className="manager-openclose-btns">
                  <button
                    className="manager-status-btn"
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
                    className="manager-status-btn"
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
                <div className="manager-ticket-table">
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
                              <span className="manager-status-text">
                                {ticket.status}
                              </span>
                            </td>
                            <td className={`left-border color-${index % 5}`}>
                              &nbsp;{ticket.priority}
                            </td>
                            <td>{ticket.agentAssigned}</td>
                            <td className="manager-action-icons">
                              <button className="manager-edit-btn">
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                              <button className="manager-delete-btn">
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
