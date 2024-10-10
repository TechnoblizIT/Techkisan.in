class APIEndpoints {
    constructor() {
      this.BASE_URL ="http://localhost:8000";
      
     
      // Admin Endpoints
      this.ADMIN_LOGIN = `${this.BASE_URL}/admin/login`;
      this.ADMIN_DASHBOARD = `${this.BASE_URL}/admin/admindata`;
  
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
      // Manager Endpoints
      this.MANAGER_CREATE = `${this.BASE_URL}/manager/create`;
      this.MANAGER_LOGIN = `${this.BASE_URL}/manager/login`;
      this.MANAGER_DASHBOARD = `${this.BASE_URL}/manager/managerdata`;
      this.MANAGER_GET_PENDING_LEAVES = `${this.BASE_URL}/manager/pendingleaves`;
      this.MANAGER_APPROVE_LEAVE = `${this.BASE_URL}/manager/leaves/approve`;
      this.MANAGER_DENY_LEAVE = `${this.BASE_URL}/manager/leaves/deny`;
      this.MANAGER_LOGOUT = `${this.BASE_URL}/manager/logout`;
    }
  }
  
  
  export default APIEndpoints; 