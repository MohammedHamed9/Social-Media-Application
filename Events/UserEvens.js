const Redis = require("ioredis");
const redis = new Redis();
const {user}=require('../models/index');
const {message}=require('../models/index');
const { where } = require("sequelize");

module.exports=async(io,socket)=>{
    console.log(`new connection from ${socket.id}`);
    socket.on('follow',async(followingId)=>{
        const followerSocketId= await redis.get(`user:${followingId}`)
        const theUser=await user.findByPk(followingId);
        io.to(followerSocketId).emit('notification',`You have a new follower: ${theUser.username}`)
    });
    socket.on('sendMessage',async(data)=>{
        //data: content senderId receiverId
        try{
            const {content,receiverId}=data;
            const senderId=socket.user;
            const newMessage=await message.create({content,senderId,receiverId});
            let receiverSocketId=await redis.get(`user:${receiverId}`);
            const sender=await user.findByPk(senderId);
            io.to(receiverSocketId).emit('chatMessage',{
                id: newMessage.id,
                content: newMessage.content,
                sender: {
                    id: sender.id,
                    name: sender.username 
                },
                createdAt: newMessage.createdAt
            })
        }catch(error){
            console.error('Error sending message: ', error);
        }
    });
    socket.on('fechMessage',async(MessageId)=>{
        try{
            const theMsg=await message.findByPk(MessageId)
            theMsg.read_status=true;
            await theMsg.save();
            let mySocket=await redis.get(`user:${socket.user}`);
            io.to(mySocket).emit('chatMessage',theMsg.content)
        }catch(error){
            console.error('Error sending message: ', error);
        }
    });
    socket.on('disconnect',async()=>{
        await redis.del(`user:${socket.user}`) 
   });
}
