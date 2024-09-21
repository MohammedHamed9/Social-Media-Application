const express=require('express');   
const router=express.Router();
const CommentCtrl=require('../controllers/Comment');
const authCtrl=require('../middlewares/auth');
router.post('/createComment/:id',authCtrl.protected,CommentCtrl.createComment);
router.patch('/updateComment/:id',authCtrl.protected,CommentCtrl.updateComment);
router.delete('/deleteComment/:id',authCtrl.protected,CommentCtrl.deleteComment);
router.get('/',authCtrl.protected,CommentCtrl.getMYAllComments);
router.get('/:id',authCtrl.protected,CommentCtrl.getAComment);

module.exports=router;