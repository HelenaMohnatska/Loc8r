const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

function sendJsonResponse(res,status,content){
	res.status(status);
	res.json(content);
};
const updateAvergeRation = function (locationId) {
	Loc
		.findById(locationId)
		 .select('rating reviews')
		.exec((err, location) => {
			if(!err){
				doSetReview(location);
			} 
		})
}
const doSetReview = function(location) {
	
	if(location.reviews && location.reviews.length > 0) {
		let ratingCount = location.reviews.length;
		let totalRating = 0;
		for(let i = 0; i < ratingCount; i++){
			totalRating = totalRating + location.reviews[i].rating;
		}
		AvergeRation = parseInt(totalRating/ratingCount, 10);
		location.rating = AvergeRation;
		location.save((err) => {
			if(err){
				consle.log(err);
			} else {
				console.log("avaregeRating apdate to "+ AvergeRation);
			}
		})
	} else {
		console.log("no reviews");
	}
}

const doAddReview = function (req, res, location) {
	if(!location){
		sendJsonResponse(res, 400, {message: "no found locationid"});
	} else {
	location.reviews.push({
		author: req.body.author,
        rating: req.body.rating,
		textReview: req.body.textReview
});
	
	location.save((err, location) => {
		let thisReview;
		if(err) {
			console.log(err);
			sendJsonResponse(res, 400, err);
		} else {
			updateAvergeRation(location._id);
			thisReview = location.reviews[location.reviews.length - 1];
			sendJsonResponse(res, 201, thisReview);
		}
	})
	}
};

const reviewCreate = function (req, res) {
	const locationid = req.params.locationid;
	if (locationid) {
    Loc
      .findById(locationid)
      .select('reviews')
      .exec((err, location) => {
      	if (err) {
         sendJsonResponse(res, 400, err);
        } else {
          doAddReview(req, res, location);
        }
      }
    );
  } else {
    sendJsonResponse(res, 404, { message: "Not found, locationid required" });
  }
};

const reviewReadOne = function (req, res) {

	if(req.params.locationid && req.params.reviewid){
 		  Loc
			.findById(req.params.locationid)
			
			.exec((err, location) => {
			var response;
			if(!location) {
 				sendJsonResponse(res, 404, 
 					{ mesage: "locationid not found" });
 				return;
 			}
 			else if(err) {
 				sendJsonResponse(res, 400, err);
 				return;
 			}
			
 			if(location.reviews && location.reviews.length > 0) {
			const review = location.reviews.id(req.params.reviewid);
			 if(!review) {
			 	sendJsonResponse(res, 400, {message: "reciewid not found"});
			 } else {
			 		response = {
 						location:{
 							name:location.name,
 							id:req.params.reviewid
 						},
 						review:review
 					};
 					sendJsonResponse(res, 200, response);
 				}
 			} else { 
 				sendJsonResponse(res, 404, "no reviews find");
 	  };
 			
	});
 	} else { 
 			sendJsonResponse(res, 404, "no locationid and reviewid are both in request");
 	  };
 	
};
const reviewUpdateOne = function (req, res) {
	if(!req.params.locationid  || !req.params.reviewid) {
		sendJsonResponse(res, 404, {message: "not found locationid and reviewId are bouth"});
		return;
	}
	Loc
		.findById(req.params.locationid)
		.select("reviews")
		.exec((err, location) => {
			let thisReview;
			if(err){
				sendJsonResponse(res, 400, err);
			} else if(!location) {
				sendJsonResponse(res, 404, { message: "no found location"});
				return;
			}
			if(location.reviews && location.reviews.length > 0) {
				thisReview = location.reviews.id(req.params.reviewid);
				if(!thisReview) {
					sendJsonResponse(res, 404, {message: "no found reviewid"})
				} else {
					thisReview.author = req.body.author;
					thisReview.rating = req.body.rating;
					thisReview.textReview = req.body.textReview;

				location.save((err, review) => {
				if(err){
					sendJsonResponse(res, 400, err);
					return;
				}
				updateAvergeRation(location._id);
				sendJsonResponse(res, 200, thisReview);
			})
			}
			} else {
				sendJsonResponse(res, 404, {message: "no review to update"})
			}
		}) 
};
const reviewDeleteOne = function (req, res) {
	if(!req.params.locationid || !req.params.reviewid) {
		sendJsonResponse(res, 404, { message: "not found locationid and reviewId are bouth"});
		return;
	}
	Loc
	   .findById(req.params.locationid)
	   .select("reviews")
	   .exec((err, location)=> {
	   		if(err) {
	   			sendJsonResponse(res, 400, err);
	   			return;
	   		}
	   		else if(!location) {
	   			sendJsonResponse(res, 400, {message:"location not found"});
	   			return;
	   		}
	   		if(location.reviews && location.reviews.length > 0) {
	   			console.log(location.reviews.id(req.params.reviewid));
	   			if(!location.reviews.id(req.params.reviewid)) {
	   				sendJsonResponse(res, 404, {message: "review no found"});
	   				return;
	   			} 
	   			location.reviews.id(req.params.reviewid).remove();
	   			location.save((err)=> {
	   				if(err){
	   					sendJsonResponse(res, 404, err);
	   				} else {
	   					updateAvergeRation(location._id);
	   					sendJsonResponse(res, 204, null);
	   				}
	   			});
	   		} else {
	   			sendJsonResponse(res, 404, {message: "no review to delete"});
	   		}
	   })
};

module.exports = {
	reviewCreate,
	reviewReadOne,
	reviewUpdateOne,
	reviewDeleteOne
};