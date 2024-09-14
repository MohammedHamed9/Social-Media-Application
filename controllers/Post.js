const {post}=require('../models/index');
const {user}=require('../models/index');

const {Op} = require('sequelize');
const appError=require('../utils/appError');
const PostCtrl={
    createPost:async(req,res,next)=>{
        try{    
            req.body.UserId=req.user.id;
            const newpost=await post.create(req.body);
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
            const Posts=await post.findAll({where:{UserId:req.user.id},
                include:{
                model: user,
                as:'postOwner',
                attributes: ['id', 'username'] 
            }});
            res.status('200').json({
                Posts
            })
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    getAPost:async(req,res,next)=>{
        try{    
            const thePost=await post.findByPk(req.params.id,
                {include:{
                    model: user,
                    as:'postOwner',
                    attributes: ['id', 'username'] 
                }});
            if(!thePost || thePost.UserId!=req.user.id){
                return next(new appError('this post is not exist or not yours!',400));
            }
            res.status(200).json({
                message:'the post is updated..',
                thePost
            })
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    
    },
}
module.exports=PostCtrl;