const appError = require("../utils/appError");
const jwt=require('jsonwebtoken');
const {user}=require('../models/index');
const authCtrl={
    protected:async(req,res,next)=>{
        try{
            if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer'))
                return res.status(401).json({
                    message:"You are not logged in please login!"
                });
            const token=req.headers.authorization.split(" ")[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            const theUser=await user.findByPk(decoded.id);
            if(!theUser ||theUser.deletedAt!=null)
                return res.json({
                    message:"this user is no longer exist"
                });
                req.user=theUser;
                next();
            }catch(error){
            if(error.name==='TokenExpiredError')
            return res.status(401).json({
                    message:"Your session has expired. Please log in again."
            });
                    
            return res.status(401).json({
                    message: "Invalid token. Please log in again.",
            })
        }
    }
}
module.exports=authCtrl;