var express = require('express');
var ctrlLocation = require('../controlers/location');
var ctrlOther = require('../controlers/other');
var router = express.Router();

/* GET Location */
router.get('/', ctrlLocation.homeList);
router.get('/location', ctrlLocation.locationInfo);
router.get('/location/review/new', ctrlLocation.addReview);

/* Page About */
router.get('/about', ctrlOther.about);


module.exports = router;
