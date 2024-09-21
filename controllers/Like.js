const {post}=require('../models/index');
const {like}=require('../models/index');
const {user}=require('../models/index');

const {Op} = require('sequelize');
const appError=require('../utils/appError');
const LikeCtrl={
    addLike:async(req,res,next)=>{
        try{  
            const PostId=req.params.id;
            const thePost=await post.findByPk(PostId);
            if(!thePost){
                return next(new appError('this post is no longer exists',404));
            }
            const theLike=await like.findOne({where:{PostId,UserId:req.user.id}});
            if(theLike){
                return next(new appError('sorry you liked this post already',404));
            }
            req.body.UserId=req.user.id;
            req.body.PostId =PostId;
            const liked=await like.create(req.body);
            res.status(201).json({
                message:"the Like is added",
                liked
            })
        }catch(error){
            console.log(error);
            next(new appError(error,500));
        }
    },
    removeLike:async(req,res,next)=>{    
        try{   
            const PostId=req.params.id;
            const theLike=await like.findOne({where:{PostId:PostId}});
            if(!theLike || theLike.UserId!==req.user.id){
                return next(new appError('you dont like this post already!',404));
            }
            theLike.destroy();
            res.status(200).json({
                message:'the Like is removed..',
            })
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    getAllLiks:async(req,res,next)=>{
        try{  
            const PostId=req.originalUrl.split('/')[3]
            const Likes=await like.findAll({where:{PostId:PostId},
                include:{
                model: user,
                attributes: ['username'] 
            }});
            res.status('200').json({
                Likes
            })
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
}
module.exports=LikeCtrl;