const express=require('express');   
const router=express.Router();
const PostCtrl=require('../controllers/Post');
const authCtrl=require('../middlewares/auth');
const uploadMiddleware=require('../middlewares/uploadingImages');
const resizeingMiddleware=require('../middlewares/rezingImages');
router.post('/createPost',authCtrl.protected,uploadMiddleware.upload.array('image_url', 10),resizeingMiddleware.resizeingImage('postsImages',0,0),
PostCtrl.createPost);
router.patch('/updatePost/:id',authCtrl.protected,PostCtrl.updatePost);
router.delete('/deletePost/:id',authCtrl.protected,PostCtrl.deletePost);
router.get('/getMYAllPosts',authCtrl.protected,PostCtrl.getMYAllPosts);
router.get('/getAPost/:id',authCtrl.protected,PostCtrl.getAPost);

module.exports=router;