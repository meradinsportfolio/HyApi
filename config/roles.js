var ConnectRoles = require('connect-roles');

module.exports = function() {

	var roles = new ConnectRoles({
		failureHandler: function(req, res, event){
			if (req.user) {
				res.status(403);
				res.render('403');
			} else {
				res.status(401);
				res.render('401');
			}
			
		}
	});
	
	roles.use('user admin', function (req) {	
		if(!req.user) { console.log('no login'); return false; }
		if(req.user.hasAnyRole('admin')) {
			console.log('admin true');
			return true;
		}
		console.log('admin false');
		return false;
	
	});
	
	roles.use('user user', function (req) {
		if(!req.user) { return false; }
		return true;
	});
	
	roles.use(function (req) {
		if(req.user.hasAnyRole('admin')) {
			return true;
		}
	});

	return roles;
};