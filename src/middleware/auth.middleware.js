const jwt = require('jsonwebtoken');
const UserModel=require('../Models/user.model')
const blacklistModel = require('../Models/blacklist.model.js')

/**
 * JWT authentication middleware.
 * Checks for a valid JWT token in the Authorization header or cookie.
 * If valid, attaches the user info to req.user and calls next().
 * Otherwise, responds with 401 Unauthorized.
 */
const authMiddelware = async (req, res, next) => {
  
   const token = req.cookies.token || req.headers.authorization.split(" ")[1]
  

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

   const isTokenBlacklisted= await blacklistModel.findOne({token})
    
    if(isTokenBlacklisted){
      return res.status(401).json({message:'Token is blacklisted , Login again'})
    }


  try {

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
       
                
     const user = await UserModel.findById(decoded.userId)
 
     req.user=user

      next()

    
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authSystemUserMiddleware=async (req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization.split(" ")[1]
  

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }
  
   const isTokenBlacklisted= await blacklistModel.findOne({token})
    
    if(isTokenBlacklisted){
      return res.status(401).json({message:'Token is blacklisted , Login again'})
    }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
       
     const user=await UserModel.findById(decoded.userId).select("+systemUser")      

     if(!user.systemUser){
        return res.status(401).json({ message: 'You are not autorized to perform this action' });
     }

     req.user=user
     next()
    
    ;
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
module.exports = {authMiddelware,authSystemUserMiddleware};