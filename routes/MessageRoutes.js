const express=require('express');
const router=express.Router();
const MessageCtrl=require('../controllers/Message');
const authCtrl=require('../middlewares/auth');
router.get('/fetchConversation/:id',authCtrl.protected,MessageCtrl.fetchConversation);
router.get('/fetchNumberOfChats',authCtrl.protected,MessageCtrl.fetchNumberOfChats);

module.exports=router;