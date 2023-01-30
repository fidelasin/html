var express=require('express');
var router=express.Router();

var controller=require('../controllers/controlController');
router.get('/login',controller.login);
router.post('/login',controller.loginPost)

router.get('/signup',controller.signup);
router.post('/signup',controller.signupPost)

router.post('/verifity',controller.verifityPost)

router.get('/signupOk',controller.signupOk)

router.get('/forget',controller.forget)
router.post('/forget',controller.forgetPost)

router.get('/newpassword/:id',controller.newpassword)
router.post('/newpassword',controller.newpasswordPost)

router.get('/cikis',controller.cikis);

module.exports =router; 