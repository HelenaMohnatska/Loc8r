const mongoose = require( 'mongoose' );

const openingTimeSchema = new mongoose.Schema({
	days: {type: String, required: true},
	opening: String,
	closing: String,
	closed: {type: Boolean, required: true}
});

const reviewSchema = new mongoose.Schema({
	author: {type: String, required: true},
	rating: {type: Number, required: true, min: 0, max:5 },
	createOn: {type: Date, "default": Date.now},
	textReview: {type: String, required: true}
});
const locationSchema = new mongoose.Schema({
	name: {type:String},
	address: {type:String},
	rating: {type: Number, "default": 0, min: 0, max:5},
	facilities: [String],
	coords: {type:[Number],  index: '2dsphere', required: true},
	openingtime: [openingTimeSchema],
    reviews: [reviewSchema]
});
mongoose.model('Location', locationSchema);




