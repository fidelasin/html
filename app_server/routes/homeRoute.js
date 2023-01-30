var express=require('express');
var router=express.Router();

var ctrlHome=require('../controllers/homeController');
router.get('/',ctrlHome.index);
module.exports=router;