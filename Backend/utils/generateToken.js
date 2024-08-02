const jwt =require("jsonwebtoken");

module.exports.genrateToken = function(employee){
   return jwt.sign(employee.Email,process.env.JWT_SECRET)
}