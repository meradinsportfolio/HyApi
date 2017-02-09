var User = require('mongoose').model('User');

exports.isAllowed = function(role) {
	return function(req, res, next) {
		if(req.isAuthenticated()) {
			if (role == 'admin') {
				if(req.user.isAdmin) {
					return next();
				} else {
					return showError('not allowed to access this', 401, req, res);
				}
			}
			else if (role == 'user') {
				return next();
			} else {
				return showError('role check invalid', 500, req, res);
			}
		} else {
			return showError('User is not authenticated', 401, req, res);
		}
	}
}

function showError(errMsg, code, req, res){
	if (req.headers['content-type'] != null && req.headers['content-type'] == 'application/json'){
		res.status(code).json({message: errMsg});
	} else {
		res.render('error', {
			title: code + ' - ' + errMsg,
			pageTitle: code + ' - ' + errMsg
			// message: errMsg,
			// error: code
		});
	}
}

// Check if user is admin or not
exports.isAdmin = function(req, res, next){
	if (req.user.isAdmin){
		return res.json({message: 'succes', isAdmin: true});
	} else {
		return res.json({message: 'succes', isAdmin: false});
	}
}
