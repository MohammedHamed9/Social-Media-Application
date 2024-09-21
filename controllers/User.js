const {user}=require('../models/index');
const {userFollowers}=require('../models/index');
const EmailCtrl=require('../utils/Email');

const {Op} = require('sequelize');
const crypto=require('crypto');
const jwt=require('jsonwebtoken');
const appError=require('../utils/appError');
const bcrypt=require('bcrypt')

const signToken=(id)=>{
    const token =jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.EXPIRED_DATE
    });
    return token;
}

const createCookie=(token,res)=>{
    const cookieOptions=
    {
        expires:new Date(Date.now()+process.env.COOKIE_EXPIRES_DATE*24*60*60*1000),
        httpOnly:true
    };
    if(process.env.NODE_ENV=='production') cookieOptions.secure=true
    res.cookie('jwt',token,cookieOptions);
}  
const UserCtrl={
    signUp:async(req,res,next)=>{
        try{
            console.log(req.body);
            const {username,email,password,bio}=req.body;
            let profile_picture="";
            if (req.file && req.file.path) {
                profile_picture = req.file.path;
            }
            const newUser=await user.create({username,email,password,bio,profile_picture});
            const token=signToken(newUser.id);
            createCookie(token,res);    
            res.status(201).json({
                message:"welcome to the App",
                token,
                newUser
            })
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    logIn:async(req,res,next)=>{
        try{
            const {email,password}=req.body;
            const theUser=await user.findOne({where:{email}});
            if(!theUser || ! await bcrypt.compare(password, theUser.password)){
                return next(new appError('the email or the password is wrong!',400));
            }
            const token=signToken(theUser.id);
            createCookie(token,res);    
            res.status(201).json({
                message:"welcome to the App",
                token,
            })
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    logout:(req,res,next)=>{
        res.cookie('jwt','loggedout',{
         expires:new Date (Date.now()+10*1000),
         httpOnly:true
        });
        res.status(200).json({
         message:'loggedout successfully..'
        });
    },
    updateMe:async(req,res,next)=>{
        try{
            if(req.body.password){
                return next(new appError('sorry thie route is not for updating password!',400));
            }
            const theUser=await user.findByPk(req.user.id);
            if(!theUser){
                return next(new appError('this user is not exist!',400));
            }
            console.log(req.file);
            if (req.file && req.file.path) {

                req.body.profile_picture = req.file.path;
            }
            const newUser=await user.update(req.body,{where:{id:req.user.id}});
            res.status(201).json({  
                message:"the user is updated",
                newUser,
            })
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    deleteMe:async(req,res,next)=>{
        try{
            const password=req.body.password;
            if(!await bcrypt.compare(password, req.user.password))
                return next(new appError('sorry the password is wrong!',401))
            
            await user.destroy({where:{id:req.user.id},force:1});
            res.status(203).json({
                message:'the user is deleted..'
            });
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    //NOT IMP FROM HERE
    forgetPassword:async(req,res,next)=>{
        try{
            const theUser=await user.findByPk(req.user.id);
            if(!theUser){
                return next(new appError('This user is not found!',404));
            }
            const RestToken=crypto.randomBytes(32).toString('hex');
            theUser.passwordRestToken=crypto.
            createHash('sha256').update(RestToken).digest('hex');
            theUser.passwordRestExpires=new Date()+ 10*60*1000 //10mins
            await theUser.save();
            const restUrl=`${req.get('host')}/api/user/resetPassword/${RestToken}`
            EmailCtrl.sendrestPassEmail(
                "password Reset , Your password reset token (valid for only 10 minutes)"
            ,restUrl,theUser);
            res.status(200).json({
                message:'the email is sent...'
            })
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    resetPassword:async(req,res,next)=>{
        try{
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    updatePassword:async(req,res,next)=>{
        try{
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    //IMP
    followAUser:async(req,res,next)=>{
        try{
            //check if this user exist
            const theUser=await user.findByPk(req.params.id);
            if(!theUser || theUser.deletedAt!=null){
                return res.status(404).json({
                    message:'this user is not exists!'
                });
            }

            //follow the user
            const following =await userFollowers.findOne({
                where:{
                    followerId:req.user.id,
                    followingId:req.params.id,
                    deletedAt: { [Op.is]: null }
                }});
            
            if(following){
                return res.status(400).json({
                    message:`you are following  ${theUser.username} already!`
                });
            }
            const userFollow=await userFollowers.create({followerId:req.user.id,followingId:req.params.id});
            
            res.status(200).json({
                message:`you are following now ${theUser.username}`
            })
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    UnfollowAUser:async(req,res,next)=>{
        try{
            const theUser=await user.findByPk(req.params.id);
            if(!theUser || theUser.deletedAt!=null){
                return res.status(404).json({
                    message:'this user is not exists!'
                });
            }

            //unfollow the user
            const following =await userFollowers.findOne({
                where:{
                    followerId:req.user.id,
                    followingId:req.params.id,
                    deletedAt: { [Op.is]: null }
                },
            });
            if(following){
                await following.destroy();
                return res.status(200).json({
                    message:`you are unfollowing  ${theUser.username} now`
                });
            }
            /*await userFollowers.destroy({where:{ followerId:req.user.id,
                followingId:req.params.id}})*/
                res.status(200).json({
                    message:`you are not following  ${theUser.username} already!`
                });
              
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    getMYAllFollowers:async(req,res,next)=>{
        try{
            const following =await userFollowers.findAll({
                where:{
                    followingId:req.user.id,
                    deletedAt: { [Op.is]: null }
                },
                include:[
                    {
                      model: user,
                      as:'following',
                      attributes: ['id', 'username'] 
                    },
                    {
                        model: user,
                      as: 'followers', 
                      attributes: ['id', 'username'] 
                    }
                  ]
            });

                res.status(200).json({
                    following
                });
              
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    //NOT IMP
    DisplayAccount:async(req,res,next)=>{
        try{
        
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    DisplayfollowedUserPosts:async(req,res,next)=>{
        try{
        
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },

}
module.exports=UserCtrl;
