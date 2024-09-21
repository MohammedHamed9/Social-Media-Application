const {post}=require('../models/index');
const {comment}=require('../models/index');
const {user}=require('../models/index');

const {Op} = require('sequelize');
const appError=require('../utils/appError');
const CommentCtrl={
    createComment:async(req,res,next)=>{
        try{  
            const PostId=req.params.id;
            const thePost=await post.findByPk(PostId);
            if(!thePost){
                return next(new appError('this post is no longer exists',404));
            }
            req.body.UserId=req.user.id;
            req.body.PostId =PostId;
            const newComment=await comment.create(req.body);
            res.status(201).json({
                message:"the comment is created",
                newComment
            })
        }catch(error){
            console.log(error);
            next(new appError(error,500));
        }
    },
    updateComment:async(req,res,next)=>{
        try{   
            const theComment=await comment.findByPk(req.params.id);
            if(!theComment || theComment.UserId!=req.user.id){
                return next(new appError('this Comment is not exist or its not  yours!',400));
            }
            theComment.content=req.body.content;
            await theComment.save();
            res.status(200).json({
                message:'the Comment is updated..',
                theComment
            })
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    deleteComment:async(req,res,next)=>{    
        try{   
            const theComment=await comment.findByPk(req.params.id);
            if(!theComment || theComment.UserId!=req.user.id){
                return next(new appError('this Comment is not exist or its not  yours!',400));
            }
            theComment.destroy();
            res.status(200).json({
                message:'the Comment is deleted..',
            })
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    getMYAllComments:async(req,res,next)=>{
        try{  
            
            const postId=req.originalUrl.split('/')[3]
            let comments=""
            if(postId){
                 comments=await comment.findAll({where:{PostId:postId},
                    include:{
                        model:user,
                        attributes:['username']
                    },
                    attributes:['id','content']
                });
            }else{
                 comments=await comment.findAll({
                    include:[{
                        model:user,
                        attributes:['username']
                    },{
                        model:post,
                        attributes:['content']
                    }]
                    ,
                    attributes:['id','content']
                });
            }
            res.status('200').json({
                comments
            })
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    getAComment:async(req,res,next)=>{
        try{    
            const theComment=await comment.findByPk(req.params.id,
                {
                    include:[
                    {
                    model:user,
                    attributes:['username']
                },{
                    model:post,
                    attributes:['content']
                }]});
            if(!theComment || theComment.UserId!=req.user.id){
                return next(new appError('this comment is not exist or not yours!',400));
            }
            res.status(200).json({
                theComment
            })
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    
    },
}
module.exports=CommentCtrl;