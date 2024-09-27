const express=require('express');
const router=express.Router();
const UserCtrl=require('../controllers/User');
const authCtrl=require('../middlewares/auth');
const uploadMiddleware=require('../middlewares/uploadingImages');
const resizeingMiddleware=require('../middlewares/rezingImages');
router.post('/signUp',uploadMiddleware.upload.single('profile_picture'),resizeingMiddleware.resizeingImage('profileImages',100,100),
    UserCtrl.signUp);
router.post('/logIn',UserCtrl.logIn);
router.get('/logout',authCtrl.protected,UserCtrl.logout);
router.patch('/updateMe',authCtrl.protected,uploadMiddleware.upload.single('profile_picture'),resizeingMiddleware.resizeingImage('profileImages',100,100),UserCtrl.updateMe);
router.post('/forgetPassword',UserCtrl.forgetPassword);
router.patch('/resetPassword/:token',UserCtrl.resetPassword);
router.patch('/updatePassword',authCtrl.protected,UserCtrl.updatePassword);
router.get('/followAUser/:id',authCtrl.protected,UserCtrl.followAUser);
router.get('/UnfollowAUser/:id',authCtrl.protected,UserCtrl.UnfollowAUser);
router.get('/getMYAllFollowers',authCtrl.protected,UserCtrl.getMYAllFollowers);
router.delete('/deleteMe',authCtrl.protected,UserCtrl.deleteMe);
router.get('/DisplayAccount',authCtrl.protected,UserCtrl.DisplayAccount);
router.get('/DisplayNewPosts',authCtrl.protected,UserCtrl.DisplayNewPosts);
router.post('/searchForAUser',authCtrl.protected,UserCtrl.searchForAUser);
router.get('/getAllNotifications',authCtrl.protected,UserCtrl.getAllNotifications);

module.exports=router;