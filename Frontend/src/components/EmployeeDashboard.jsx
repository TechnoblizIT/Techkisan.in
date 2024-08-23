import React,{useEffect, useState} from 'react';
import NavigationBar from './NavigationBar';
import '../styles/EmployeeDashboard.css';
import axios from 'axios';
import profileimg from '../assets/img-dashboard.jpg';
import bdayimg from '../assets/P.jpg'
import cakeimg from '../assets/cake-img.png'
import { useNavigate } from 'react-router-dom';

function EmployeeDashboard() {
  const [employeedata, setemployeedata]=useState("")
  const [avatarUrl, setAvatarUrl] = useState("");
  const navigate = useNavigate(); 

  const [activeSection, setActiveSection] = useState('home');
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [activeRequestPage, setActiveRequestPage] = useState('leave');

  const handlePunchIn = () => setIsPunchedIn(true);
  const handlePunchOut = () => setIsPunchedIn(false);

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
            <div className="request-content">
            {activeRequestPage === 'leave' && (
             <>
   
    <div className="content-wrapper">
      <div className="left-block">
        <div className="date-section">
          <h4>Date:</h4>
          <p>16/08/2024</p>
        </div>
        <div className="leave-contact-section">
          <h4>1st leave contact:</h4>
          <p>14-Sankalp Dhekwar</p>
        </div>
        <div className="joining-date-section">
          <h4>Date of Joining:</h4>
          <p>01/06/2020</p>
        </div>
      </div>
      <div className="right-block">
        <form className="leave-form">
          <div className="form-row">
            <div className="form-group">
              <label>Type of leave:</label>
              <select>
                <option>-Select-</option>
                <option>Sick Leave</option>
                <option>Casual Leave</option>
                <option>Earned Leave</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>From Date:</label>
              <input type="date" />
            </div>
            <div className="form-group">
              <label>To Date:</label>
              <input type="date" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <select>
                <option>FULL DAY</option>
                <option>HALF DAY</option>
              </select>
            </div>
            <div className="form-group">
              <select>
                <option>FULL DAY</option>
                <option>HALF DAY</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Reason:</label>
              <input type="text" />
            </div>
            <div className="form-group">
              <label>Leave Station:</label>
              <select>
                <option>No</option>
                <option>Out of Town</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Vacation Address:</label>
              <input type="text" />
            </div>
            <div className="form-group">
              <label>Contact Number:</label>
              <input type="text" />
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
          <tr>
            <td><button>Approved</button></td>
            <td>08/01/2024</td>
            <td>First Half</td>
            <td>08/01/2024</td>
            <td>First Half</td>
            <td>0.5</td>
            <td>Sick Leave</td>
            <td></td>
            <td><button className="cancel">Cancel</button></td>
          </tr>
          <tr>
            <td><button>Approved</button></td>
            <td>15/01/2024</td>
            <td>Full Day</td>
            <td>15/01/2024</td>
            <td>Full Day</td>
            <td>1</td>
            <td>Casual Leave</td>
            <td></td>
            <td><button className="cancel">Cancel</button></td>
          </tr>
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
