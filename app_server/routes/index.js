var express = require('express');
var ctrlLocation = require('../controlers/location');
var ctrlOther = require('../controlers/other');
var router = express.Router();

/* GET Location */
router.get('/', ctrlLocation.homeList);
router.get('/location/:locationid', ctrlLocation.locationInfo);
router.get('/location/:locationid/review/new', ctrlLocation.addReview);
router.post('/location/:locationid/review/new', ctrlLocation.doAddReview);

/* Page About */
router.get('/about', ctrlOther.about);


module.exports = router;
