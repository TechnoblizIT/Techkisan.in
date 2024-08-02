const mongoose = require('mongoose')


const employeeSchema=mongoose.Schema({
    ID :	String ,
 	Company_Id:Number ,
 	Name 	:String ,
 	DOB :	Date,
 	Contact_No:	Number,
 	Email:	String ,
	Password:    String ,
 	Address:	String ,
 	Sex :	String ,
 	Blood_Group	:String ,
 	Emergency_Contact :Number,
 	Depatment :String ,
 	Retirement_Date :Date,
 	Joining_Date 	:Date,
 	Confirmation_Date	:Date,
 	Education :String ,
 	Created_By :String ,
 	Created_Date :	Date,
 	Last_modified_by :	String ,
 	Last_modified_date: 	Date
})

module.exports = mongoose.model('Employee', employeeSchema)