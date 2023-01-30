var express=require('express');
var router=express.Router();

var ctrl=require('../controllers/addHisse');
router.get('/',ctrl.addHisseController);
module.exports=router;