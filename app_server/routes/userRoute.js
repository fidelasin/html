var express=require('express');
var router=express.Router();

var ctrl=require('../controllers/userController');

router.get('/',ctrl.index);


router.get('/products',ctrl.products)
router.get('/productssite',ctrl.productssite)
router.get('/setting',ctrl.setting)


module.exports=router;