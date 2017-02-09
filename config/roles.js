var ConnectRoles = require('connect-roles');

module.exports = function() {

	var roles = new ConnectRoles({
		failureHandler: function(req, res, event){
			if (req.user) {
				res.status(403);
				res.render('error', { 
					title: '403 - Forbidden',
					pageTitle: '403 - Forbidden'
				});
			} else {
				res.status(401);
				res.render('error', { 
					title: '401 - Unauthorized',
					pageTitle: '401 - Unauthorized'
				});
			}
			
		}
	});
	
	roles.use('admin', function (req) {	
		if(!req.user) { console.log('no login'); return false; }
		if(req.user.hasRole('admin')) {
			console.log('admin true');
			return true;
		}
		console.log('admin false');
		return false;
	
	});
	
	roles.use('user', function (req) {
		if(!req.user) { return false; }
		return true;
	});
	
	// roles.use(function (req) {
	// 	if(req.user.hasRole('admin')) {
	// 		return true;
	// 	}
	// });

	return roles;
};