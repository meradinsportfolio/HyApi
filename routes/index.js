var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next){
	res.render('login');
});

router.get('/logout', function(res, res, next){
	req.logout();
	res.redirect('/');
})

module.exports = router;