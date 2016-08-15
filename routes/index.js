var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/login', function (req, res, next) {
	res.render('user/login', { title: 'Local login' });
});

router.get('/signup', function (req, res, next) {
	res.render('user/signup', { title: 'Local signup' });
});

router.get('/logout', function (res, res, next) {
	req.logout();
	res.redirect('/');
});

module.exports = router;