const jwt=require('jsonwebtoken');
const appError = require('../utils/appError');
const Redis = require("ioredis");
const redis = new Redis();

module.exports=async (socket,next)=>{
    try{
        const token = socket.handshake.query.token ||
        socket.handshake.headers.authorization.split(' ')[1];
       if(!token)
           next(new appError("You are not logged in please login!",400));
       const decoded=jwt.verify(token,process.env.JWT_SECRET);
       const redisKey = `user:${decoded.id}`
       redis.set(redisKey,socket.id);
       next();
    }catch(error){
        if(error.name==='TokenExpiredError')
            next(new appError("Your session has expired. Please log in again.",400))
        next(new appError("Invalid token. Please log in again."))
        }
}