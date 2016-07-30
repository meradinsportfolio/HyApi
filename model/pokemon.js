var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var pokemonSchema = new Schema({
	pid: { type: Number, required: true, index: { unique: true } },
	name: { type: String, required: true, index: { unique: true } }
});

pokemonSchema.path('pid').required(true, 'pokemon id cannot be empty');
pokemonSchema.path('name').required(true, 'pokemon name cannot be empty');

module.exports = mongoose.model('Pokemon', pokemonSchema);