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
router.get('/followAUser/:id',authCtrl.protected,UserCtrl.followAUser);
router.get('/UnfollowAUser/:id',authCtrl.protected,UserCtrl.UnfollowAUser);
router.get('/getMYAllFollowers',authCtrl.protected,UserCtrl.getMYAllFollowers);
router.delete('/deleteMe',authCtrl.protected,UserCtrl.deleteMe);

router.patch('/DisplayAccount',UserCtrl.DisplayAccount);

module.exports=router;