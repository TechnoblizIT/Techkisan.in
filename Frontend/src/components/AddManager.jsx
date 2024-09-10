import React, { useState } from 'react';
import '../styles/AddManager.css';
import avatarImage from '../assets/avtar.png';
import uploadImage from '../assets/upload.png';
import { useNavigate} from 'react-router-dom';
const AddManager = () => {
  const navigate = useNavigate();
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [Image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    managerId: '',
    email: '',
    managerType: '',
    managerStatus: '',
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
  });

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Store the file in state
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCheckboxChange = () => {
    setShowAdvancedFields(!showAdvancedFields);
  };

  const handleCloseWorkForm = () => {
    setShowAdvancedFields(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/manager/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        navigate("/")
        alert('Manager added successfully');
      } else {
        alert('Failed to add manager');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
  return (
    <div className='add-manager'>
      <header>
        <h1>New Manager</h1>
        <button className="close-btn">X</button>
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
            <form className="manager-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first-name" >First Name</label>
                  <input type="text" id="first-name" name="firstName"  value={formData.firstName} onChange={handleInputChange}></input>
                </div>
                <div className="form-group">
                  <label htmlFor="middle-name">Middle Name</label>
                  <input type="text" id="middle-name" name="middleName" value={formData.middleName} onChange={handleInputChange} ></input>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="last-name">Last Name</label>
                  <input type="text" id="last-name" name="lastName" value={formData.lastName} onChange={handleInputChange} ></input>
                </div>
                <div className="form-group">
                  <label htmlFor="manager-id">Manager ID</label>
                  <input type="text" id="manager-id" name="managerId" value={formData.managerId} onChange={handleInputChange} ></input>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} ></input>
                </div>
                <div className="form-group">
                  <label htmlFor="manager-type">Manager Type</label>
                  <select id="manager-type" name="managerType" value={formData.managerType} onChange={handleInputChange}>
                    <option value="" disabled selected>- Select -</option>
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="manager-status">Manager Status</label>
                  <select id="manager-status" name="managerStatus" value={formData.managerStatus} onChange={handleInputChange}>
                    <option value="" disabled selected>- Select -</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="end-date">Manager End Date</label>
                  <input type="date" id="end-date" name="endDate" value={formData.endDate} onChange={handleInputChange}/>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date-of-hire" >Date of Hire</label>
                  <input type="date" id="date-of-hire" name="datOfHire" value={formData.dateOfHire} onChange={handleInputChange}/>
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
                      <select id="department" name="department" value={formData.department} onChange={handleInputChange}>
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
                      <select id="job-title" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange}>
                        <option value="" disabled selected>- Select Job Title -</option>
                        <option value="manager">Manager</option>
                        <option value="developer">Developer</option>
                        <option value="analyst">Analyst</option>
                        <option value="consultant">Consultant</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="location" >Location</label>
                      <select id="location" name="location" value={formData.location} onChange={handleInputChange}>
                        <option value="" disabled selected>Main Location</option>
                        <option value="new-york">New York</option>
                        <option value="san-francisco">San Francisco</option>
                        <option value="chicago">Chicago</option>
                        <option value="los-angeles">Los Angeles</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="reporting-to">Reporting To</label>
                      <select id="reporting-to" name="reporting-to">
                        <option value="" disabled selected>- Select Manager -</option>
                        <option value="john-doe">John Doe</option>
                        <option value="jane-smith">Jane Smith</option>
                        <option value="bob-johnson">Bob Johnson</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="source">Source of Hire</label>
                      <select id="source" name="source" value={formData.source} onChange={handleInputChange}>
                        <option value="" disabled selected>- Select -</option>
                        <option value="referral">Referral</option>
                        <option value="job-board">Job Board</option>
                        <option value="social-media">Social Media</option>
                        <option value="career-fair">Career Fair</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="pay-rate">Pay Rate</label>
                      <input type="text" id="pay-rate" name="payRate" value={formData.payRate} onChange={handleInputChange}></input>
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
                      <select id="blood-group" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange}>
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
                    <input type="text" id="spouse-name" name="spouseName" value={formData.spouseName} onChange={handleInputChange}></input>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="father-name">Father's Name</label>
                    <input type="text" id="father-name" name="fatherName" value={formData.fatherName} onChange={handleInputChange} ></input>
                  </div>
                  <div className="form-group">
                    <label htmlFor="mother-name">Mother's Name</label>
                    <input type="text" id="mother-name" name="motherName" value={formData.motherName} onChange={handleInputChange} ></input>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="mobile" >Mobile</label>
                    <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} ></input>
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange}></input>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="other-email">Other Email</label>
                    <input type="email" id="other-email" name="otherEmail" value={formData.otherEmail} onChange={handleInputChange}></input>
                  </div>
                  <div className="form-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleInputChange}></input>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nationality">Nationality</label>
                    <select id="nationality" name="nationality" value={formData.nationality} onChange={handleInputChange}>
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
                    <label htmlFor="gender" >Gender</label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange}>
                      <option value="" disabled selected>- Select -</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="marital-status" >Marital Status</label>
                    <select id="marital-status" name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange}>
                      <option value="" disabled selected>- Select -</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="driving-licence">Driving Licence</label>
                    <input type="text" id="driving-licence" name="drivingLicence" value={formData.drivingLicence} onChange={handleInputChange} ></input>
                  </div>
                </div>
                <div className="address">
                <h2>Address</h2>
                <hr className='section-line'></hr>
                <div className="form-row">
        <div className="form-group">
          <label htmlFor="address-1">Address 1</label>
          <input type="text" id="address-1" name="address1" value={formData.address1} onChange={handleInputChange} ></input>
        </div>
        <div className="form-group">
          <label htmlFor="address-2">Address 2</label>
          <input type="text" id="address-2" name="address2" value={formData.address2} onChange={handleInputChange}></input>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} ></input>
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input type="text" id="country" name="country" value={formData.country} onChange={handleInputChange}></input>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="state">State</label>
          <input type="text" id="state" name="state" value={formData.state} onChange={handleInputChange}></input>
        </div>
        <div className="form-group">
          <label htmlFor="postal-code">Postal Code</label>
          <input type="text" id="postal-code" name="postalCode" value={formData.postalCode} onChange={handleInputChange} ></input>
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
                    <textarea id="biography" name="biography" value={formData.biography} onChange={handleInputChange}></textarea>
                  </div>
                </div>
                <div className="form-row advanced">
                  <label>
                    <input className='check-box' type="checkbox" id="welcome-email" name="welcomeEmail" />
                    Send Welcome Email to Employee
                  </label>
                </div>
                <div className="form-row advanced">
                  <label>
                    <input className='check-box' type="checkbox" id="login-details" name="loginDetails"  />
                    Send Login Details to Employee
                  </label>
                </div>
              </div>
              <button className='add-mngr' type="submit">Add Manager</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddManager;
