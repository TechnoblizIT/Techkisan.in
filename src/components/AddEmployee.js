// src/components/AddEmployee.js
import React from 'react';
import '../styles/AddEmployee.css';

function AddEmployee() {
  return (
    <div className="add-employee-page">
      <header>
        <h1>Techkisan Automation</h1>
        <h2>Trusted Brand</h2>
        <p>The Service You Need!</p>
      </header>
      <main>
        <h3>Add Employee</h3>
        <form>
          <div className="form-group">
            <label htmlFor="employee-name">Name:</label>
            <input type="text" id="employee-name" name="employee-name" required />
          </div>
          <div className="form-group">
            <label htmlFor="employee-email">Email:</label>
            <input type="email" id="employee-email" name="employee-email" required />
          </div>
          <div className="form-group">
            <label htmlFor="employee-role">Role:</label>
            <input type="text" id="employee-role" name="employee-role" required />
          </div>
          <button type="submit">Add Employee</button>
        </form>
      </main>
    </div>
  );
}

export default AddEmployee;
