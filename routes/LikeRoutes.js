const express=require('express');   
const router=express.Router();
const LikeCtrl=require('../controllers/Like');
const authCtrl=require('../middlewares/auth');
router.get('/:id',authCtrl.protected,LikeCtrl.addLike);
router.delete('/:id',authCtrl.protected,LikeCtrl.removeLike);
router.get('/',authCtrl.protected,LikeCtrl.getAllLiks);

module.exports=router;