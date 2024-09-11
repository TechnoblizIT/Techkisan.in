const jwt =require("jsonwebtoken");

module.exports.genrateTokenManager = function(manager){
   return jwt.sign({user:manager.username,role:"manager"},process.env.JWT_SECRET)
}