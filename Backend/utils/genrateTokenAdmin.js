const jwt =require("jsonwebtoken");

module.exports.genrateToken = function(admin){
   return jwt.sign({user:admin.Email,role:"admin"},process.env.JWT_SECRET)
}