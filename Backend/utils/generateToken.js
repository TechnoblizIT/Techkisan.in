const jwt =require("jsonwebtoken");

module.exports.genrateToken = function(employee){
   return jwt.sign(employee.username,process.env.JWT_SECRET)
}