// src/components/AddEmployee.js
import React, { useState } from 'react';
import '../styles/AddEmployee.css';
import avatarImage from '../assets/avtar.png';
import uploadImage from '../assets/upload.png';

const AddEmployee = () => {
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  const handleCheckboxChange = () => {
    setShowAdvancedFields(!showAdvancedFields);
  };

  const handleCloseWorkForm = () => {
    setShowAdvancedFields(false);
  };
  
  return (
    <div className='add-employee'>
      <header>
        <h1>New Employee</h1>
        <button className="close-btn">X</button>
      </header>
      <div className="container">
        <div className="content-section">
          <div className="photo-section">
            <div className="image-box">
              <img src={avatarImage} width="150px" alt="Avatar" />
            </div>
            <button className="upload-btn">
              <img src={uploadImage} width="15px" height="15px" alt="Upload" />
              <label for="input-file">Upload Image</label>
              <input type="file" id="input-file"></input>
            </button>
          </div>
          <div className="form-box">
            <form className="employee-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first-name">First Name</label>
                  <input type="text" id="first-name" name="first-name" ></input>
                </div>
                <div className="form-group">
                  <label htmlFor="middle-name">Middle Name</label>
                  <input type="text" id="middle-name" name="middle-name" ></input>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="last-name">Last Name</label>
                  <input type="text" id="last-name" name="last-name" ></input>
                </div>
                <div className="form-group">
                  <label htmlFor="employee-id">Employee ID</label>
                  <input type="text" id="employee-id" name="employee-id" ></input>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" ></input>
                </div>
                <div className="form-group">
                  <label htmlFor="employee-type">Employee Type</label>
                  <select id="employee-type" name="employee-type">
                    <option value="" disabled selected>- Select -</option>
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="employee-status">Employee Status</label>
                  <select id="employee-status" name="employee-status">
                    <option value="" disabled selected>- Select -</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="end-date">Employee End Date</label>
                  <input type="date" id="end-date" name="end-date" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date-of-hire">Date of Hire</label>
                  <input type="date" id="date-of-hire" name="date-of-hire" />
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
                      <select id="department" name="department">
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
                      <select id="job-title" name="job-title">
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
                      <label htmlFor="location">Location</label>
                      <select id="location" name="location">
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
                      <select id="source" name="source">
                        <option value="" disabled selected>- Select -</option>
                        <option value="referral">Referral</option>
                        <option value="job-board">Job Board</option>
                        <option value="social-media">Social Media</option>
                        <option value="career-fair">Career Fair</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="pay-rate">Pay Rate</label>
                      <input type="text" id="pay-rate" name="pay-rate" ></input>
                    </div>
                  </div>
                  <button type="button" className="close-work-btn" onClick={handleCloseWorkForm}>Close</button>
                </div>
              )}

         { /* Personal Details Section */ }
                <div className="personal-details">
                  <h2>Personal Details</h2>
                  <hr className="section-line" ></hr>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="blood-group">Blood Group</label>
                      <select id="blood-group" name="blood-group">
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
                    <input type="text" id="spouse-name" name="spouse-name" ></input>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="father-name">Father's Name</label>
                    <input type="text" id="father-name" name="father-name" ></input>
                  </div>
                  <div className="form-group">
                    <label htmlFor="mother-name">Mother's Name</label>
                    <input type="text" id="mother-name" name="mother-name" ></input>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="mobile">Mobile</label>
                    <input type="tel" id="mobile" name="mobile" ></input>
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" ></input>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="other-email">Other Email</label>
                    <input type="email" id="other-email" name="other-email" ></input>
                  </div>
                  <div className="form-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <input type="date" id="dob" name="dob" ></input>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nationality">Nationality</label>
                    <select id="nationality" name="nationality">
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
                    <select id="gender" name="gender">
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
                    <select id="marital-status" name="marital-status">
                      <option value="" disabled selected>- Select -</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="driving-licence">Driving Licence</label>
                    <input type="text" id="driving-licence" name="driving-licence" ></input>
                  </div>
                </div>
                <div className="form-row">
        <div className="form-group">
          <label htmlFor="address-1">Address 1</label>
          <input type="text" id="address-1" name="address-1" ></input>
        </div>
        <div className="form-group">
          <label htmlFor="address-2">Address 2</label>
          <input type="text" id="address-2" name="address-2" ></input>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input type="text" id="city" name="city" ></input>
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input type="text" id="country" name="country" ></input>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="state">Province/State</label>
          <input type="text" id="state" name="state" ></input>
        </div>
        <div className="form-group">
          <label htmlFor="postal-code">Post Code/Zip Code</label>
          <input type="text" id="postal-code" name="postal-code" ></input>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="biography">Biography</label>
          <textarea id="biography" name="biography"></textarea>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <div className="notification-container">
            <label className="notification-heading">Notification</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input className='check-box' type="checkbox" id="welcome-email" name="welcome-email" ></input>
                Send the employee a welcome email
              </label>
              <label className="checkbox-label">
                <input className='check-box' type="checkbox" id="login-details" name="login-details" ></input>
                Send the login details as well.
              </label>
            </div>
              </div>
              </div>
              </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <footer>
        <button className="create-btn">Create Employee</button>
      </footer>
    </div>
  );
}

export default AddEmployee;
