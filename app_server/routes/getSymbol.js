var express =require('express')
var router =express.Router();

var ctrl = require('../controllers/getSymbol')

router.get('/one/:symbol',ctrl.getSymbol)
router.get('/all/',ctrl.getSymbolAll)
router.post('/more/',ctrl.getSymbolAll)

module.exports =router;