// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './components/LoginPage';
import ChangePassword from './components/ChangePassword';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';
import AddEmployee from './components/AddEmployee';
import AddManager from './components/AddManager';
import AddInterns from './components/AddIntern';
import UpdateEmployeeForm from './components/UpdateEmployeeForm';
import ManagerDashboard from './components/ManagerDashboard';
import InternDashboard from './components/InternDashboard';
import {APIEndpoints} from "./components/endPoints"
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/add-manager" element={<AddManager />} />
          <Route path="/add-intern" element={<AddInterns />} />
          <Route path="/update-employee" element={<UpdateEmployeeForm />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/intern-dashboard" element={<InternDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
