const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://praduman228:CjTmAHWAQFQwjNxT@tkn.g6ct4.mongodb.net/?retryWrites=true&w=majority&appName=TKN').then(function(connection) {
    console.log("Connected to MongoDB");
})
.catch(function(error) {
    console.log("Error connecting to MongoDB: ", error);
});

module.exports =mongoose.connection