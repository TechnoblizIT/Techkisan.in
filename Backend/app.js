const express =require('express');

const app = express();
const cors = require('cors');
const db=require('./configs/mongoose-connection')
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/login', (req, res) => {
  let { email, password } = req.body;
  console.log(email, password);
  // Handle authentication logic here
  if (email === 'joe@email.com' && password === 'password123') {
    res.json({ success: true, message: 'Login successful' });
    res.redirect("/employee-dashboard")
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

app.listen(8000);