const express = require('express');
const router=express.Router();



router.post('/login', (req, res) => {
    let { email, password } = req.body;
    console.log(email, password);
  
    if (email === 'joe@email.com' && password === 'password123') {
      res.json({ success: true, message: 'Login successful' });
      res.redirect("/employee-dashboard")
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });

router.post('/create', (req, res) => {
  
  });

  module.exports = router;