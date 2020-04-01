var mongoose = require( 'mongoose' );

var openingTimeSchema = new mongoose.Schema({
	days: {type: String, required: true},
	opening: String,
	closing: String,
	closed: {type: Boolean, required: true}
});

var reviewSchema = new mongoose.Schema({
	autor: String,
	rating: {type: Number, required: true, min: 0, max:5 },
	createOn: {type: Date, "default": Date.now},
	textReviw: String
});

var locationSchema = new mongoose.Schema({
	name: {type:String, required: true},
	address: {type:String},
	rating: {type: Number, "default": 0, min: 0, max:5},
	facilities: [String],
	coords: {type:[Number], index: '2dsphere'},
	openingTime: [openingTimeSchema],
	review: [reviewSchema]
 });
mongoose.model('Location', locationSchema);

