const Redis = require("ioredis");
const redis = new Redis();
const {user}=require('../models/index');

module.exports=async(io,socket)=>{
    console.log(`new connection from ${socket.id}`);
    socket.on('follow',async(followingId)=>{
        const followerSocketId= await redis.get(`user:${followingId}`)
        const theUser=await user.findByPk(followingId);
        io.to(followerSocketId).emit('notification',`You have a new follower: ${theUser.username}`)
    });

    socket.on('disconnect',async()=>{
        const date='user:ca762238-00a3-4f93-802a-865a3b2d23ee'
        await redis.del(date) 
   })
}
