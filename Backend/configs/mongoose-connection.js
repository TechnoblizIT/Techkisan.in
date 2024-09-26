const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URI).then(function(connection) {
    console.log("Connected to MongoDB");
})
.catch(function(error) {
    console.log("Error connecting to MongoDB: ", error);
});

module.exports =mongoose.connection