const {post}=require('../models/index');
const {user}=require('../models/index');
const {userFollowers}=require('../models/index');
const {notification}=require('../models/index');

const Redis = require("ioredis");
const redis = new Redis();
const {Op} = require('sequelize');
const appError=require('../utils/appError');
const PostCtrl={
    createPost:async(req,res,next)=>{
        try{    
            req.body.UserId=req.user.id;
            const newpost=await post.create(req.body);
            const numOfpeopleIFollow=await userFollowers.findAll({
                where:{
                    followerId:req.user.id,
                    deletedAt: { [Op.is]: null }
                }});
                let arrayOfId=[]
                numOfpeopleIFollow.map((el,index)=>{
                    arrayOfId.push(numOfpeopleIFollow[index].dataValues.followingId) 
                });
                for(let i=0; i<arrayOfId.length;i++){
                    const followingSocketId= await redis.get(`user:${arrayOfId[i]}`)
                    req.io.to(followingSocketId).emit('notification',`${req.user.username} Added New Post`)
                }
            res.status(201).json({
                message:"the post is created",
                newpost
            })
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    updatePost:async(req,res,next)=>{
        try{   
            const thePost=await post.findByPk(req.params.id);
            if(!thePost || thePost.UserId!=req.user.id){
                return next(new appError('this post is not exist or not yours!',400));
            }
            thePost.content=req.body.content;
            await thePost.save();
            res.status(200).json({
                message:'the post is updated..',
                thePost
            })
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    deletePost:async(req,res,next)=>{
        try{   
            const thePost=await post.findByPk(req.params.id);
            if(!thePost || thePost.UserId!=req.user.id){
                return next(new appError('this post is not exist or not yours!',400));
            }
            thePost.destroy();
            res.status(200).json({
                message:'the post is deleted..',
            })
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    getMYAllPosts:async(req,res,next)=>{
        try{  
            const key =`userPosts:${req.user.id}`;
            const value=await redis.get(key);
            if(value){
                console.log('cache hit')
                const results=JSON.parse(value);
                return res.status(200).json({
                    posts:results
                })
            }
            const Posts=await post.findAll({where:{UserId:req.user.id},
                include:{
                model: user,
                as:'postOwner',
                attributes: ['id', 'username'] 
            }});
            redis.set(key,JSON.stringify(Posts),"EX",60*60);
            res.status('200').json({
                Posts
            });
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    getAPost:async(req,res,next)=>{
        try{    
            const key =`ThePost:${req.params.id}`;
            const value=await redis.get(key);
            if(value){
                console.log('cache hit')
                const results=JSON.parse(value);
                return res.status(200).json({
                    post:results
                })
            }
            const thePost=await post.findByPk(req.params.id,
                {include:{
                    model: user,
                    as:'postOwner',
                    attributes: ['id', 'username'] 
                }});
            if(!thePost ){
                return next(new appError('this post is not exist !',400));
            }
            redis.set(key,JSON.stringify(thePost),"EX",60*60);
            res.status(200).json({
                thePost
            })
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    
    },
}
module.exports=PostCtrl;