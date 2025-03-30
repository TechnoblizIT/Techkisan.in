class APIEndpoints {
    constructor() {
      this.BASE_URL ="http://localhost:8000";
      
     
     this.GET_MESSAGES=`${this.BASE_URL}/messages`
      // Admin Endpoints
      this.ADMIN_LOGIN = `${this.BASE_URL}/admin/login`;
      this.ADMIN_DASHBOARD = `${this.BASE_URL}/admin/admindata`;
      this.ADMIN_ADD_ANNOUNCEMENT = `${this.BASE_URL}/admin/add_announcement`;
      this.ADMIN_DELETE_ANNOUNCEMENT = `${this.BASE_URL}/admin/delete_announcement`;
      this.ADMIN_SAVE_NOTAXINVOICE = `${this.BASE_URL}/admin/save_notaxinvoice`;
      this.ADMIN_FETCH_LATEST_NOTAXINVOICE_ID = `${this.BASE_URL}/admin/invoice/latest`;
      this.ADMIN_FETCH_LATEST_TAXINVOICE_ID = `${this.BASE_URL}/admin/taxinvoice/latest`;
      this.ADMIN_SAVE_TAXINVOICE = `${this.BASE_URL}/admin/save_taxinvoice`;
      this.ADMIN_DELETE_EMPLOYEE=`${this.BASE_URL}/admin/delete_employee`;


  
      // Employee Endpoints
      this.EMPLOYEE_CREATE = `${this.BASE_URL}/employees/create`;
      this.EMPLOYEE_LOGIN = `${this.BASE_URL}/employees/login`;
      this.EMPLOYEE_DASHBOARD = `${this.BASE_URL}/employees/empdata`;
      this.EMPLOYEE_CHANGEPASSWORD = `${this.BASE_URL}/employees/changepassword`;
      this.EMPLOYEE_WFH = `${this.BASE_URL}/employees/addWfh`;
      this.EMPLOYEE_ADD_LEAVE = `${this.BASE_URL}/employees/addLeave`;
      this.EMPLOYEE_GET_LEAVES = `${this.BASE_URL}/employees/getLeaves`;
      this.EMPLOYEE_PUNCH_IN = `${this.BASE_URL}/employees/punchIn`;
      this.EMPLOYEE_PUNCH_OUT = `${this.BASE_URL}/employees/punchOut`;
      this.EMPLOYEE_DEL_LEAVE = `${this.BASE_URL}/employees/deleteLeaves`;
      this.EMPLOYEE_LOGOUT = `${this.BASE_URL}/employees/logout`;  
      this.GET_USERS_EMPLOYEES=`${this.BASE_URL}/employees/allusers`  
      this.GET_UNREADMESSAGE_EMPLOYEES=`${this.BASE_URL}/employees/unreadmessages`  
      // Manager Endpoints
      this.MANAGER_CREATE = `${this.BASE_URL}/manager/create`;
      this.MANAGER_LOGIN = `${this.BASE_URL}/manager/login`;
      this.MANAGER_DASHBOARD = `${this.BASE_URL}/manager/managerdata`;
      this.MANAGER_PUNCH_IN = `${this.BASE_URL}/manager/punchIn`;
      this.MANAGER_PUNCH_OUT = `${this.BASE_URL}/manager/punchOut`;
      this.MANAGER_GET_PENDING_LEAVES = `${this.BASE_URL}/manager/pendingleaves`;
      this.MANAGER_APPROVE_LEAVE = `${this.BASE_URL}/manager/leaves/approve`;
      this.MANAGER_DENY_LEAVE = `${this.BASE_URL}/manager/leaves/deny`;
      this.MANAGER_LOGOUT = `${this.BASE_URL}/manager/logout`;
      this.GET_USERS_MANAGER=`${this.BASE_URL}/manager/allusers` 
      // Intern Endpoints
      this.INTERN_CREATE = `${this.BASE_URL}/intern/create`;
      this.INTERN_LOGIN = `${this.BASE_URL}/intern/login`;
      this.INTERN_DASHBOARD = `${this.BASE_URL}/intern/interndata`;
      this.INTERN_LOGOUT = `${this.BASE_URL}/intern/logout`;
      this.GET_USERS_INTERN=`${this.BASE_URL}/intern/allusers`
    
    }
  }
  
  
  export default APIEndpoints; 