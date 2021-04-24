const express = require('express');
const router=express.Router(); //Router method use 
const controller=require('../controller/user'); //Require controller path
const { verifyTokenFn } = require("../lib/jwt");
//Router
//------------- User-Router ------------- 
router.post('/addUser',controller.addUser);
router.put('/editUser',verifyTokenFn,controller.editUser);
router.delete('/deleteUser',verifyTokenFn,controller.deleteUser);
router.get('/showUserList',verifyTokenFn,controller.showUserList);
router. post('/filterUserList',verifyTokenFn,controller.filterUserList);
router. post('/login',controller.login);
//Module export to router
module.exports=router;