// src/components/EmployeeDashboard.js
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
  const [avatarUrl, setAvatarUrl] = useState(null);
  const navigate = useNavigate();
  console.log((avatarUrl));
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
          const data = response.data;
          setemployeedata(data)
         console.log(data);
          if(data.Image){
            if (data.Image && data.Image.data) {
              const binaryString = new Uint8Array(data.Image.data).reduce((acc, byte) => acc + String.fromCharCode(byte), '');
              const base64String = btoa(binaryString);
              const imageUrl = `data:${data.ImageType};base64,${base64String}`;
              setAvatarUrl(imageUrl);
              console.log("Avatar URL: ", imageUrl);
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

  
  return (
    <>
      <NavigationBar />
      <div className="dashboard-container">
        <div className="left-side">
          <div className="profile-section">
          {avatarUrl ? (
              <img src={avatarUrl}  alt="Profile" className="profile-image" />
            ) : (
              <img src={profileimg}  alt="Profile" className="profile-image" />
            )}
            <h2 className="employee-name">{employeedata ? employeedata.firstName+employeedata.lastName : 'Loading...'}</h2>
            <p className="employee-role">{employeedata ? employeedata.jobTitle : 'Loading'}</p>
            <div className="work-duration">
              <p> At work for: {diffInYears} year{diffInYears !== 1 && 's'} {diffInMonths} month{diffInMonths !== 1 && 's'} {diffInDays} day{diffInDays !== 1 && 's'}</p>
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
    </>
  );
}

export default EmployeeDashboard;

