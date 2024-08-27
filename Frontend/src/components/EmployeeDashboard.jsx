import React,{useEffect, useState} from 'react';
import NavigationBar from './NavigationBar';
import '../styles/EmployeeDashboard.css';
import axios from 'axios';
import profileimg from '../assets/img-dashboard.jpg';
import bdayimg from '../assets/P.jpg'
import cakeimg from '../assets/cake-img.png'
import { useNavigate } from 'react-router-dom';

function EmployeeDashboard() {

  const calculateDays = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include both start and end date
    return diffDays;
  };


  let dateObj = new Date();

let month = String(dateObj.getMonth() + 1)
    .padStart(2, '0');
    
let day = String(dateObj.getDate())
    .padStart(2, '0');

let year = dateObj.getFullYear();
let todayDate = day + '/' + month + '/' + year;
  const [employeedata, setemployeedata]=useState("")
  const [avatarUrl, setAvatarUrl] = useState("");
  const [leaves, setLeaves] = useState([]);
  const navigate = useNavigate(); 
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);
  const [formData, setFormData] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    fromTime: 'FULL DAY', // Default value
    toTime: 'FULL DAY',   // Default value
    reason: '',
    leaveStation: 'No',  // Default value
    vacationAddress: '',
    contactNumber: ''
  });


  const [activeSection, setActiveSection] = useState('home');
 
  const [activeRequestPage, setActiveRequestPage] = useState('leave');

  const handlePunchIn = async () => {
    const currentTime = new Date();
    setPunchInTime(currentTime);
    setIsPunchedIn(true);

    try {
      const token = getCookie('token');
      const response=await axios.post('http://localhost:8000/employees/punchIn', {
        punchInTime: currentTime,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
     

    } catch (error) {
      console.error('Error punching in:', error);
    }
  };
  
  const handlePunchOut = async () => {
    const currentTime = new Date();
    setPunchOutTime(currentTime);
    setIsPunchedIn(false);
  
    // Send punch-out time to backend
    try {
      const token = getCookie('token');
      await axios.post('http://localhost:8000/employees/punchOut', {
        punchOutTime: currentTime,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
    } catch (error) {
      console.error('Error punching out:', error);
    }
  };


//leaves section



  const token = getCookie('token'); // Replace this with the actual token, maybe from localStorage or cookies

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/employees/addLeave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include auth header
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        window.location.reload();
        console.log('Leave request submitted successfully!');
      } else {
        // Handle errors
        console.error('Failed to submit leave request');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

//cancel leave

const handleCancelLeave = async (leaveId) => {
  try {
    console.log('Leave request cancelled',leaveId)
    const response = await axios.get(`http://localhost:8000/employees/deleteLeaves/${leaveId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if(response.status === 200) {
      setLeaves((prevLeaves) => prevLeaves.filter((leave) => leave._id !== leaveId));
      window.location.reload()
      console.log('Leave successfully canceled');
    } else {
      console.error('Failed to cancel leave');
    }
  } catch (error) {
    console.error('Error canceling leave:', error);
  }
}



  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = getCookie('token');
        if (!token) {
          navigate("/")
          return;
        }

        const response = await axios.get('http://localhost:8000/employees/empdata', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true, 
        });

        if (response.status === 200) {
          const empdata = response.data;
          setemployeedata(empdata.employee)
          setLeaves(empdata.empleaves)
     
          if(empdata.empimg[0]){
            if (empdata.empimg) {
              const binaryString = new Uint8Array(empdata.empimg[0].Image.data).reduce((acc, byte) => acc + String.fromCharCode(byte), '');
              const base64String = btoa(binaryString);
              const imageUrl = `data:${empdata.empimg[0].Imagetype};base64,${base64String}`;
              setAvatarUrl(imageUrl);
            }

             }
               
            } else {
                console.error('Failed to fetch employee data');
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    fetchEmployeeData();
}, []);
const joiningDate = new Date(employeedata.dateOfHire);
const currentDate = new Date();

  const diffInTime = currentDate - joiningDate;

  
  let diffInYears = currentDate.getFullYear() - joiningDate.getFullYear();
  let diffInMonths = currentDate.getMonth() - joiningDate.getMonth();
  let diffInDays = currentDate.getDate() - joiningDate.getDate();

  
  if (diffInDays < 0) {
    diffInMonths--;
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    diffInDays += prevMonth;
  }

  if (diffInMonths < 0) {
    diffInYears--;
    diffInMonths += 12;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="dashboard-container">
            <div className="left-side">
            <div className="profile-section">
          {avatarUrl ? (
              <img src={avatarUrl}  alt="Profile" className="profile-image" />
            ) : (
              <p>Loading....</p>
            )}
            <h2 className="employee-name">{employeedata ? employeedata.firstName+employeedata.lastName : 'Loading...'}</h2>
            <p className="employee-role">{employeedata ? employeedata.jobTitle : 'Loading'}</p>
            <div className="work-duration">
              <p> At work for: {diffInYears} year{diffInYears !== 1 && 's'} {diffInMonths} month{diffInMonths !== 1 && 's'} {diffInDays} day{diffInDays !== 1 && 's'}</p>
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
                  {punchInTime && <p>Punched In At: {punchInTime.toLocaleTimeString()}</p>}
                  {punchOutTime && <p>Punched Out At: {punchOutTime.toLocaleTimeString()}</p>}
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
              <p><span><img className="cake-img" src={cakeimg} alt="" /></span> &nbsp; Birthdays</p>
              <div className="birthday-person">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Birthday Person" className="birthday-image" />
                ) : (
                <p>Loading Image...</p>
              )}
                <p><strong>{employeedata ? employeedata.firstName+" "+employeedata.lastName : 'Loading...'}</strong> has a birthday on {employeedata ? new Date(employeedata.dob).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit'
                              }) 
                              : 'Loading...'}</p>
              </div>
            </div>
          </div>
        </div>
            <div className="right-side">
              <div className="details-container">
                <div className="personal-company-details">
                <div className="personal-details">
                <div className="details">
                  <h3><i className="fa-solid fa-pen"></i> &nbsp;Personal Details</h3>
                </div>
                <p>Name:{employeedata ? employeedata.firstName+" "+employeedata.lastName : 'Loading...'}</p>
                <hr />
                <p>Father's Name:{employeedata ? employeedata.fatherName: 'Loading...'}</p>
                <hr />
                <p>
                    Date of Birth: {employeedata ? new Date(employeedata.dob).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit'
                              }) 
                              : 'Loading...'}
                            </p>
                <hr />
                <p>Gender: {employeedata ? employeedata.gender : 'Loading...'}</p>
                <hr />
                <p>Email:{employeedata ? employeedata.email: 'Loading...'}</p>
                <hr />
                <p>Phone:{employeedata ? employeedata.mobile: 'Loading...'} </p>
                <hr />
                <p>Local Address: xyz</p>
                <hr />
                <p>Permanent Address: XYZ</p>
              </div>
              <div className="company-details">
                <div className="details">
                  <h3><i className="fa-solid fa-briefcase"></i>&nbsp; Company Details</h3>
                </div>
                <p>Employee ID: {employeedata ? employeedata.employeeId: 'Loading...'}</p>
                <hr ></hr>
                <p>Department: {employeedata ? employeedata.department: 'Loading...'}</p>
                <hr></hr>
                <p>Designation: {employeedata ? employeedata.jobTitle : 'Loading'}</p>
              </div>
            </div>
                <div className="notice-board-upcoming-holidays">
                  <div className="notice-board">
                    <div className="details">
                      <h3><i className="fa-solid fa-bullhorn"></i>&nbsp; Notice Board</h3>
                    </div>
                    <div className="notice-space">No Notice</div>
                  </div>
                  <div className="upcoming-holidays">
                    <div className="details">
                      <h3><i className="fa-solid fa-paper-plane"></i>&nbsp; Upcoming Holidays</h3>
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
      case 'request':
        return (
          <div className="request-section">
            <nav className="request-nav">
              <button onClick={() => setActiveRequestPage('leave')} className={activeRequestPage === 'leave' ? 'active' : ''}>Leave</button>
              <button onClick={() => setActiveRequestPage('attendance-regularization')} className={activeRequestPage === 'attendance-regularization' ? 'active' : ''}>Attendance Regularization</button>
              <button onClick={() => setActiveRequestPage('on-duty')} className={activeRequestPage === 'on-duty' ? 'active' : ''}>On Duty/Work From Home</button>
              <button onClick={() => setActiveRequestPage('permission')} className={activeRequestPage === 'permission' ? 'active' : ''}>Permission</button>
            </nav>

    <div className="request-content">{activeRequestPage === 'leave' && (
             <>
   
    <div className="content-wrapper">
      <div className="left-block">
        <div className="date-section">
          <h4>Date:</h4>
          <p>{todayDate ? todayDate : "Loading.."}</p>
        </div>
        <div className="leave-contact-section">
          <h4>1st leave contact:</h4>
          <p>{employeedata ? employeedata.manager :"loading....."}</p>
        </div>
        <div className="joining-date-section">
          <h4>Date of Joining:</h4>
          <p>{employeedata ? new Date(employeedata.dateOfHire).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit'
                              }):"loading.."}</p>
        </div>
      </div>
      <div className="right-block">
      <form className="leave-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Type of leave:</label>
          <select name="leaveType" value={formData.leaveType} onChange={handleChange}>
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
          <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>To Date:</label>
          <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <select name="fromTime" value={formData.fromTime} onChange={handleChange}>
            <option value="FULL DAY">FULL DAY</option>
            <option value="HALF DAY">HALF DAY</option>
          </select>
        </div>
        <div className="form-group">
          <select name="toTime" value={formData.toTime} onChange={handleChange}>
            <option value="FULL DAY">FULL DAY</option>
            <option value="HALF DAY">HALF DAY</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Reason:</label>
          <input type="text" name="reason" value={formData.reason} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Leave Station:</label>
          <select name="leaveStation" value={formData.leaveStation} onChange={handleChange}>
            <option value="No">No</option>
            <option value="Out of Town">Out of Town</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Vacation Address:</label>
          <input type="text" name="vacationAddress" value={formData.vacationAddress} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Contact Number:</label>
          <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
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
          
          {leaves ? leaves.map((leave)=>{
            return (
              
              <tr key={leave.id}>
                <td>{leave.leaveStatus}</td>
                <td>{leave.fromDate ? new Date(leave.fromDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit'
                              }):"no leave "}</td>
                <td>{leave.fromTime}</td>
                <td>{leave.toDate ? new Date(leave.toDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit'
                              }):"no leave "}</td>
                <td>{leave.toTime}</td>
                <td>{calculateDays(leave.fromDate, leave.toDate)}</td>
                <td>{leave.typeofLeaves}</td>
                <td>{leave.attachment}</td>
                <td>
                {leave.leaveStatus === 'Pending' && (
                  <button className="cancel" onClick={() => handleCancelLeave(leave._id)}>
                    Cancel
                  </button>
                )}
              </td>
              </tr>
            )
        }) : <p>No Leaves are not Present</p>}
          
        </tbody>
      </table>
    </div>
  </>
)}
{activeRequestPage === 'attendance-regularization' && (
  <>
    <div className="attendance-regularization-section">
      {/* Search Block */}
      <div className="attendance-search-block">
        <div className="search-inputs">
          <input type="date" placeholder="Start Date" />
          <input type="date" placeholder="End Date" />
          <button className="search-button">Search</button>
        </div>
        <button className="search-button-bottom">Search....</button>
      </div>

      {/* Attendance Records Table */}
      <div className="attendance-table-section">
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
              <td><button className="update-button">Update</button></td>
            </tr>
            <tr>
              <td>02/04/2024</td>
              <td>02/04/2024</td>
              <td>09:00</td>
              <td>02/04/2024</td>
              <td>18:00</td>
              <td></td>
              <td>-</td>
              <td><button className="update-button">Update</button></td>
            </tr>
            <tr>
              <td>03/04/2024</td>
              <td>03/04/2024</td>
              <td>09:30</td>
              <td>03/04/2024</td>
              <td>17:30</td>
              <td></td>
              <td>-</td>
              <td><button className="update-button">Update</button></td>
            </tr>
            <tr>
              <td>04/04/2024</td>
              <td>04/04/2024</td>
              <td>09:15</td>
              <td>04/04/2024</td>
              <td>18:15</td>
              <td></td>
              <td>-</td>
              <td><button className="update-button">Update</button></td>
            </tr>
            <tr>
              <td>05/04/2024</td>
              <td>05/04/2024</td>
              <td>10:00</td>
              <td>05/04/2024</td>
              <td>19:00</td>
              <td></td>
              <td>-</td>
              <td><button className="update-button">Update</button></td>
            </tr>
          </tbody>
        </table>
        <div className="pagination">
          <p>Showing 1 to 10 of 51 entries</p>
          <div className="pagination-controls">
            <span>Show</span>
            <input type="number" min="0" defaultValue="0" />
            <span>entries</span>
          </div>
        </div>
      </div>
    </div>
  </>
)}
{activeRequestPage === 'on-duty' && (
  <div className="on-duty-container">
    <div className="form-block">
      <form>
        <div className="input-row">
          <div className="input-group">
            <label htmlFor="start-date">Start Date</label>
            <input type="date" id="start-date" name="start-date" />
          </div>
          <div className="input-group">
            <label htmlFor="end-date">End Date</label>
            <input type="date" id="end-date" name="end-date" />
          </div>
        </div>

        <div className="input-row">
          <div className="input-group day-type-group">
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

        <div className="input-row">
          <div className="input-group">
            <label htmlFor="in-time">In Time</label>
            <input type="time" id="in-time" name="in-time" />
          </div>
          <div className="input-group">
            <label htmlFor="out-time">Out Time</label>
            <input type="time" id="out-time" name="out-time" />
          </div>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label htmlFor="remark">Remark</label>
            <input type="text" id="remark" name="remark" />
          </div>
        </div>

        <div className="input-row">
          <button type="submit" className="save-button">Save</button>
        </div>
      </form>
    </div>
    <div className="no-record-block">
      No previous record found for current month.
    </div>
  </div>
)}


              {activeRequestPage === 'permission' && <h1>This is the Permission Page</h1>}
            </div>
          </div>
        );
      case 'report':
        return (
          <h1>Report Section</h1>
        );
      default:
        return null;
    }
  };

  return (
    <div className="employee-dashboard">
      <NavigationBar activeSection={activeSection} onNavigate={setActiveSection} />
      {renderSection()}
    </div>
  );
}

export default EmployeeDashboard;
