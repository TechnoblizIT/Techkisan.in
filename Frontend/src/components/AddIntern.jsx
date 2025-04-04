import React, { useState ,useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import '../styles/AddIntern.css';
import { Link } from "react-router-dom";
import avatarImage from '../assets/avtar.png';
import uploadImage from '../assets/upload.png';
import axios from 'axios';
import APIEndpoints  from "./endPoints"
import { jwtDecode } from 'jwt-decode';


const AddInterns = () => {
  const Endpoints= new APIEndpoints()
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        navigate('/admin-login'); 
        return;
      }

      const decode = jwtDecode(token); 
      if (decode.role !== 'admin') {
        navigate('/admin-login'); 
        return;
      }
    } catch (err) {
      console.error('Error in admin dashboard:', err.message || 'Server error');
    }
  }, [navigate]); 
  const [Image, setImage] = useState(null);
  
  const handleFileChange = (e) => {
    setImage(e.target.files[0]); 
  };
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    employeeId: '',
    email: '',
    internType: '',
    internStatus: '',
    endDate: '',
    dateOfHire: '',
    department: '',
    jobTitle: '',
    location: '',
    reportingTo: '',
    source: '',
    payRate: '',
    bloodGroup: '',
    spouseName: '',
    fatherName: '',
    motherName: '',
    mobile: '',
    phone: '',
    otherEmail: '',
    dob: '',
    nationality: '',
    gender: '',
    maritalStatus: '',
    drivingLicence: '',
    address1: '',
    address2: '',
    city: '',
    country: '',
    state: '',
    postalCode: '',
    biography: '',
    welcomeEmail: false,
    loginDetails: false,
    Image:null,
  });
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const submitFormData = new FormData(); 

    Object.keys(formData).forEach((key) => {
      submitFormData.append(key, formData[key]);
    });

   
    if (Image) {
      submitFormData.append('Image', Image);
    }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(Endpoints.INTERN_CREATE, submitFormData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        
      });
      console.log(response.status)
      if (response.status === 200) {
        navigate('/admin-dashboard');
        console.log("Employee added successfully!");
      }
    } catch (error) {
      console.error("There was an error adding the employee!", error);
    }
  };
  const handleCheckboxChange = () => {
    setShowAdvancedFields(!showAdvancedFields);
  };

  const handleCloseWorkForm = () => {
    setShowAdvancedFields(false);
  };
  
  return (
    <div className='add-interns'>
      <header>
        <h1>New Intern</h1>
         <Link to="/admin-dashboard" className="close-btn">X</Link>
      </header>
      <div className="container">
        <div className="content-section">
          <div className="photo-section">
            <div className="image-box">
            <img src={Image ? URL.createObjectURL(Image) : avatarImage} width="150px" alt="Avatar" />
            </div>
            <button className="upload-btn">
              <img src={uploadImage} width="15px" height="15px" alt="Upload" />
              <label for="input-file">Upload Image</label>
              <input type="file" id="input-file" onChange={handleFileChange}></input>
            </button>
          </div>
          <div className="form-box">
            <form className="intern-form" onSubmit={handleSubmit} >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first-name">First Name</label>
                  <input type="text" id="first-name" name="firstName" value={formData.firstName} onChange={handleChange}></input>
                </div>
                <div className="form-group">
                  <label htmlFor="middle-name">Middle Name</label>
                  <input type="text" id="middle-name" name="middleName" value={formData.middleName} onChange={handleChange} ></input>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="last-name">Last Name</label>
                  <input type="text" id="last-name" name="lastName"  value={formData.lastName} onChange={handleChange} ></input>
                </div>
                <div className="form-group">
                  <label htmlFor="intern-id">Intern ID</label>
                  <input type="text" id="intern-id" name="employeeId"  value={formData.employeeId} onChange={handleChange} ></input>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}></input>
                </div>
                <div className="form-group">
                  <label htmlFor="intern-type">Intern Type</label>
                  <select id="intern-type" name="internType" value={formData.internType} onChange={handleChange}>
                    <option value="" disabled selected>- Select -</option>
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="intern-status">Intern Status</label>
                  <select id="intern-status" name="internStatus" value={formData.internStatus} onChange={handleChange}>
                    <option value="" disabled selected>- Select -</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="end-date">Intern End Date</label>
                  <input type="date" id="end-date" name="endDate" value={formData.endDate} onChange={handleChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date-of-hire">Date of Hire</label>
                  <input type="date" id="date-of-hire" name="dateOfHire" value={formData.dateOfHire} onChange={handleChange} />
                </div>
              </div>
              <div className="form-row advanced">
                <label>
                  <input className='check-box' type="checkbox" id="show-advanced" name="show-advanced" checked={showAdvancedFields} onChange={handleCheckboxChange} />
                  Show Advanced Fields
                </label>
              </div>

              {showAdvancedFields && (
                <div className="work">
                  <h2>Work</h2>
                  <hr className='section-line'></hr>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="department">Department</label>
                      <select id="department" name="department" value={formData.department} onChange={handleChange}>
                        <option value="" disabled selected>- Select Department -</option>
                        <option value="hr">HR</option>
                        <option value="finance">Finance</option>
                        <option value="engineering">Engineering</option>
                        <option value="marketing">Marketing</option>
                        <option value="sales">Sales</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="job-title">Job Title</label>
                      <select id="job-title" name="jobTitle" value={formData.jobTitle} onChange={handleChange}>
                        <option value="" disabled selected>- Select Job Title -</option>
                        <option value="developer">Developer</option>
                        <option value="analyst">Analyst</option>
                        <option value="consultant">Consultant</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="location">Location</label>
                      <select id="location" name="location" value={formData.location} onChange={handleChange}>
                        <option value="" disabled selected>Main Location</option>
                        <option value="new-york">New York</option>
                        <option value="san-francisco">San Francisco</option>
                        <option value="chicago">Chicago</option>
                        <option value="los-angeles">Los Angeles</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="reporting-to">Reporting To</label>
                      <select id="reporting-to" name="reportingTo" value={formData.reportingTo} onChange={handleChange}> 
                        <option value="" disabled selected>- Select Employee -</option>
                        <option value="john-doe">John Doe</option>
                        <option value="jane-smith">Jane Smith</option>
                        <option value="bob-johnson">Bob Johnson</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="source">Source of Hire</label>
                      <select id="source" name="source" value={formData.source} onChange={handleChange}>
                        <option value="" disabled selected>- Select -</option>
                        <option value="referral">Referral</option>
                        <option value="job-board">Job Board</option>
                        <option value="social-media">Social Media</option>
                        <option value="career-fair">Career Fair</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="pay-rate">Pay Rate</label>
                      <input type="text" id="pay-rate" name="payRate" value={formData.payRate} onChange={handleChange}></input>
                    </div>
                  </div>
                  <button type="button" className="close-work-btn" onClick={handleCloseWorkForm}>Close</button>
                </div>
              )}

         { /* Personal Details Section */ }
         <div className="personal">
                  <h2>Personal Details</h2>
                  <hr className="section-line" ></hr>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="blood-group">Blood Group</label>
                      <select id="blood-group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                        <option value="" disabled selected>- Select -</option>
                        <option value="a-positive">A+</option>
                        <option value="a-negative">A-</option>
                        <option value="b-positive">B+</option>
                        <option value="b-negative">B-</option>
                        <option value="ab-positive">AB+</option>
                        <option value="ab-negative">AB-</option>
                        <option value="o-positive">O+</option>
                        <option value="o-negative">O-</option>
                      </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="spouse-name">Spouse's Name</label>
                    <input type="text" id="spouse-name" name="spouseName" value={formData.spouseName} onChange={handleChange}></input>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="father-name">Father's Name</label>
                    <input type="text" id="father-name" name="fatherName" value={formData.fatherName} onChange={handleChange}></input>
                  </div>
                  <div className="form-group">
                    <label htmlFor="mother-name">Mother's Name</label>
                    <input type="text" id="mother-name" name="motherName" value={formData.motherName} onChange={handleChange} ></input>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="mobile">Mobile</label>
                    <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} ></input>
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}></input>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="other-email">Other Email</label>
                    <input type="email" id="other-email" name="otherEmail" value={formData.otherEmail} onChange={handleChange} ></input>
                  </div>
                  <div className="form-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} ></input>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nationality">Nationality</label>
                    <select id="nationality" name="nationality" value={formData.nationality} onChange={handleChange}>
                      <option value="" disabled selected>- Select -</option>
                      <option value="american">American</option>
                      <option value="canadian">Canadian</option>
                      <option value="british">British</option>
                      <option value="australian">Australian</option>
                      <option value="indian">Indian</option>
                      <option value="chinese">Chinese</option>
                      <option value="japanese">Japanese</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="" disabled selected>- Select -</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="marital-status">Marital Status</label>
                    <select id="marital-status" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                      <option value="" disabled selected>- Select -</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="driving-licence">Driving Licence</label>
                    <input type="text" id="driving-licence" name="drivingLicence" value={formData.drivingLicence} onChange={handleChange}></input>
                  </div>
                </div>
                <div className="address">
                <h2>Address</h2>
                <hr className='section-line'></hr>
                <div className="form-row">
        <div className="form-group">
          <label htmlFor="address-1">Address 1</label>
          <input type="text" id="address-1" name="address1" value={formData.address1} onChange={handleChange}></input>
        </div>
        <div className="form-group">
          <label htmlFor="address-2">Address 2</label>
          <input type="text" id="address-2" name="address2" value={formData.address2} onChange={handleChange} ></input>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input type="text" id="city" name="city"value={formData.city} onChange={handleChange} ></input>
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input type="text" id="country" name="country" value={formData.country} onChange={handleChange}></input>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="state">State</label>
          <input type="text" id="state" name="state" value={formData.state} onChange={handleChange}></input>
        </div>
        <div className="form-group">
          <label htmlFor="postal-code">Postal Code</label>
          <input type="text" id="postal-code" name="postalCode" value={formData.postalCode} onChange={handleChange}></input>
        </div>
      </div>
      </div>
      </div>
      <div className="biography">
                <h2>Biography</h2>
                <hr className='section-line'></hr>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="biography">Biography</label>
                    <textarea id="biography" name="biography" value={formData.biography} onChange={handleChange}></textarea>
                  </div>
                </div>
                <div className="form-row advanced">
                  <label>
                    <input className='check-box' type="checkbox" id="welcome-email" name="welcomeEmail" checked={formData.welcomeEmail} onChange={handleChange} />
                    Send Welcome Email to Employee
                  </label>
                </div>
                <div className="form-row advanced">
                  <label>
                    <input className='check-box' type="checkbox" id="login-details" name="loginDetails" checked={formData.loginDetails} onChange={handleChange}  />
                    Send Login Details to Employee
                  </label>
                </div>
              </div>
              <button className='add-intrn' type="submit">Add Intern</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddInterns;
