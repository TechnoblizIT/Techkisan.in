
const adminModel=require("../models/admin-model")
const bcrypt = require('bcrypt');
const {genrateToken }=require("../utils/generateToken");

module.exports.loginUser = async function (req, res) {
    try{  
    let { email, password } = req.body;
    const admin = await adminModel.findOne({ Email: email });

    if (!admin) {
        res.json({ success: false, message: 'Invalid credentials' });
    }
    else{

    let isMatch = await bcrypt.compare(password, admin.Password);

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