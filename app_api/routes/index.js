const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controlers/locations');
const ctrlReviews = require('../controlers/reviews');

/*Locations*/
router.post('/locations', ctrlLocations.locationsCreate);
router.get('/locations', ctrlLocations.locationslistByDistance);
router.get('/locations/:locationid', ctrlLocations.locationsReadOne);
router.put('/locations/:locationid', ctrlLocations.locationsUpdateOne);
router.delete('/locations/:locationid', ctrlLocations.locationsDeleteOne);

/*Reviews*/
router.post('/locations/:locationid/reviews', ctrlReviews.reviewCreate);
router.get('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewReadOne);
router.put('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewUpdateOne);
router.delete('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewDeleteOne);

module.exports = router;