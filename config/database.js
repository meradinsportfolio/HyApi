module.exports = function(mongoose) {

	mongoose.connect('mongodb://MeReadin:DataReadin@ds021895.mlab.com:21895/hyapi');
	var db = mongoose.connection;
	
	db.on('error', function (msg) {
		console.log("db connection failed.");
	});
	
	db.once('open', function() {
		console.log("db connection succeeded.");
	});

	require('../model/user')(mongoose);
	require('../model/role')(mongoose);
	// require('../model/location')(mongoose);
	// require('../model/pokemon')(mongoose);
};