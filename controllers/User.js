const {user}=require('../models/index');
const {post}=require('../models/index');
const {notification}=require('../models/index');

const {userFollowers}=require('../models/index');
const EmailCtrl=require('../utils/Email');
const Redis = require("ioredis");
const redis = new Redis();
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
    forgetPassword:async(req,res,next)=>{
        try{
            const email=req.body.email;
            const theUser=await user.findOne({where:{email}});
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
        const hashedtoken=crypto.
        createHash('sha256').update(req.params.token).digest('hex');
        const theUser=await user.findOne({
            where:{
            passwordRestToken:hashedtoken,
            passwordRestExpires:{
                [Op.gt]:new Date()
            }   
        }});
        if(!theUser){
            return next(new appError('Token is invalid or has expired',400));
        }

        let password=req.body.password;
            theUser.password = password;
            theUser.passwordRestToken = undefined;
            theUser.passwordRestExpires = undefined;
            await theUser.save();
        res.status(200).json({
            message:'the password is updated..',
        });
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    updatePassword:async(req,res,next)=>{
        try {
            const oldPassword=req.body.oldPassword;
            const newPassword=req.body.newPassword;
            //not true tell the user sorry  
            console.log(oldPassword);
            console.log(req.user.password)
            let flage=await bcrypt.compare(oldPassword,req.user.password)
            if(!flage){
                return next (new appError('sorry the password is wrong!',400))
            }
            req.user.password=newPassword;           
            await req.user.save();
            res.status(200).json({
                message:'the password is updated successfully..'
            });
        } catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    followAUser:async(req,res,next)=>{
        try{
            //check if this user exist
            if(req.params.id==req.user.id){
                return res.status(400).json({
                    message:'you cant follow yourself!'
                });
            }
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
            
            const followingSocketId= await redis.get(`user:${req.params.id}`)
            req.io.to(followingSocketId).emit('notification',`${req.user.username} started following you`)
            const thenotification=await notification.create({
                type:'follow',
                message:`You have a new follower: ${req.user.username}`,
                UserId:theUser.id
            });
            redis.del(`userFollowers:${req.params.id}`);
            redis.del(`userFollowers:${req.user.id}`);

            res.status(200).json({
                message:`you are following now ${theUser.username}`
            });
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
            let results=null;
            const key=`userFollowers:${req.user.id}`;
            let value=await redis.get(key);
            if(!value){
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
                await redis.set(key,JSON.stringify(following),"EX", 2*60*60);
                results=following;
            }
            else{
                console.log('cach hit');
                results=JSON.parse(value)
            }

                res.status(200).json({
                    results
                });
              
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    DisplayAccount:async(req,res,next)=>{
        try{
            const key =`userAcount:${req.user.id}`;
            const value=await redis.get(key);
            if(value){
                console.log('cache hit')
                const results=JSON.parse(value);
                return res.status(200).json({
                    results
                })
            }
            const myAcc=await user.findByPk(req.user.id,{
               attributes:['username','profile_picture','bio']
            });
            const posts=await post.findAndCountAll({where:{UserId:req.user.id},
                order:[['createdAt','DESC']],
                attributes:['content','image_url']

            });
            const numOfFollowers=await userFollowers.findAndCountAll({
                where:{
                    followingId:req.user.id,
                    deletedAt: { [Op.is]: null }
                }})
                const numOfpeopleIFollow=await userFollowers.findAndCountAll({
                    where:{
                        followerId:req.user.id,
                        deletedAt: { [Op.is]: null }
                    }})
            myAcc.dataValues.PostNumber=posts.count
            myAcc.dataValues.myPosts=posts.rows
            myAcc.dataValues.Followers=numOfFollowers.count
            myAcc.dataValues.following=numOfpeopleIFollow.count
            redis.set(key,JSON.stringify(myAcc),"EX",60*60);
            res.status(200).json({
                myAcc
            })
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    DisplayNewPosts:async(req,res,next)=>{
        try{
            //list followers id in array 
            const numOfpeopleIFollow=await userFollowers.findAll({
                where:{
                    followerId:req.user.id,
                    deletedAt: { [Op.is]: null }
                }});
                let arrayOfId=[]
                numOfpeopleIFollow.map((el,index)=>{
                    arrayOfId.push(numOfpeopleIFollow[index].dataValues.followingId) 
                })
                const posts=await post.findAll({where:{
                    UserId:{
                        [Op.in]:arrayOfId
                    }
                },
                order:[['createdAt','DESC']],
            })
                res.status(200).json({
                    posts
                })
            //get all posts that UsetId is in that list

        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    searchForAUser:async(req,res,next)=>{
        try{
            const key=`searchForAUser:${req.body.name}`;
            const value=await redis.get(key);
            if(value){
            return res.status(200).json({user:JSON.parse(value)})
            }
            const users=await user.findAll({where:{
                username:{
                    [Op.like]:`%${req.body.name}%`
                }
                }});
            redis.set(key,JSON.stringify(users),'EX',60*60)
            res.status(200).json({users})
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
    getAllNotifications:async(req,res,next)=>{
        try{
            const notifications=await notification.findAll({where:{UserId:req.user.id},
        order:[['createdAt','DESC']]});
            if(notifications){
                for(let i=0 ;i<notifications.length ;i++){
                    notifications[i].read_status=true;
                    await notifications[i].save();
                }
            }
            res.status(200).json({notifications})
        }catch(error){
            console.log(error);
            next(new appError('somtheing went wrong!',500));
        }
    },
}
module.exports=UserCtrl;
