var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
	lat: {type: Number, required: true},
	lng: {type: Number, required: true},
	pid: {type: Number, required: true},
	name: {type: String, required: true}
});

locationSchema.path('lat').required(true, 'latitude cannot be empty');
locationSchema.path('lng').required(true, 'longitude cannot be empty');
locationSchema.path('pid').required(true, 'pokemon id cannot be empty');
locationSchema.path('name').required(true, 'pokemon name cannot be empty');

module.exports = mongoose.model('Location', locationSchema);