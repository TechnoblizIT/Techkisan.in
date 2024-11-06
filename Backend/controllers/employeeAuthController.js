const employeeModel = require("../models/employee-model");
const bcrypt = require('bcrypt');
const { genrateToken } = require("../utils/generateToken");
const managerModel = require("../models/manager-model")
const{genrateTokenManager}=require("../utils/generateTokenManager")
const internModel=require("../models/intern-model")
const { genrateTokenIntern } = require("../utils/generateTokenIntern");
module.exports.loginUser = async function (req, res) {
    try {
        let { username, password } = req.body;

       
        const employee = await employeeModel.findOne({ username: username });
        if (!employee) {

            
            const manager = await managerModel.findOne({ username: username });
            if (!manager) {

                
                const intern = await internModel.findOne({ username: username });
                if (!intern) {
                    return res.json({ success: false, message: 'Invalid credentials' });
                }

                
                let isMatch = await bcrypt.compare(password, intern.password);
                if (!isMatch) {
                    return res.json({ success: false, message: 'Invalid password credentials' });
                }

               
                const token = genrateTokenIntern(intern);
                return res.json({ success: true, message: 'intern', token: token });
            }

            
            let isMatch = await bcrypt.compare(password, manager.password);
            if (!isMatch) {
                return res.json({ success: false, message: 'Invalid password credentials' });
            }

            
            const token = genrateTokenManager(manager);
            return res.json({ success: true, message: 'manager', token: token });
        }

       
        let isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password credentials' });
        }

       
        const token = genrateToken(employee);
        return res.json({ success: true, message: 'employee', token: token });

    } catch (e) {
        console.error(e);
        return res.status(500).send("Server Error");
    }
};


//logoout
module.exports.logoutUser = function(req, res) {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out' });
}



//change password


module.exports.changePassword=async(req, res)=> {
    const { currentPassword, newPassword } = req.body;
    const authHeader = req.headers.authorization;
   
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
   
    const token = authHeader.split(' ')[1];
   
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }
   
    const username = jwt.verify(token, process.env.JWT_SECRET);
    
    const employee = await employeeModel.findOne({username: username.user });
    
    if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    bcrypt.compare(currentPassword, employee.password, (err, isMatch) => {
     if (err) return res.status(err).json({ message:"Server error"});
     if (isMatch) {
       const saltRounds = 10;
       bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
         if (err) return res.status(err).json({ message: "Server error" });
         employee.password = hashedPassword;
         employee.save().then(() => {
           res.json({ message: "Password changed successfully" });
         });
       });
     }
     else{
       res.json({ message: "Incorrect current password" });
     }
   }
   )}