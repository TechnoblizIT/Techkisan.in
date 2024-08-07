
const employeeModel=require("../models/employee-model")
const bcrypt = require('bcrypt');
const {genrateToken }=require("../utils/generateToken");

module.exports.loginUser = async function (req, res) {
     try{  
            let { email, password } = req.body;
            const employee = await employeeModel.findOne({ Email: email });
        
            if (!employee) {
                res.json({ success: false, message: 'Invalid credentials' });
            }
            else{
        
            let isMatch = await bcrypt.compare(password, employee.Password);
        
            if (!isMatch) {
                res.json({ success: false, message: 'Invalid credentials' });
            }
        
            const tokken = genrateToken(admin);
            res.cookie("tokken",tokken);
            res.json({ success: true, message: 'Login successful'});
        }
        }catch(e) {
            console.log(e);
            res.status(500).send("Server Error");
          
        }
          };