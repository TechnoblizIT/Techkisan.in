const jwt =require("jsonwebtoken");

module.exports.genrateTokenIntern = function(intern){
   return jwt.sign({user:intern.username,role:"Intern"},process.env.JWT_SECRET)
}