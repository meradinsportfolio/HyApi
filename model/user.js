var mongoose = require('mongoose'),
	bcrypt = require('bcryptjs'),
	Schema = mongoose.Schema;

var userSchema = new Schema({
	local: {
		username: 		{ type: String, required: false },
		password: 		{ type: String, required: false },
	},
	facebook: {
		id: 			{ type: String, required: false },
		token: 			{ type: String, required: false },
		email: 			{ type: String, required: false },
		name: 			{ type: String, required: false },
	},
	twitter: {
		id: 			{ type: String, required: false },
		token: 			{ type: String, required: false },
		displayName: 	{ type: String, required: false },
		username: 		{ type: String, required: false },
	},
	google: {
		id: 			{ type: String, required: false },
		token: 			{ type: String, required: false },
		email: 			{ type: String, required: false },
		name: 			{ type: String, required: false },
	},
	pokemons: [{ type: Schema.Types.ObjectId, ref: 'Pokemon' }],
	admin: { type: Boolean, required: true, default: false }
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);