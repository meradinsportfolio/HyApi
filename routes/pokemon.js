var express = require('express');
var router = express.Router();
var async = require('async');
var http = require('http');
var Pokemon = require('mongoose').model('Pokemon');

/*
Route which returns pokemon data to the requester in json form
*/

/* GET home page. */
router.get('/', function (req, res, next) {
	// res.render('partials/page', { title: 'Chat', user: req.user });
	res.render('', { title: 'Pokemon' });
});

module.exports = router;