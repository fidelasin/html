var express=require('express');
var router=express.Router();


var ctrl=require('../controllers/apiController');


router.get('/',ctrl.swga)

module.exports=router; 