var express = require('express');
var ctrlMain = require('../controlers/main');
var router = express.Router();

/* GET home page. */
router.get('/', ctrlMain.index);



module.exports = router;
