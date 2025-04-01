import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
// import { BrowserRouter as Router } from 'react-router-dom';
import "../styles/AdminDashboard.css";
import avatarImage from "../assets/avtar.png";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useReactToPrint } from "react-to-print";
import logo from "../assets/logo1.png";
import { useNavigate } from "react-router-dom";
import APIEndpoints from "./endPoints";
import barcode from "../assets/invoice/barcode.png";
import signature from "../assets/invoice/signature.png";
import paymenticons from "../assets/invoice/paymenticons.png";
import { Buffer } from "buffer";
import html2pdf from "html2pdf.js";


// function getCookie(name) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
// }
const AdminDashboard = ({ handleMenuClick }) => {
  const Endpoints = new APIEndpoints();
  const [activeSection, setActiveSection] = useState("HR");
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const [activePage, setActivePage] = useState("Overview");
   const[allInvoices, setAllInvoices] = useState([])
  const [menuOpen, setMenuOpen] = useState(false);
  const [topMenuOpen, setTopMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [partyName, setPartyName] = useState("")
  const [issueDate, setIssueDate] = useState(formatDate(new Date()))
  const [partyName2, setPartyName2] = useState("")
  const [issueDate2, setIssueDate2] = useState(formatDate(new Date()))
  const [employeecount, setEmployeecount] = useState(0);
  const [internCount, setInternCount] = useState(0);
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Track active button
  const currentDate=new Date(Date.now);
  const[success,setSuccess] = useState("")
  
  //-------------------------------------start-invoice setup---------------------------------------------//

  const componentRef = useRef();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [taxInvoiceNumber, setTaxInvoiceNumber] = useState("")
  const [isSaved, setIsSaved] = useState(false);
  const [taxType, setTaxType] = useState("GST");
  const [showDropdown, setShowDropdown] = useState(false);
  const [noTaxRows, setNoTaxRows] = useState(
    Array(4).fill({ desc: "", hsn: "", qty: "", rate: "", amount: "" })
  );
  const [taxRows, setTaxRows] = useState(
    Array(3).fill({ desc: "", hsn: "", qty: "", rate: "", amount: "" })
  );
  const handleDeleteInvoives=async(Invoice_id)=>{
    try{
    await axios.delete(`${Endpoints.ADMIN_DELETE_INVOICE}/${Invoice_id}`);
    setAllInvoices(allInvoices.filter((invoice) => invoice._id !== Invoice_id));
  } catch (error) {
    console.error("Error deleting Invoice:", error.message);
  }
  }
  
  // Handle changes in the No-Tax Invoice Table
  const handleNoTaxChange = (index, field, value) => {
    const updatedRows = [...noTaxRows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
  
    const qty = parseFloat(updatedRows[index].qty);
    const rate = parseFloat(updatedRows[index].rate);
  
    updatedRows[index].amount = !qty || !rate ? "" : (qty * rate).toFixed(2);
  
    setNoTaxRows(updatedRows);
  };

  
  // Handle changes in the Tax Invoice Table
  const handleTaxChange = (index, field, value) => {
    const updatedRows = [...taxRows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
  
    const qty = parseFloat(updatedRows[index].qty);
    const rate = parseFloat(updatedRows[index].rate);
  
    updatedRows[index].amount = !qty || !rate ? "" : (qty * rate).toFixed(2);
  
    setTaxRows(updatedRows);
  };
;
  
  useEffect(() => {
    const fetchAllIvoices = async() =>{
      try {
        const response = await axios.get(Endpoints.ADMIN_FETCH_ALL_INVOICES);
        setAllInvoices(response.data);
      } catch (error) {
        console.error("Error fetching all invoices:", error);
      }
    }
    const fetchInvoiceNumber = async () => {
      try {
        const response = await axios.get(Endpoints.ADMIN_FETCH_LATEST_NOTAXINVOICE_ID);
        setInvoiceNumber(response.data.invoiceNumber || "TKN-INV-00");
      } catch (error) {
        console.error("Error fetching invoice number:", error);
      }
    };
    const fetchTaxInvoiceNumber = async () => {
      try {
        const response = await axios.get(Endpoints.ADMIN_FETCH_LATEST_TAXINVOICE_ID);
        setTaxInvoiceNumber(response.data.invoiceNumber || "TKN-TI-00");
      } catch (error) {
        console.error("Error fetching tax invoice number:", error);
      }
    };
    fetchAllIvoices()
    fetchInvoiceNumber();
    fetchTaxInvoiceNumber();
  }, []);


  const handleNoTaxKeyPress = (index, field, event) => {
    if (event.key === "Enter" && field === "rate") {
      event.preventDefault(); // Prevents default Enter key action
  
      setNoTaxRows((prevRows) => {
        const newRows = [
          ...prevRows,
          { desc: "", hsn: "", qty: "", rate: "", amount: "" },
        ];
  
        // Ensure React updates first
        setTimeout(() => {
          requestAnimationFrame(() => {
            const nextRowInput = document.querySelector(
              `textarea[data-no-tax-index="${index + 1}"]`
            );
            if (nextRowInput) nextRowInput.focus();
          });
        }, 50);
  
        return newRows;
      });
    }
  
  
    if (event.key === "Backspace" && field === "desc" && index !== 0) {
      if (
        !noTaxRows[index].desc &&
        !noTaxRows[index].hsn &&
        !noTaxRows[index].qty &&
        !noTaxRows[index].rate
      ) {
        setNoTaxRows((prevRows) => {
          const updatedRows = prevRows.filter((_, i) => i !== index);
    
          // Focus on the previous row's desc textarea
          setTimeout(() => {
            const prevRowInput = document.querySelector(
              `textarea[data-no-tax-index="${index - 1}"]`
            );
            if (prevRowInput) prevRowInput.focus();
          }, 100);
    
          return updatedRows;
        });
      }
    }
    
  };
  
  
  const handleTaxKeyPress = (index, field, event) => {
    if (event.key === "Enter" && field === "rate") {
      event.preventDefault(); // Prevent default enter key action
  
      setTaxRows((prevRows) => {
        const newRows = [
          ...prevRows,
          { desc: "", hsn: "", qty: "", rate: "", amount: "" },
        ];
  
        // Wait for React to render and then focus
        setTimeout(() => {
          requestAnimationFrame(() => {
            const nextRowInput = document.querySelector(
              `textarea[data-tax-index="${index + 1}"]`
            );
            if (nextRowInput) nextRowInput.focus();
          });
        }, 50);
  
        return newRows;
      });
    }
  
    if (event.key === "Backspace" && field === "desc" && index !== 0) {
      if (
        !taxRows[index].desc &&
        !taxRows[index].hsn &&
        !taxRows[index].qty &&
        !taxRows[index].rate
      ) {
        setTaxRows((prevRows) => {
          const updatedRows = prevRows.filter((_, i) => i !== index);
    
          // Focus on the previous row's desc textarea
          setTimeout(() => {
            const prevRowInput = document.querySelector(
              `textarea[data-tax-index="${index - 1}"]`
            );
            if (prevRowInput) prevRowInput.focus();
          }, 100);
    
          return updatedRows;
        });
      }
    }    
  };
  

  const numberToWords = (num) => {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const convertToWords = (n) => {
      if (n === 0) return "Zero";
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + " " + a[n % 10];
      if (n < 1000)
        return a[Math.floor(n / 100)] + " Hundred " + convertToWords(n % 100);
      if (n < 100000)
        return (
          convertToWords(Math.floor(n / 1000)) +
          " Thousand " +
          convertToWords(n % 1000)
        );
      if (n < 10000000)
        return (
          convertToWords(Math.floor(n / 100000)) +
          " Lakh " +
          convertToWords(n % 100000)
        );
      return (
        convertToWords(Math.floor(n / 10000000)) +
        " Crore " +
        convertToWords(n % 10000000)
      );
    };

    return convertToWords(num).trim();
  };

  const noTaxTotalAmount = noTaxRows.reduce(
    (sum, row) => sum + parseFloat(row.amount || 0),
    0
  );
  
  const taxTotalAmount = taxRows.reduce(
    (sum, row) => sum + parseFloat(row.amount || 0),
    0
  );
  

  //------Tax--------//
  const gstAmount = taxTotalAmount * 0.18;
  const cgstSgstAmount = taxTotalAmount * 0.09;
  const taxRoundedTotal = Math.floor(taxTotalAmount + gstAmount);
  const taxRoundOff = taxRoundedTotal - (taxTotalAmount + gstAmount);
  const taxTotalInWords =numberToWords(taxRoundedTotal);
  //------NoTax--------//
  const noTaxFinalTotal = Math.floor(noTaxTotalAmount);
  const noTaxRoundOff = noTaxFinalTotal - noTaxTotalAmount;
  const noTaxTotalInWords = numberToWords(noTaxFinalTotal);

  //---------------------------------------end-invoice setup----------------------------------------------//

  const handleItemClick = (item) => {
    setActiveItem(item); // Set active page
    setIsMenuOpen(false); // Close menu on mobile after click
  };

  const sections = [
    "HR",
    "Sales/Purchase",
    "Accounting",
    "Company",
    "Tools",
    "Modules",
    "Add-Ons",
    "Setting",
    "Logout",
  ];
  const hrLinks = [
    "Overview",
    "Employees",
    "Departments",
    "Designation",
    "Announcement",
    "Reports",
    "Management",
    "Help",
  ];
  const handlePost = async () => {
    if (!message.trim()) return alert("Please write an announcement!");
    try {
      await axios.post(Endpoints.ADMIN_ADD_ANNOUNCEMENT, { message });
      setMessage(""); // Clear input after posting
      setAnnouncements([
        ...announcements,
        { message, date: formatDate(new Date.now()) },
      ]);
    } catch (error) {
      console.error("Error posting announcement:", error);
    }
  };

  // handle delete for employee page
  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`${Endpoints.ADMIN_DELETE_EMPLOYEE}/${id}`);

      // Update the state after successful deletion
      setEmployees(employees.filter((employee) => employee._id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  // Handle delete for announcement page
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${Endpoints.ADMIN_DELETE_ANNOUNCEMENT}/${id}`);
      setAnnouncements(
        announcements.filter((announcement) => announcement._id !== id)
      );
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setActivePage("");
    setTopMenuOpen(isMobile && section === "HR" ? false : true);
    setMenuOpen(false);
  };

  const handleLinkClick = (link) => {
    setActivePage(link);
    setTopMenuOpen(false);
  };



  //---------------------------------------------------------------------------------------------//

  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted components

    // ✅ Move async function inside useEffect
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/admin-login");
          return;
        }

        const decode = jwtDecode(token);
        if (decode.role !== "admin") {
          navigate("/admin-login");
          return;
        }

        // Fetch data only if component is mounted
        const response = await axios.get(Endpoints.ADMIN_DASHBOARD, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (isMounted) {
          console.log(response.data);
          setEmployeecount(response.data.employeeCount);
          setInternCount(response.data.internCount);
          setEmployees(response.data.employee);
          setAnnouncements(response.data.Announcement);
          setAllInvoices(response.data.allInvoices);
        }
      } catch (err) {
        console.error(
          "Error in admin dashboard:",
          err.message || "Server error"
        );
      }
    };

    fetchData(); // Call the async function

    const handleResize = () => {
      if (isMounted) setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      isMounted = false; // Prevent updates on unmounted component
      window.removeEventListener("resize", handleResize); // ✅ Proper cleanup
    };
  }, [navigate]);

  // -----------------------------------------------------------------------------------------------------------//

  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };


    // Function to print the invoice
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      
      onAfterPrint: () =>{window.location.reload();}
    });
//  tax invoice handler 
    const handleSaveTax = async (event) => {
      event.preventDefault();
      const invoiceElement = componentRef.current;
      const newInvoiceNumber = taxInvoiceNumber    
      try {
        // Convert HTML to PDF
        const pdfBlob = await html2pdf()
          .from(invoiceElement)
          .set({
            margin: 10,
            filename: `Invoice_${newInvoiceNumber}.pdf`,
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 3, useCORS: true, letterRendering: true, scrollY: 0 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          })
          .outputPdf("blob");
    
        // Create FormData to send the PDF file
        const formData = new FormData();
        formData.append("invoiceNumber", newInvoiceNumber);
        formData.append("invoicePDF", pdfBlob, `Invoice_${newInvoiceNumber}.pdf`);
        formData.append("PartyName",partyName)
        formData.append("DateofIssue", issueDate)
    
        // Send PDF to backend
        const response = await axios.post(Endpoints.ADMIN_SAVE_TAXINVOICE, formData, {
          headers: { "Content-Type": "multipart/form-data" }, // Important for sending files
        });
    
        if (response.data.message === "Invoice saved successfully") {
          setInvoiceNumber(newInvoiceNumber);
          setSuccess(response.data.message)
          setIsSaved(true);
        }
      } catch (error) {
        console.error("Error saving invoice:", error);
      }
    };
    //  No tax invoice handler
  const handleSave = async (event) => {
    event.preventDefault();
    const invoiceElement = componentRef.current;
    const newInvoiceNumber = invoiceNumber
  
    try {
      // Convert HTML to PDF
      const pdfBlob = await html2pdf()
        .from(invoiceElement)
        .set({
          margin: 10,
          filename: `Invoice_${newInvoiceNumber}.pdf`,
          image: { type: "jpeg", quality: 1 },
          html2canvas: { scale: 3, useCORS: true, letterRendering: true, scrollY: 0 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .outputPdf("blob");
  
      // Create FormData to send the PDF file
      const formData = new FormData();
      formData.append("invoiceNumber", newInvoiceNumber);
      formData.append("invoicePDF", pdfBlob, `Invoice_${newInvoiceNumber}.pdf`);
      formData.append("PartyName",partyName2)
      formData.append("DateofIssue", issueDate2)
  
      // Send PDF to backend
      const response = await axios.post(Endpoints.ADMIN_SAVE_NOTAXINVOICE, formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Important for sending files
      });
  
      if (response.data.message === "Invoice saved successfully") {
        setInvoiceNumber(newInvoiceNumber);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };
  
  
  const handleQuit = () => {
    // Logic to handle quit action
    console.log("Quit action triggered");
  };

  const handleDownload = async (invoiceId, invoiceNumber) => {
    try {
      const response = await fetch(`${Endpoints.DOWNLOAD_INVOICE}/${invoiceId}`);
  
      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
  
      a.href = url;
      a.download = `Invoice_${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };
  

  // State to track the active item
  const [activeItem, setActiveItem] = useState("add-account");

  // employee page-------------------------------------------------------------------------------
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@123",
      mobile: "9876543210",
      department: "IT",
      designation: "Software Engineer",
      joiningDate: "2022-05-15",
      assignManager: "David",
      email: "john@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@123",
      mobile: "9123456789",
      department: "HR",
      designation: "HR Manager",
      joiningDate: "2021-08-20",
      assignManager: "Sophia",
      email: "jane@example.com",
    },
    {
      id: 3,
      name: "Robert Brown",
      email: "robert@123",
      mobile: "9786541230",
      department: "Marketing",
      designation: "Marketing Lead",
      joiningDate: "2020-11-10",
      assignManager: "Michael",
      email: "robert@example.com",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  //  Search filter function
  // const filteredEmployees = employees.filter(
  //   (emp) =>
  //     emp?.id.toString().includes(searchQuery) ||
  //     emp?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     emp?.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     emp?.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     emp?.joiningDate.includes(searchQuery) ||
  //     emp?.assignManager.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  const printRef = useRef();

  const handlePrint2 = useReactToPrint({
    content: () => printRef.current,
  });

  // -----------------------------------------------------------------------------------------------------------//

  return (
    <div className="admindashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${menuOpen ? "menu-open" : ""}`}>
        <div className="head-menu">
          <h2>Dashboard</h2>
          <button className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>

        <ul>
          {sections.map((section) => (
            <li
              key={section}
              onClick={() => handleSectionClick(section)}
              className={activeSection === section ? "active" : ""}
            >
              {section}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navbar when HR is clicked */}
        {activeSection === "HR" && (
          <div className="top-navbar">
            <div className="navbar-left">
              <i className="fa-solid fa-users"></i>
              <h3>HR</h3>
            </div>
            <div className="navbar-right">
              <button
                className="topmenu-icon"
                onClick={() => setTopMenuOpen(!topMenuOpen)}
              >
                {topMenuOpen ? "✖" : "☰"}
              </button>
              {(isMobile && topMenuOpen) || !isMobile ? (
                <ul className={`hr-links ${topMenuOpen ? "show-links" : ""}`}>
                  {hrLinks.map((link) => (
                    <li
                      key={link}
                      onClick={() => handleLinkClick(link)}
                      className={activePage === link ? "active" : ""}
                    >
                      {link}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="page-content">
          {/* Overview page */}
          {activeSection === "HR" && activePage === "Overview" && (
            <div id="overview" className="overview-section">
              <h1>HR Management</h1>
              <div className="sections-wrapper">
                <div className="left-section">
                  <div className="info-overview">
                    <div className="info-block">
                      <h1>{employeecount ? employeecount : 0}</h1>
                      <h2>Employee</h2>
                      <Link className="view-link" to="#">
                        View Employees
                      </Link>
                    </div>
                    <div className="info-block">
                      <h1>{internCount ? internCount : 0}</h1>
                      <h2>Interns</h2>
                      <Link className="view-link" to="#">
                        View Intern
                      </Link>
                    </div>
                    <div className="info-block">
                      <h1>13</h1>
                      <h2>Department</h2>
                      <Link className="view-link" to="#">
                        View Department
                      </Link>
                    </div>
                  </div>
                  {/* Latest Announcement Section */}
                  <div className="latest-announcement">
                    <h3>
                      <i className="fa-solid fa-microphone"></i> Latest
                      Announcement
                    </h3>
                    <hr />
                    <div className="announcements">
                  {announcements.map((announcement, index) => (
                    <div key={index} className="announcement-content">
                      <h1>
                        {announcement.Announcement} <span className="vertical-line"></span>
                        <span className="announcement-date">{formatDate(announcement.Date)}</span>
                      </h1>
                    
                    </div>
                  ))}
                </div>
                  </div>
                  {/* My Leave Calendar Section */}
                  <div className="leave-calendar">
                    <h3>
                      <i className="fa-regular fa-calendar"></i> My Leave
                      Calendar
                    </h3>
                    <hr />
                    <div className="calendar">
                      <p>Calendar Placeholder</p>
                    </div>
                  </div>
                </div>
                <div className="right-section">
                  {/* Birthday Buddies Block */}
                  <div className="birthday-buddies">
                    <h3>
                      <i className="fa-solid fa-cake-candles"></i> Birthday
                      Buddies
                    </h3>
                    <hr />
                    <p>Today's Birthday</p>
                    <div className="photo-upload">
                      <div className="photo-item">
                        <img src={avatarImage} alt="Avatar" />
                        <i className="fa-regular fa-envelope mail-icon"></i>
                      </div>
                      <div className="photo-item">
                        <img src={avatarImage} alt="Avatar" />
                        <i className="fa-regular fa-envelope mail-icon"></i>
                      </div>
                    </div>
                  </div>
                  {/* Who is Out Block */}
                  <div className="who-is-out">
                    <h3>
                      <i className="fa-solid fa-paper-plane"></i> Who is out
                    </h3>
                    <hr />
                    <p>This Month</p>
                    <p>Next Month</p>
                  </div>
                  {/* Attendance Status Block */}
                  <div className="attendance-status">
                    <h3>
                      <i className="fa-solid fa-chart-pie"></i> Attendance
                      Status
                    </h3>
                    <hr />
                    <p className="no-data">Not enough data</p>
                    <div className="filter">
                      <span>Filter by:</span>
                      <select>
                        <option>This Month</option>
                        <option>Next Month</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Employee page */}
          {activeSection === "HR" && activePage === "Employees" && (
            <div id="employee" className="employee-section">
              <div className="employee-row">
                <div className="employee-block">
                  <h2>Employees</h2>
                  <Link className="add-new" to="/add-employee">
                    Add New
                  </Link>
                </div>
                <div className="manager-block">
                  <h2>Managers</h2>
                  <Link className="add-new" to="/add-manager">
                    Add New
                  </Link>
                </div>
                <div className="intern-block">
                  <h2>Intern</h2>
                  <Link className="add-new" to="/add-intern">
                    Add New
                  </Link>
                </div>
              </div>

              <div className="search-employeetable">
                {/* Search Input */}
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search by ID, Name, Department, Designation, Joining Date, or Assign Manager..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-box"
                  />
                </div>

                {/* Employee Table */}
                <div className="admin-table-container">
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>EMAIL</th>
                        <th>Mobile No.</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Joining Date</th>
                        <th>Assign Manager</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.length > 0 ? (
                        employees.map((emp, index) => (
                          <tr key={emp.id}>
                            <td>{index + 1}</td>
                            <td>
                              {emp ? emp.firstName + " " + emp.lastName : "NA"}
                            </td>
                            <td>{emp.email ? emp.email : "NA"}</td>
                            <td>{emp.mobile ? emp.mobile : "NA"}</td>
                            <td>{emp.department ? emp.department : "NA"}</td>
                            <td>{emp.jobTitle ? emp.jobTitle : "NA"}</td>
                            <td>
                              {emp.dateOfHire
                                ? formatDate(emp.dateOfHire)
                                : "NA"}
                            </td>
                            <td>
                              {emp.assignManager ? emp.assignManager : "NA"}
                            </td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <Link to="/update-employee">
                                  <button className="search-update-btn">
                                    Update
                                  </button>
                                </Link>
                                <button
                                  style={{ color: "#dc3545" }}
                                  onClick={() => handleDeleteEmployee(emp._id)}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="no-data">
                            No employees found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === "HR" && activePage === "Designation" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {activeSection === "HR" && activePage === "Departments" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {/* Announcement section */}
          {activeSection === "HR" && activePage === "Announcement" && (
            <div className="announcement-section">
              {/* Input Area */}
              <div className="announcement-input">
                <textarea
                  className="announcement-textarea"
                  placeholder="Write your announcement..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <button className="post-button" onClick={handlePost}>
                  Post
                </button>
              </div>

              {/* Announcements Box */}
              <div className="announcements-box">
                <div className="announcements-list">
                  {announcements && announcements.length > 0 ? (
                    announcements.reverse().map((announcement, index) => (
                      <div className="announcement-item" key={index}>
                        <span className="announcement-date">
                          {announcement.Date
                            ? formatDate(announcement.Date)
                            : "No Date"}
                        </span>
                        <p className="announcement-message">
                          {announcement.Announcement || "No Announcement"}
                        </p>
                        <span
                          className="delete-icon"
                          onClick={() => handleDelete(announcement._id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="no-announcements">No new announcements</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === "HR" && activePage === "Reports" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {activeSection === "HR" && activePage === "Management" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {activeSection === "HR" && activePage === "Help" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {/* sales and purchase section */}
          {activeSection === "Sales/Purchase" && (
            <div id="sales/purchase" className="sales-purchase-section">
              {/* Hamburger Button (Only for Mobile) */}
              <button
                className="menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                Side Menu ☰
              </button>

              {/* Right Buttons Container (Toggle for Mobile) */}
              <div
                className={`right-buttons-container ${
                  isMenuOpen ? "active" : ""
                }`}
              >
                {[
                  { id: "add-account", label: "Add Account" },
                  { id: "add-item", label: "Add Item" },
                  { id: "add-receipt", label: "Tax Invoice" },
                  { id: "notax-receipt", label: "NoTax Invoice" },
                  { id: "solar-invoice", label: "Solar Invoice" },
                  { id: "add-sales", label: "Add Sales" },
                  { id: "add-purchase", label: "Add Purchase" },
                  { id: "stock-status", label: "Stock Status" },
                  { id: "acc-ledger", label: "Acc. Ledger" },
                  { id: "item-summary", label: "Item Summary" },
                  { id: "all-invoices", label: "All Invoices" },
                  { id: "gst-summary", label: "GST Summary" },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => handleItemClick(btn.id)}
                    className={`right-button-row ${
                      activeItem === btn.id ? "active" : ""
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}

                {/* Tax Type Display */}
                <a className="right-button-tax">
                  <span>Tax Type:</span>
                  <span className="gst-text">GST</span>
                </a>
              </div>
              <div className="sales-purchase-main-content">

                {activeItem === "add-account" && (
                  <div className="content-box">
                    <div className="form-container">
                      <div className="header-section">
                        <h2>Create Company</h2>
                      </div>
                      <div className="merged-top-sections">
                        <div className="section-container">
                          <div className="form-row">
                            <label>Name:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Print Name:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Short Name:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Country:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>State:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>F.Y. Beginning from:</label>
                            <input type="date" />
                          </div>
                          <div className="form-row">
                            <label>Books Commencing from:</label>
                            <input type="date" />
                          </div>
                        </div>

                        <div className="section-container">
                          <div className="form-row">
                            <label>Address:</label>
                            <textarea
                              rows={4}
                              style={{ fontSize: "14px" }}
                              type="text"
                              className="input-wide"
                            />
                          </div>
                          <div className="form-row">
                            <label>CIN:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>IT PAN:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Telephone No.:</label>
                            <input rows type="text" />
                          </div>
                          <div className="form-row">
                            <label>E-Mail:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Fax:</label>
                            <input type="text" />
                          </div>
                        </div>
                      </div>

                      <div className="info-sections">
                        <div className="currency-section">
                          <h4>Currency Information</h4>
                          <div className="form-row">
                            <label>Currency Symbol:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Currency String:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Currency Sub-String:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Currency Font:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Currency Character:</label>
                            <input type="text" />
                          </div>
                        </div>

                        <div className="gst-vat-section">
                          <h4>GST/VAT Information</h4>
                          <div className="form-row">
                            <label>Enable GST/VAT:</label>
                            <input type="text" defaultValue="Y" />
                            <label className="aligned-label">Type:</label>
                            <input type="text" defaultValue="GST" />
                          </div>
                          <div className="form-row">
                            <label>Enable Cess:</label>
                            <input type="text" defaultValue="N" />
                            <label className="aligned-label">Caption 1:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Enable Add. Cess</label>
                            <input type="text"></input>
                            <label className="aligned-label">Caption 2:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>GSTN</label>
                            <input type="text"></input>
                          </div>
                          <div className="form-row">
                            <label>Type of Dealer:</label>
                            <input type="text" defaultValue="Regular" />
                          </div>
                          <div className="form-row">
                            <label>Default Tax Rate 1:</label>
                            <input type="number" defaultValue="0.00" />
                            <label className="aligned-label">
                              Default Tax Rate 2:
                            </label>
                            <input type="number" defaultValue="0.00" />
                          </div>
                        </div>
                      </div>

                      <div className="copy-masters-section">
                        <h4>
                          Copy Masters, Configuration, and Users From Existing
                          Company
                        </h4>
                        <div className="radio-group">
                          <div className="radio-option">
                            <input
                              type="radio"
                              id="notRequired"
                              name="copyOptions"
                              value="Not Required"
                              defaultChecked
                            />
                            <label htmlFor="notRequired">Not Required</label>
                          </div>
                          <div className="radio-option">
                            <input
                              type="radio"
                              id="copyMastersConfig"
                              name="copyOptions"
                              value="Copy Masters & Config"
                            />
                            <label htmlFor="copyMastersConfig">
                              Copy Masters & Config
                            </label>
                          </div>
                          <div className="radio-option">
                            <input
                              type="radio"
                              id="copyMastersConfigUsers"
                              name="copyOptions"
                              value="Copy Masters, Config & Users"
                            />
                            <label htmlFor="copyMastersConfigUsers">
                              Copy Masters, Config & Users
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="button-row right-buttons">
                        <button>Save</button>
                        <button>Quit</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeItem === "add-item" && (
                  <div className="content-box">
                    <div className="item-master-container">
                      <h2 className="item-master-title">Add Item Master</h2>
                      <div className="main-container">
                        {/* Left Container */}
                        <div className="left-container">
                          <div className="grid-item item1">
                            <div className="row">
                              <label>Name:</label>
                              <input type="text" />
                            </div>
                            <div className="row">
                              <label>Alias:</label>
                              <input type="text" />
                            </div>
                            <div className="row">
                              <label>Print Name:</label>
                              <input type="text" />
                            </div>
                            <div className="row">
                              <label>Group:</label>
                              <input type="text" />
                            </div>
                          </div>

                          <div className="side-by-side">
                            <div className="grid-item item2">
                              <h4>Main Unit Details</h4>
                              <div className="row">
                                <label>Unit:</label>
                                <input type="text" />
                              </div>
                              <div className="row">
                                <label>Op. Stock (Qty.):</label>
                                <input type="text" defaultValue="0.00" />
                              </div>
                              <div className="row">
                                <label>Op. Stock (Value):</label>
                                <input type="text" />
                              </div>
                            </div>
                            <div className="grid-item item3">
                              <h4>Alternate Unit Details</h4>
                              <div className="row">
                                <label>Alternate Unit:</label>
                                <input type="text" />
                              </div>
                              <div className="row">
                                <label>Con. Factor:</label>
                                <input type="text" defaultValue="0.000" />
                              </div>
                              <div className="row">
                                <label>Con. Type:</label>
                                <input type="text" />
                              </div>
                              <div className="row">
                                <label>Op. Stock (Qty.):</label>
                                <input type="text" defaultValue="0.00" />
                              </div>
                            </div>
                          </div>

                          {/* Container with Visible Border around Invisible Containers */}
                          <div className="grid-item bordered-container">
                            <h4>Item Price Info</h4>
                            <div className="invisible-containers">
                              <div className="grid-item">
                                <div className="row">
                                  <label>Sales Price Applied On:</label>
                                  <input type="text" defaultValue="Main Unit" />
                                </div>
                                <div className="row">
                                  <label>Sales Price:</label>
                                  <input type="text" defaultValue="0.00" />
                                </div>
                                <div className="row">
                                  <label>Purc. Price:</label>
                                  <input type="text" defaultValue="0.00" />
                                </div>
                                <div className="row">
                                  <label>M.R.P.:</label>
                                  <input type="text" defaultValue="0.00" />
                                </div>
                                <div className="row">
                                  <label>Min. Sales Price:</label>
                                  <input type="text" defaultValue="0.00" />
                                </div>
                                <div className="row">
                                  <label>Self-Val. Price:</label>
                                  <input type="text" defaultValue="0.00" />
                                </div>
                              </div>
                              <div className="grid-item">
                                <div className="row">
                                  <label>Purc. Price Applied On:</label>
                                  <input type="text" defaultValue="Main Unit" />
                                </div>
                                <div className="row">
                                  <label>Sales Price:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Purc. Price:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Min. Sales Price:</label>
                                  <input type="text" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid-item bordered-container">
                            <h4>Packaging Unit Details</h4>
                            <div className="invisible-containers">
                              <div className="grid-item">
                                <div className="row">
                                  <label>Packaging Unit:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Sales Price:</label>
                                  <input type="text" />
                                </div>
                              </div>
                              <div className="grid-item">
                                <div className="row">
                                  <label>Con. Factor:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Purc. Price:</label>
                                  <input type="text" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Next container */}
                          <div className="grid-item bordered-container">
                            <div className="invisible-containers">
                              <div className="grid-item">
                                <div className="row">
                                  <label>Default Unit For Sales:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Tax Category:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>HSN/SAC Code For GST:</label>
                                  <input type="text" />
                                </div>
                              </div>
                              <div className="grid-item">
                                <div className="row">
                                  <label>Default Unit For Purc.:</label>
                                  <input type="text" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Final container */}
                          <div className="grid-item bordered-container">
                            <h4>Item Tax Details</h4>
                            <div className="invisible-containers">
                              <div className="grid-item">
                                <div className="row">
                                  <label>Type:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Rate of Tax (CGST):</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Rate of Tax (SGST):</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Rate of Tax (IGST):</label>
                                  <input type="text" />
                                </div>
                              </div>
                              <div className="grid-item">
                                <div className="row">
                                  <label>Tax on MRP:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Taxation Type:</label>
                                  <input type="text" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Button Row in Left Container */}
                          <div className="button-row left-buttons">
                            <button>Notes</button>
                            <button>Opt. Fields</button>
                            <button>Multiple Alias</button>
                            <button>Item Image</button>
                          </div>
                        </div>

                        {/* Right Container */}
                        <div className="right-container">
                          <div className="grid-item bordered-container">
                            <h4>Discount & Markup Det.</h4>
                            <div className="invisible-containers">
                              <div className="grid-item">
                                <div className="row">
                                  <label>Sale Discount:</label>
                                  <input type="text" defaultValue="0.00" />
                                </div>
                                <div className="row">
                                  <label>Sale Compound Disc:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Specify Sales Disc. Structure:</label>
                                  <input type="text" defaultValue="N" />
                                </div>
                              </div>
                              <div className="grid-item">
                                <div className="row">
                                  <label>Purc. Discount:</label>
                                  <input type="text" defaultValue="0.00" />
                                </div>
                                <div className="row">
                                  <label>Purc. Compound Disc.:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Specify Purc. Disc. Structure:</label>
                                  <input type="text" defaultValue="N" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="grid-item bordered-container">
                            <div className="invisible-containers">
                              <div className="grid-item">
                                <div className="row">
                                  <label>Sale Markup:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Sale Comp. Markup:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Specify Sales Markup Structure:</label>
                                  <input type="text" />
                                </div>
                              </div>
                              <div className="grid-item">
                                <div className="row">
                                  <label>Purc. Markup:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Purc. Comp. Markup:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Specify Purc. Markup Structure:</label>
                                  <input type="text" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="grid-item item8">
                            <h4>Item Description</h4>
                            <textarea
                              rows={4}
                              type="text"
                              className="input-wide"
                            />
                          </div>
                          <div className="grid-item bordered-container">
                            <div className="invisible-containers">
                              <div className="grid-item">
                                <div className="row">
                                  <label>Set Critical Level (Y/N):</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Maintain RG-23D:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Serial No.-wise Details:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>MRP-wise Details:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Exp./Mfg. Date Required:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Specify Sales Account:</label>
                                  <input type="text" defaultValue="N" />
                                </div>
                                <div className="row">
                                  <label>Specify Purc Account:</label>
                                  <input type="text" defaultValue="N" />
                                </div>
                                <div className="row">
                                  <label>Specify Default MC:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Freeze MC for Item:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Total No. of Authors (Max. 10):</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>
                                    Pick Item Sizing Info. from Item
                                    Description:
                                  </label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Specify Default Vendor:</label>
                                  <input type="text" defaultValue="N" />
                                </div>
                                <div className="row">
                                  <label>Don't Maintain Stock Balance:</label>
                                  <input type="text" defaultValue="N" />
                                </div>
                              </div>
                              <div className="grid-item">
                                <div className="row">
                                  <label>Tariff Heading:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Parameterized Details:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Batch-wise Details:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Expiry Days:</label>
                                  <input type="text" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Button Row in Right Container */}
                          <div className="button-row right-buttons">
                            <button>Save</button>
                            <button>Quit</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                 {/* tax invoices */}
                {activeItem === "add-receipt" && (
                  <div className="content-box">
                  {/* <h2>Add-Reciept</h2> */}
                  <div>
                    <div className="button-container-invoice">
                      {/* Save Button */}
                      <button
                        className="save-button-invoice"
                        onClick={handleSaveTax}//dad
                        disabled={isSaved}
                      >
                        Save
                      </button>

                      {/* Print Button */}
                      <button
                        className="print-button-invoice"
                        onClick={handlePrint}
                        disabled={!isSaved}
                      >
                        Print
                      </button>
                    </div>
                    <p style={{color:"green"}}>{success?success:""}</p>

                    <div className="invoice-container" ref={componentRef}>
                      <div>
                        <h2
                          style={{
                            color: "black",
                            marginBottom: "10px",
                            marginLeft: "300px",
                          }}
                        >
                          Tax Invoice
                        </h2>
                      </div>
                      <div className="invoice-header">
                        <div className="logo-sectionlogoin">
                          <img
                            src={logo}
                            alt="Company Logo"
                            className="logoin"
                            style={{ height: "50px", width: "200px" }}
                          />
                        </div>
                        <div className="invoice-info">
                          <div className="invoice-info-row">
                            <label htmlFor="invoice-no">Invoice No.:</label>
                            <input
                              type="text"
                              id="invoice-no"
                              name="invoice-no"
                              value={taxInvoiceNumber}
                              readOnly
                            />
                          </div>
                          <div className="invoice-info-row">
                            <label htmlFor="date-of-issue">
                              Date of Issue:
                            </label>
                            <input
                              type="text"
                              id="date-of-issue"
                              name="date-of-issue"
                              onChange={(e)=>{setIssueDate(e.target.value)}}
                              value={formatDate(new Date())}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="invoice-fromto">
                        <div className="from-section">
                          <h3>From</h3>
                          <p>Techkisan Automation,</p>
                          <p>Nakade Complex, Mama Chawk, Civil Line</p>
                          <p>Gondia, Maharashtra, India - 441601</p>
                          <p>
                            <strong>Mobile No. :</strong>
                            <span style={{ margin: "0 3px" }}></span>
                            7972021213 | 9511831914
                          </p>
                          <p>
                            <strong>Email I'd :</strong>
                            <span style={{ margin: "0px 9px" }}></span>
                            tkn.automation@gmail.com
                          </p>
                        </div>
                        <div className="to-section">
                          <h3>Bill To</h3>
                          <div className="to-section-row">
                            <label>M/s </label>
                            <input type="text" name="partyName"
                            onChange={(e) => setPartyName(e.target.value)}
                            value={partyName}
                            />
                          </div>
                          <div className="to-section-row">
                            <label>Address:</label>
                            <input type="text" />
                          </div>
                          <div className="to-section-row">
                            <label></label>
                            <input type="text" />
                          </div>
                          <div className="to-section-row">
                            <label></label>
                            <input type="text" />
                          </div>
                          <div className="to-section-row">
                            <label>Mobile No.: </label>
                            <input type="text" />
                          </div>
                        </div>
                      </div>

                      <div className="invoice-table">
                      <table>
                          <thead>
                            <tr>
                              <th>S.N.</th>
                              <th>Product Description</th>
                              <th>HSN</th>
                              <th>Qty(N)</th>
                              <th>Rate(₹)</th>
                              <th>Amount(₹)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {taxRows.map((row, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <textarea
                                    rows="3"
                                    style={{ width: "100%" }}
                                    value={row.desc}
                                    data-tax-index={index} // Add this
                                    onChange={(e) => handleTaxChange(index, "desc", e.target.value)}
                                    onKeyDown={(e) => handleTaxKeyPress(index, "desc", e)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={row.hsn}
                                    onChange={(e) => handleTaxChange(index, "hsn", e.target.value)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    value={row.qty}
                                    onChange={(e) => handleTaxChange(index, "qty", e.target.value)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    value={row.rate}
                                    onChange={(e) => handleTaxChange(index, "rate", e.target.value)}
                                    onKeyDown={(e) => handleTaxKeyPress(index, "rate", e)} // Key press for rate
                                  />
                                </td>
                                <td>
                                  <input type="text" value={row.amount} readOnly />
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold" }}>Total (₹):</td>
                              <td><input type="text" value={taxTotalAmount.toFixed(2)} readOnly /></td>
                            </tr>
                            <tr>
                              <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold", position: "relative" }}
                                  onClick={() => setShowDropdown(true)}
                                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}>
                                {showDropdown ? (
                                  <select 
                                    value={taxType} 
                                    onChange={(e) => setTaxType(e.target.value)} 
                                    autoFocus 
                                    style={{ width: "110px", fontSize: "12px" }}>
                                    <option value="GST">GST @18%</option>
                                    <option value="IGST">IGST @18%</option>
                                  </select>
                                ) : (
                                  ` ${taxType === "GST" ? "GST @18%" : "IGST @18%"}`
                                )}
                              </td>
                              <td><input type="text" value={gstAmount.toFixed(2)} readOnly /></td>
                            </tr>
                            {taxType === "GST" && (
                              <>
                                <tr>
                                  <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold" }}>-CGST 9%</td>
                                  <td><input type="text" value={cgstSgstAmount.toFixed(2)} readOnly /></td>
                                </tr>
                                <tr>
                                  <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold" }}>-SGST 9%</td>
                                  <td><input type="text" value={cgstSgstAmount.toFixed(2)} readOnly /></td>
                                </tr>
                              </>
                            )}
                            <tr>
                              <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold" }}>Round Off (₹):</td>
                              <td><input type="text" value={taxRoundOff.toFixed(2)} readOnly /></td>
                            </tr>
                            <tr>
                              <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold" }}>Final Total (₹):</td>
                              <td><input type="text" value={taxRoundedTotal.toFixed(2)} readOnly /></td>
                            </tr>
                            <tr>
                              <td colSpan="6" style={{ textAlign: "right" }}>
                                <b>Amount in Words: </b>
                                <p>{taxTotalInWords} Rupees Only</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="footer-section">
                        <div className="payment-section">
                          <h4>BANK DETAILS</h4>
                          <div className="payment-section-row">
                            <p>Bank Name:</p>
                            <p>HDFC Bank</p>
                          </div>
                          <div className="payment-section-row">
                            <p>A/c Holder Name:</p>
                            <p>TechKisan Automation</p>
                          </div>
                          <div className="payment-section-row">
                            <p>Account No.:</p>
                            <p>50200063151545</p>
                          </div>
                          <div className="payment-section-row">
                            <p>IFSC Code:</p>
                            <p>HDFC000963</p>
                          </div>
                          <div className="UPI-section-main">
                            <h4>PAYMENT VIA QR CODE</h4>
                            <div className="UPI-section">
                              <div>
                                <p>
                                  <strong>UPI ID:</strong>
                                </p>
                                <p>9511831914@hdfcbank</p>
                                <p>8698105221@hdfcbank</p>
                                <div>
                                  <img
                                    src={paymenticons}
                                    alt="payment icons"
                                    style={{
                                      height: "30px",
                                      width: "145px",
                                      marginTop: "5px",
                                    }}
                                  />
                                </div>
                              </div>
                              <div>
                                <img
                                  src={barcode}
                                  alt="QR code"
                                  style={{ height: "78px", width: "78px" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="signature-section">
                          <p>
                            <strong>For Techkisan Automation</strong>
                          </p>
                          <img src={signature} alt="Signature" />
                          <p style={{ fontSize: "10px", marginLeft: "25px" }}>
                            <i>Computer Generated Invoice</i>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}
              {/* NO TAX INVOICE  */}
                {activeItem === "notax-receipt" && (
                  <div className="content-box">
                    {/* <h2>Add-Reciept</h2> */}
                    <div>
                      <div className="button-container-invoice">
                        {/* Save Button */}
                        <button
                          className="save-button-invoice"
                          onClick={handleSave}
                          disabled={isSaved}
                        >
                          Save
                        </button>

                        {/* Print Button */}
                        <button
                          className="print-button-invoice"
                          onClick={handlePrint}
                          disabled={!isSaved}
                        >
                          Print
                        </button>
                      </div>

                      <div className="invoice-container" ref={componentRef}>
                        <div>
                          <h2
                            style={{
                              color: "black",
                              marginBottom: "10px",
                              marginLeft: "300px",
                            }}
                          >
                            Invoice
                          </h2>
                        </div>
                        <div className="invoice-header">
                          <div className="logo-sectionlogoin">
                            <img
                              src={logo}
                              alt="Company Logo"
                              className="logoin"
                              style={{ height: "50px", width: "200px" }}
                            />
                          </div>
                          <div className="invoice-info">
                            <div className="invoice-info-row">
                              <label htmlFor="invoice-no">Invoice No.:</label>
                              <input
                                type="text"
                                id="invoice-no"
                                name="invoice-no"
                                value={invoiceNumber}
                                readOnly
                              />
                            </div>
                            <div className="invoice-info-row">
                              <label htmlFor="date-of-issue">
                                Date of Issue:
                              </label>
                              <input
                                type="text"
                                id="date-of-issue"
                                name="date-of-issue"
                                value={issueDate2}
                                onChange={(e)=>{setIssueDate2(e.target.value)}}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="invoice-fromto">
                          <div className="from-section">
                            <h3>From</h3>
                            <p>Techkisan Automation,</p>
                            <p>Nakade Complex, Mama Chawk, Civil Line</p>
                            <p>Gondia, Maharashtra, India - 441601</p>
                            <p>
                              <strong>Mobile No. :</strong>
                              <span style={{ margin: "0 3px" }}></span>
                              7972021213 | 9511831914
                            </p>
                            <p>
                              <strong>Email I'd :</strong>
                              <span style={{ margin: "0px 9px" }}></span>
                              tkn.automation@gmail.com
                            </p>
                          </div>
                          <div className="to-section">
                            <h3>Bill To</h3>
                            <div className="to-section-row">
                              <label>M/s </label>
                              <input type="text"
                              value={partyName2}
                              onChange={(e)=>{setPartyName2(e.target.value)}} 
                              />
                            </div>
                            <div className="to-section-row">
                              <label>Address:</label>
                              <input type="text" />
                            </div>
                            <div className="to-section-row">
                              <label></label>
                              <input type="text" />
                            </div>
                            <div className="to-section-row">
                              <label></label>
                              <input type="text" />
                            </div>
                            <div className="to-section-row">
                              <label>Mobile No.: </label>
                              <input type="text" />
                            </div>
                          </div>
                        </div>

                        <div className="invoice-table">
                          <table>
                            <thead>
                              <tr>
                                <th>S.N.</th>
                                <th>Product Description</th>
                                <th>HSN</th>
                                <th>Qty(N)</th>
                                <th>Rate(₹)</th>
                                <th>Amount(₹)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {noTaxRows.map((row, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <textarea
                                      rows="3"
                                      style={{ width: "100%" }}
                                      value={row.desc}
                                      data-no-tax-index={index} // Add this
                                      onChange={(e) => handleNoTaxChange(index, "desc", e.target.value)}
                                      onKeyDown={(e) => handleNoTaxKeyPress(index, "desc", e)}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      value={row.hsn}
                                      onChange={(e) => handleNoTaxChange(index, "hsn", e.target.value)}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      value={row.qty}
                                      onChange={(e) => handleNoTaxChange(index, "qty", e.target.value)}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      value={row.rate}
                                      onChange={(e) => handleNoTaxChange(index, "rate", e.target.value)}
                                      onKeyDown={(e) => handleNoTaxKeyPress(index, "rate", e)} // Key press for rate
                                    />
                                  </td>
                                  <td>
                                    <input type="text" value={row.amount} readOnly />
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold" }}>Total (₹):</td>
                                <td><input type="text" value={noTaxTotalAmount.toFixed(2)} readOnly /></td>
                              </tr>
                              <tr>
                                <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold" }}>Round Off (₹):</td>
                                <td><input type="text" value={noTaxRoundOff.toFixed(2)} readOnly /></td>
                              </tr>
                              <tr>
                                <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold" }}>Final Total (₹):</td>
                                <td><input type="text" value={noTaxFinalTotal} readOnly /></td>
                              </tr>
                              <tr>
                                <td colSpan="6" style={{ textAlign: "right" }}>
                                  <b>Amount in Words: </b>
                                  <p>{noTaxTotalInWords} Rupees Only</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="footer-section">
                          <div className="payment-section">
                            <h4>BANK DETAILS</h4>
                            <div className="payment-section-row">
                              <p>Bank Name:</p>
                              <p>HDFC Bank</p>
                            </div>
                            <div className="payment-section-row">
                              <p>A/c Holder Name:</p>
                              <p>TechKisan Automation</p>
                            </div>
                            <div className="payment-section-row">
                              <p>Account No.:</p>
                              <p>50200063151545</p>
                            </div>
                            <div className="payment-section-row">
                              <p>IFSC Code:</p>
                              <p>HDFC000963</p>
                            </div>
                            <div className="UPI-section-main">
                              <h4>PAYMENT VIA QR CODE</h4>
                              <div className="UPI-section">
                                <div>
                                  <p>
                                    <strong>UPI ID:</strong>
                                  </p>
                                  <p>9511831914@hdfcbank</p>
                                  <p>8698105221@hdfcbank</p>
                                  <div>
                                    <img
                                      src={paymenticons}
                                      alt="payment icons"
                                      style={{
                                        height: "30px",
                                        width: "145px",
                                        marginTop: "5px",
                                      }}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <img
                                    src={barcode}
                                    alt="QR code"
                                    style={{ height: "78px", width: "78px" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="signature-section">
                            <p>
                              <strong>For Techkisan Automation</strong>
                            </p>
                            <img src={signature} alt="Signature" />
                            <p style={{ fontSize: "10px", marginLeft: "25px" }}>
                              <i>Computer Generated Invoice</i>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeItem === "solar-invoice" && (
                  <div className="content-box">
                    <div>
                    <button
                        style={{ marginBottom: "10px"}}
                        className="print-button-invoice"
                        onClick={handlePrint2}
                      >
                        Print Invoice
                      </button>
                      <div ref={printRef} className="solar-invoice-container">
                        <div className="solar-header">
                          <h1>Tax Invoice</h1>
                          <div className="solar-invoice-info">
                            <p>Invoice No: TKN/2024-25/636/G</p>
                            <p>Invoice Date: 21/03/2025</p>
                            <p>Transport Mode: ROAD</p>
                          </div>
                        </div>
                        <div className="solar-company-details">
                          <h2>Techkisan Automation</h2>
                          <p>Ambule Building, Shrinagar, Near Murri Chawky, Gondia - 441601</p>
                          <p>Tel. No.: +91-7972025213 / +91-9511831914</p>
                          <p>GSTN: 27AAQFT9534N1Z5</p>
                          <p>PAN No.: AAQFT9534N</p>
                        </div>
                        <section className="solar-billing">
                          <div className="solar-party-info">
                            <h3>Quote To Party</h3>
                            <p>Name: Mahesh Prithyani Sir</p>
                            <p>Address: Gondia</p>
                            <p>State: Maharashtra</p>
                            <p>GSTIN: 27AAQFT9534N1Z5</p>
                          </div>
                          <div className="solar-party-info">
                            <h3>Ship To Party</h3>
                            <p>Name: Mahesh Prithyani Sir</p>
                            <p>Address: Gondia</p>
                            <p>State: Maharashtra</p>
                          </div>
                        </section>
                        <table className="solar-invoice-table">
                          <thead>
                            <tr>
                              <th>Sr. No</th>
                              <th>Description</th>
                              <th>UOM</th>
                              <th>Qty</th>
                              <th>Rate</th>
                              <th>Taxable Amount</th>
                              <th>CGST</th>
                              <th>SGST</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>4KW Adani PV Panels Bifacial</td>
                              <td>pcs</td>
                              <td>1</td>
                              <td>1,47,627</td>
                              <td>1,47,627</td>
                              <td>6% (8857.64)</td>
                              <td>6% (8857.64)</td>
                              <td>1,77,715.28</td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>Solar 4KVA Inverter</td>
                              <td>pcs</td>
                              <td>1</td>
                              <td>63,269</td>
                              <td>63,269</td>
                              <td>9% (5694.21)</td>
                              <td>9% (5694.21)</td>
                              <td>75,657.42</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="solar-totals">
                          <p>Total Amount Before Tax: ₹2,10,896.30</p>
                          <p>Total GST Amount: ₹29,103.70</p>
                          <p><strong>Total Payable Amount With Tax: ₹2,40,000.00</strong></p>
                        </div>
                        <section className="solar-bank-details">
                          <h3>Bank Details</h3>
                          <p>Bank Name: HDFC BANK</p>
                          <p>A/C No.: 50200063151545</p>
                          <p>IFSC Code: HDFC0000963</p>
                        </section>
                        <section className="terms">
                          <h3>Terms & Conditions</h3>
                          <p>All Disputes are Subject to Home Jurisdiction</p>
                          <p>Warranty: Panels - 25 years, Inverter - 10 years</p>
                        </section>
                        <footer>
                          <p>Authorized Signatory</p>
                        </footer>
                      </div>
                    </div>
                  </div>
                )}

                {activeItem === "add-sales" && (
                  <div className="content-box">
                    <div className="sales-voucher-container">
                      <h2>Add Sales Voucher</h2>
                      <div className="header">
                        <div className="header-row">
                          <div className="aligned-item">
                            <label>Series:</label>
                            <input type="text" />
                          </div>
                          <div className="aligned-item">
                            <label>Main Date:</label>
                            <input type="date" />
                          </div>
                          <div className="aligned-item">
                            <label>Vch No.:</label>
                            <input type="text" />
                          </div>
                          <div className="aligned-item">
                            <label>Sale Type:</label>
                            <select>
                              <option>L/GST-5%</option>
                              <option>L/GST-12%</option>
                              <option>L/GST-18%</option>
                              <option>L/GST-28%</option>
                              <option>L/GST-Exempt</option>
                              <option>L/GST-ItemWise</option>
                              <option>L/GST-MultiRate</option>
                            </select>
                          </div>
                          <div className="aligned-item">
                            <label>Tax Type:</label>
                            <select>
                              <option value="GST">GST</option>
                              <option value="VAT">VAT</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="party-section">
                        <label>Party:</label>
                        <input type="text" />
                        <label>Mat. Centre:</label>
                        <input type="text" />
                      </div>

                      <div className="narration-section">
                        <label>Narration:</label>
                        <input type="text" />
                      </div>

                      <div className="table-section">
                        <table>
                          <thead>
                            <tr>
                              <th>S.N.</th>
                              <th>Item</th>
                              <th>Qty.</th>
                              <th>Unit</th>
                              <th>Price (Rs.)</th>
                              <th>Amount (Rs.)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...Array(100)].map((_, index) => (
                              <tr
                                key={index}
                                className={index >= 10 ? "hidden-row" : ""}
                              >
                                <td>{index + 1}</td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="totals-section">
                        <span>0.00 (Alt. Qty. = 0.00)</span>
                        <span>0.00</span>
                      </div>

                      <div className="gst-section">
                        <div className="gst-summary">
                          <h4>GST Summary</h4>
                          <table>
                            <thead>
                              <tr>
                                <th>Tax Rate</th>
                                <th>Taxable Amt.</th>
                                <th>GST</th>
                                <th>SGST</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="total-gst">
                            <label>Total:</label>
                            <input type="text"></input>
                            <input type="text"></input>
                          </div>
                        </div>
                        <div className="bill-sundry">
                          <h4>Bill Sundry</h4>
                          <table>
                            <thead>
                              <tr>
                                <th>S.N.</th>
                                <th>Bill Sundry</th>
                                <th>@</th>
                                <th>Amount (Rs)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[...Array(100)].map((_, index) => (
                                <tr
                                  key={index}
                                  className={index >= 5 ? "hidden-row" : ""}
                                >
                                  <td>{index + 1}</td>
                                  <td>
                                    <input type="text" />
                                  </td>
                                  <td>
                                    <input type="text" />
                                  </td>
                                  <td>
                                    <input type="text" />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="footer">
                        <button>Vch. Detail</button>
                        <button>Master Detail</button>
                        <button>Party Dash Board</button>
                        <button>Vch Image</button>
                        <button>Acc Image</button>
                        <button>Item Image</button>
                        <button>Update Discount</button>
                        <button>Check Scheme</button>
                        <button>Save</button>
                        <button>Quit</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeItem === "add-purchase" && (
                  <div className="content-box">
                    <div className="purchase-voucher-container">
                      <h2>Add Purchase Voucher</h2>
                      <div className="header">
                        <div className="header-row">
                          <div className="aligned-item">
                            <label>Series:</label>
                            <input type="text" />
                          </div>
                          <div className="aligned-item">
                            <label>Main Date:</label>
                            <input type="date" />
                          </div>
                          <div className="aligned-item">
                            <label>Vch No.:</label>
                            <input type="text" />
                          </div>
                          <div className="aligned-item">
                            <label>Purc Type:</label>
                            <select>
                              <option>L/GST-5%</option>
                              <option>L/GST-12%</option>
                              <option>L/GST-18%</option>
                              <option>L/GST-28%</option>
                              <option>L/GST-Exempt</option>
                              <option>L/GST-ItemWise</option>
                              <option>L/GST-MultiRate</option>
                            </select>
                          </div>
                          <div className="aligned-item">
                            <label>Tax Type:</label>
                            <select>
                              <option value="GST">GST</option>
                              <option value="VAT">VAT</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="party-section">
                        <label>Party:</label>
                        <input type="text" />
                        <label>Mat. Centre:</label>
                        <input type="text" />
                      </div>

                      <div className="narration-section">
                        <label>Narration:</label>
                        <input type="text" />
                      </div>

                      <div className="table-section">
                        <table>
                          <thead>
                            <tr>
                              <th>S.N.</th>
                              <th>Item</th>
                              <th>Qty.</th>
                              <th>Unit</th>
                              <th>Price (Rs.)</th>
                              <th>Amount (Rs.)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...Array(100)].map((_, index) => (
                              <tr
                                key={index}
                                className={index >= 10 ? "hidden-row" : ""}
                              >
                                <td>{index + 1}</td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="totals-section">
                        <span>0.00 (Alt. Qty. = 0.00)</span>
                        <span>0.00</span>
                      </div>

                      <div className="gst-section">
                        <div className="gst-summary">
                          <h4>GST Summary</h4>
                          <table>
                            <thead>
                              <tr>
                                <th>Tax Rate</th>
                                <th>Taxable Amt.</th>
                                <th>GST</th>
                                <th>SGST</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="total-gst">
                            <label>Total:</label>
                            <input type="text"></input>
                            <input type="text"></input>
                          </div>
                        </div>
                        <div className="bill-sundry">
                          <h4>Bill Sundry</h4>
                          <table>
                            <thead>
                              <tr>
                                <th>S.N.</th>
                                <th>Bill Sundry</th>
                                <th>@</th>
                                <th>Amount (Rs)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[...Array(100)].map((_, index) => (
                                <tr
                                  key={index}
                                  className={index >= 5 ? "hidden-row" : ""}
                                >
                                  <td>{index + 1}</td>
                                  <td>
                                    <input type="text" />
                                  </td>
                                  <td>
                                    <input type="text" />
                                  </td>
                                  <td>
                                    <input type="text" />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="footer">
                        <button>Vch. Detail</button>
                        <button>Master Detail</button>
                        <button>Party Dash Board</button>
                        <button>Vch Image</button>
                        <button>Acc Image</button>
                        <button>Item Image</button>
                        <button>Update Discount</button>
                        <button>Check Scheme</button>
                        <button>Save</button>
                        <button>Quit</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeItem === "stock-status" && (
                  <div className="content-box">
                    <div className="stockstatus-container">
                      <h2>Stock Status</h2>
                      <div className="stockstatus-row">
                        <label>Report Date:</label>
                        <input type="date" />
                      </div>
                      <div className="stockstatus-row">
                        <label>Show Zero Stock Items?</label>
                        <input type="text" />
                      </div>
                      <div className="stockstatus-row">
                        <label>Show Parent Group?</label>
                        <input type="text" />
                      </div>
                      <div className="stockstatus-row">
                        <label>Report to be shown in:</label>
                        <select>
                          <option>Main Unit</option>
                          <option>Alt. Unit</option>
                          <option>Both Units</option>
                        </select>
                      </div>
                      <div className="stockstatus-row">
                        <label>Treat Main/Alt. Unit as Compound Unit?</label>
                        <input type="text" />
                      </div>
                      <div className="stockstatus-row">
                        <label>Item to be Shown by:</label>
                        <input type="text" />
                      </div>
                      <div className="stockstatus-row">
                        <label>Show Value of Items?</label>
                        <input type="text" />
                      </div>
                      <div className="stockstatus-row">
                        <label>Show MRP Also?</label>
                        <input type="text" />
                      </div>
                      <button className="stockstatus-button">OK</button>
                    </div>
                  </div>
                )}

                {activeItem === "acc-ledger" && (
                  <div className="content-box">
                    <h2>Account Ledger</h2>
                    <p>This is the content for Account Ledger</p>
                  </div>
                )}

                {activeItem === "item-summary" && (
                  <div className="content-box">
                    <div className="monthlysummery-container">
                      <h2>Inventory - Monthly Summery</h2>

                      <div className="item-section">
                        <label>Item:</label>
                        <input type="text" defaultValue="ITEM-1" />
                        <label> ( Unit : BOX ) </label>
                      </div>
                      <div className="table-section-ms">
                        <table>
                          <thead>
                            <tr>
                              <th>Month</th>
                              <th>Qty. In</th>
                              <th>Qty. Out</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>January</td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                          </tbody>
                          <tfoot>
                            <tr>
                              <th>Total</th>
                              <th></th>
                              <th></th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeItem === "all-invoices" && (
                  <div className="content-box">
                    
                    <div className="admin-table-container">
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>INVOICE NO</th>
                        <th>PARTY NAME</th>
                        <th>DATE OF ISSUE</th>
                        <th>FILE NAME</th>
                        <th>DOWNLOAD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allInvoices.length > 0 ? (
                        allInvoices.map((invoice) => (
                          <tr key={invoice.id}>
                            <td>{invoice?invoice.invoiceNumber:"NA"}</td>
                            <td>
                              {invoice ? invoice.partyName: "NA"}
                            </td>
                            <td>{invoice ? invoice.DateOfIssue : "NA"}</td>
                            <td>{invoice ? invoice.invoiceNumber+".pdf" : "NA"}</td>
                            <td>
                            <button
                              style={{ color: "white" }}
                              className="search-update-btn"
                              onClick={() => handleDownload(invoice._id, invoice.invoiceNumber)}
                            >
                              Download
                            </button>
                            <button
                                  style={{ color: "#dc3545" }}
                                  onClick={() => handleDeleteInvoives(invoice._id)}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                          </td>
                      </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="no-data">
                            No Invoices  found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                  </div>
                )}

            {activeItem === "gst-summary" && (
                              <div className="content-box">
                                <h2>GST Summary</h2>
                                <p>This is the content for GST Summary</p>
                              </div>
                            )}
              </div>
            </div>
          )}
          {/* accounting section */}
          {activeSection === "Accounting" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {activeSection === "Company" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {activeSection === "Tools" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {activeSection === "Modules" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {activeSection === "Add-Ons" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {activeSection === "Setting" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
