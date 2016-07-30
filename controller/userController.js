var jwt		= require('jsonwebtoken'); // used to create, sign, and verify tokens

exports.getToken = function(user, secret, callback) {
	var token = jwt.sign(user, secret, {
		expiresIn: 86400 // expires in 24 hours
	});

	callback({
		success:true,
		message: 'enjoy your oken',
		token: token
	});
};

exports.checkToken = function(req, secret, next, callback) {
	// check header for token
	var token = req.body.token || req.query.token || req.session.token; //req.headers['x-access-token'];
	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, secret, function(err, decoded) {
			if (err) {
				callback({ success: false, message: 'Failed to authenticate token.' });
			} else {
				if (req.isAuthenticated()) {
				    // if everything is good, save to request for use in other routes
				    req.decoded = decoded;
				    next();
				} else {
					callback({
						success: false,
						message: 'Not logged in'
					})
				}
			}
		});

	} else {
		// if there is no token
		// return an error
		callback({
			success: false,
			message: 'No token provided.'
		});
	}
};
