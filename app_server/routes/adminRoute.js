var express=require('express');
var router=express.Router();

var ctrl=require('../controllers/adminController');

router.get('/',ctrl.index);

router.get('/users',ctrl.users)
router.get('/usersadd',ctrl.usersadd)
router.get('/products',ctrl.products)
router.get('/productadd',ctrl.productadd)


module.exports=router;