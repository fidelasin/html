var express=require('express');
var router=express.Router();
const rateLimit = require('express-rate-limit')
const checkAuth = require('../middleware/token');



const limiter = rateLimit({
 windowMs: 2000,
 max: 1000,
 message: {
    limiter: true,
    type: "error",
    message: 'Çok fazla deneme beklemeniz gerekli'
  }

})

var ctrl=require('../controllers/apiController');





router.post('/userlogin/',ctrl.login)
router.post('/users/add',checkAuth,ctrl.usersAdd)
router.post('/user/edit',checkAuth,ctrl.userEdit)
router.get('/user/products/:id',checkAuth,ctrl.userProducts)
router.get('/user/get/:id',checkAuth,ctrl.userGetId)
router.get('/userget/all',checkAuth,ctrl.userGetAll)
router.get('/userget/allsite',checkAuth,ctrl.userGetAllSite)
router.post('/sorusor',checkAuth,ctrl.sorusor)
router.post('/sorusortek',checkAuth,ctrl.sorusortek)
router.get('/user/setting',checkAuth,ctrl.userSetting)
router.post('/user/user/edit',checkAuth,ctrl.userUserEdit)


router.get('/woo/product/add/:id',checkAuth,ctrl.wooProductsAdd)
router.get('/woo/product/delete/:id',checkAuth,ctrl.wooProductsDelete)
router.get('/woo/product/send/:id',checkAuth,ctrl.wooProductsSend)
router.post('/woo/product/createcategory',checkAuth,ctrl.wooProductsCreateCategory)
router.post('/woo/product/createattributes',checkAuth,ctrl.wooProductsCreateAttributes)

router.post('/products/add',checkAuth,ctrl.productsAdd)
router.get('/products/getall',checkAuth,ctrl.productGetAll)
router.get('/products/userGetall',checkAuth,ctrl.productUserGetAll)
router.get('/products/userGetallSite',checkAuth,ctrl.productUserGetAllSite)
router.get('/products/get/:ean',checkAuth,ctrl.productGet)
router.get('/products/getstock/:ean',checkAuth,ctrl.productGetStock)
router.get('/products/delete/:ean',checkAuth,ctrl.productDelete)

router.post('/order/edit',checkAuth,ctrl.orderEdit)
router.post('/order/create',checkAuth,ctrl.orderCreate)
router.get('/order/getall',checkAuth,ctrl.orderGetAll)
router.get('/order/get/:orderid',checkAuth,ctrl.orderGetId)
router.get('/order/ordercancel/:orderid',checkAuth,ctrl.orderCancel)

//router.post('/login',ctrl.loginPost)

router.post('/signup',limiter,ctrl.signup)

router.post('/verifity',ctrl.verifity)

//router.post('/forget',ctrl.forgetPost)

//router.post('/newpassword',ctrl.newpasswordPost)

//router.get('/cikis',controller.cikis);

module.exports=router; 