const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/TechkisanAutomation').then(function(connection) {
    console.log("Connected to MongoDB");
})
.catch(function(error) {
    console.log("Error connecting to MongoDB: ", error);
});

module.exports =mongoose.connection