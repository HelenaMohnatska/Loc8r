const mongoose = require('mongoose');
require('./locations');
const Loc = mongoose.model('Location');

const Earth = (function(){
	const earthRadius = 6317;
	const getDistanceFromRads = function(dist){
		return parseFloat(dist/earthRadius);
	};
	const getRadsFromDistance = function(rads){
		return parseFloat(rads*earthRadius);
		
	}
	return{
		getDistanceFromRads:getDistanceFromRads,
		getRadsFromDistance:getRadsFromDistance
	}
})();

function sendJsonResponse(res,status,content){
	res.status(status);
	res.json(content);
}

const locationsReadOne = function (req, res) {
	if(req.params && req.params.locationid){
 		Loc
 		.findById(req.params.locationid)
 		.exec((err, location) => {
 			if(!location){
 				sendJsonResponse(res, 404,{
 					"mesage": "locationid not found"
 				});
 				return;
 			}
 			else if(err){
 				sendJsonResponse(res, 404, err);
 				return;
 			}
 			
			sendJsonResponse(res, 200, location);
		});
 	} else { 
 			sendJsonResponse(res, 404, "no locationid in request");
 	  };
 	
};

const locationsCreate = function (req, res) {
	Loc.create({
		name:req.body.name,
		address:req.body.address,
		facilities:req.body.facilities.split(","),
		coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
		openingtime: [
		{
			days:req.body.days1,
			opening:req.body.opening1,
			closing:req.body.closing1,
			closed:req.body.closed1
		},
		{
			days:req.body.days2,
			opening:req.body.opening2,
			closing:req.body.closing2,
			closed:req.body.closed2
		}
		]
	}, (err, location) => {
       if(err){
       	sendJsonResponse(res, 404, err);
       } else {
       	sendJsonResponse(res, 200, location)
       }
	} );
	
}
	
const locationslistByDistance = function (req, res) {

	const lng = parseFloat(req.query.lng);
	const lat = parseFloat(req.query.lat);
	const maxDistance = parseFloat(req.query.maxDistance);
	const point = {
		type: "Point",
		coordinates: [lng, lat]
	};
	
	
	if ((!lng && lng!==0) || (!lat &&lat!==0)){
	console.log('locationsListByDistance missing params');
		sendJsonResponse(res, 404, {
			mesage:"lng, lat and maxDistance query parameters are all required"
		})
		return;
	};
	Loc.aggregate(
        [
            {
                '$geoNear': {
                    'near': point,
                    'spherical': true,
                    'distanceField': 'dis',
                    'maxDistance': Earth.getRadsFromDistance(maxDistance)
                }
            }
        ], function(err, result) {
        	if(err){
        		sendJsonResponse(res, 404, {
					mesage:"happend error: "+ err
				})
			} else {
				
			const locations = _buildLocationList(req, res, result);
			sendJsonResponse(res, 200, locations);
	 		}
		}
	 )};
const _buildLocationList = function(req, res, result) {
	let locations = [];
	result.forEach((doc)=> {
			 	locations.push({
			 		distance:Earth.getDistanceFromRads(doc.dis),
			 		name:doc.name,
			 		address:doc.address,
			 		rating:doc.rating,
			 		facilities:doc.facilities,
			 		_id:doc._id
			 		});
			 	});
	return locations;
}	

const locationsUpdateOne = function (req, res) {
	if(!req.params.locationid){
		sendJsonResponse(res, 400, {message: "no find locationid"});
		return;
	} 
	console.log(req.body);
		Loc
		.findById(req.params.locationid)
		.select('-reviews -rating')
		.exec((err, location) => {
			if(err) {
				sendJsonResponse(res, 400, err);
			} else if(!location){
				sendJsonResponse(res, 400, 
					{
						message: "locationid not found"
					});
				return;
			}
			  location.name = req.body.name;
		      location.address = req.body.address;
		      location.facilities = req.body.facilities.split(",");
		      location.coords = [
		        parseFloat(req.body.lng),
		        parseFloat(req.body.lat)
		      ];
		      location.openingTimes = [{
		        days: req.body.days1,
		        opening: req.body.opening1,
		        closing: req.body.closing1,
		        closed: req.body.closed1,
		      }, {
		        days: req.body.days2,
		        opening: req.body.opening2,
		        closing: req.body.closing2,
		        closed: req.body.closed2,
      }];
      		location.save((err, location) => {
      			if(err){
      				sendJsonResponse(res, 400, err);
      			} else {
      				sendJsonResponse(res, 200, location);
      			}
      		});
				
			
		})
	
};
const locationsDeleteOne = function (req, res) {
	let locationid = req.params.locationid;
	
	if(locationid){
	Loc
		.findByIdAndRemove(locationid)
		.exec((err, deletlocation) => {
			if(err){
				sendJsonResponse(res, 400, err);
				return;
			}

			sendJsonResponse(res, 204, null);

		})
	} else {
		sendJsonResponse(res, 404, {message: "no locationid"})
	}	
};
module.exports = {
	locationsCreate,
	locationslistByDistance,
	locationsReadOne,
	locationsUpdateOne,
	locationsDeleteOne
};