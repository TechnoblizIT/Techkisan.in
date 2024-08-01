const mongoose = require('mongoose')


const companySchema=mongoose.Schema({
     	 
ID :	String ,
No_Of_Employees	:Number,
Compay_Name :	String,
Establistment_date: 	Date,
Contact_No:	Number,
Email	:String ,
Address:	String ,
Emergency_Contact :Number,
Created_By:	String ,
Created_Date:	Date,
Last_modified_by :	String ,
Last_modified_date :	Date
})

module.exports = mongoose.model('Company', companySchema)