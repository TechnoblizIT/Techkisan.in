const employeeModel = require("../models/employee-model");
const bcrypt = require('bcrypt');
const { genrateToken } = require("../utils/generateToken");

module.exports.loginUser = async function (req, res) {
    try {
        let { username, password } = req.body;
        const employee = await employeeModel.findOne({ username: username });

        if (!employee) {
            return res.json({ success: false, message: 'Invalid username credentials' });
        }

        let isMatch = await bcrypt.compare(password, employee.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password credentials' });
        }

        const token = genrateToken(employee);
        res.cookie('token', token)
        res.json({ success: true, message: 'Login successful' });
    } catch (e) {
        console.log(e);
        res.status(500).send("Server Error");
    }
};

module.exports.logoutUser = function(req, res) {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out' });
}
