var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	var room = 'user';
	if (req.user) {
		room = req.user.getRole();
		user = req.user.getName();
	}
	else {
		user = 'guest';
	}
	// res.render('partials/page', { title: 'Chat', user: req.user });
	res.render('partials/page', { title: 'Chat' , room: room, user: user });
});

module.exports = router;