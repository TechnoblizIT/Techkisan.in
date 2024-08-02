const mongoose = require('mongoose')

const adminSchema=mongoose.Schema({
    Name:String,
    Email:String,
    Password:String,
})

module.exports=mongoose.model('Admin',adminSchema)