var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roleSchema = new Schema({
	name: { type: String, required: true, index: { unique: true } }
});

roleSchema.path('name').required(true, 'role name cannot be empty');

module.exports = mongoose.model('Role', roleSchema);