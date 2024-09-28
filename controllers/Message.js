const {message}=require('../models/index');
const {user}=require('../models/index');
const Redis = require("ioredis");
const redis = new Redis();
const {Op,col} = require('sequelize');
const appError=require('../utils/appError');
const MessageCtrl={
    fetchConversation:async(req,res,next)=>{
        try{  
            const otherUserId=req.params.id;
            const conversation=await message.findAll({where:{
                [Op.or]:[
                    { senderId: req.user.id, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: req.user.id }
                ]
            },
                include:[{
                model: user,
                as:'sending',
                attributes: ['username'] 
            },
            {
                model: user,
                as:'receiving',
                attributes: ['username'] 
            }],
            limit: parseInt(req.query.limit)|| 50,
            offset:parseInt(req.query.offset)||0,
            order:[['createdAt','DESC']],

        },);
        if(conversation){
            for(let i=0 ;i<conversation.length ;i++){
                conversation[i].read_status=true;
                await conversation[i].save();
            }
        }
            res.status("200").json({
                conversation
            });
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    fetchNumberOfChats:async(req,res,next)=>{
        try{
            const conversationsNumber = await message.count({
                distinct: true, // Apply distinct count
                col: 'senderId',  
                where: {
                    receiverId: req.user.id,
                    read_status: null
                },
                attributes:['senderId']
            });  
            const conversations = await message.findAndCountAll({
                group: ['senderId'],  
                where: {
                    receiverId: req.user.id,
                    read_status: null
                },
                attributes:['senderId']
            });
            
            res.status("200").json({
                conversationsNumber,
                chats:conversations.count
            });
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    }
}
module.exports=MessageCtrl;
