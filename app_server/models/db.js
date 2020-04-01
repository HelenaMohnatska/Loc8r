var mongoose = require( 'mongoose' );
require('../locations');
var dbURI = 'mongodb://localhost/Loc8r';
if(process.env.NODE_ENV === 'production') {
	dbURI ='mongodb://heroku_slqglzbf:767guq5jrubslnln7o14nfrbqu@ds155263.mlab.com:55263/heroku_slqglzbf'
}
mongoose.connect(dbURI);

function gracefulShutdown(msg, callback){
	mongoose.connection.close(function(){
		console.log('Mongoose disconected through '+ msg);
		callback();
	})
}

mongoose.connection.on('connected', function () {
	console.log('Mongoose conect to '+ dbURI);
});
mongoose.connection.on('error', function (err) {
	console.log('Mongoose conected with error '+ err);
	});
process.once('SIGUSR2', function(){
	gracefulShutdown('nodemon restart', function(){
		process.kill(process.pid, 'SIGUSR2');
	});
});
process.on('SIGINT', function(){
	gracefulShutdown('app terminal', function(){
		process.exit(0);
	});
});
process.on('SIGTERM', function(){
	gracefulShutdown('Heroku app shutdown', function(){
		process.exit(0);
	});
});