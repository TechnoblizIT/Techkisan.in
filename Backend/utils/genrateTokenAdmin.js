const jwt =require("jsonwebtoken");

module.exports.genrateToken = function(admin){
   return jwt.sign(admin.Email,process.env.JWT_SECRET)
}