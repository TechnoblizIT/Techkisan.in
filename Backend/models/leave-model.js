const mongoose = require('mongoose')

const levaeSchema=mongoose.Schema({
    typeofLeaves:String,
    fromDate:Date,
    toDate:Date,
    employeeId:{
        type:mongoose.Schema.ObjectId,
        ref: 'Employee',
    },
    fromTime:String,
    toTime:String,
    reason:String,
    vocationalAddress:String,
    contactno:Number,
    leaveStatus:{
        type:String,
        default:'Pending',
        enum:['Pending','Approved','Denied']
    }
})

module.exports=mongoose.model('Leave',levaeSchema)