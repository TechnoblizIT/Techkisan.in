const jwt =require("jsonwebtoken");

module.exports.genrateToken = function(employee){
   return jwt.sign({user:employee.username,role:"employee"},process.env.JWT_SECRET)
}