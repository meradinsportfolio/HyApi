var express = require('express');
var router = express.Router();
var controller = require('../controller/userController.js');
// var location = require('mongoose').model('Location');
var auth = require('../controller/auth');

// /* GET home page. */
// router.get('/', isLoggedIn, auth.isAllowed('Admin'), function(req, res, next) {
// 	res.render('admin/index', {
// 		"title" : 'Pokemon locatie beheer'
// 	});
// });

router.get('/', function (req, res, next) {
	if (!req.user) {
		console.log('::GET /user/ :: accessed');
		res.render('admin/index');
	}
});

// router.get('/locationlist', auth.isAllowed('Admin'), function(req, res){
// 	location.find({}).exec(function(e, docs){
// 		if(e) return res.status(500).json('error occured');

//   		res.json(docs);
// 	})
// });

// router.post('/addlocation', auth.isAllowed('Admin'), function(req, res){
// 	console.log(req.body);

// 	var newlocation = new location(req.body);

// 	newlocation.save(function(err, doc){
// 		//if (err) return err;

// 		res.status(200).send((err === null) ? { msg: '' } : { msg: err});
// 		//res.status(200).json("Succesfully saved the new location");
// 	});
// 	/*location.collection.insert(req.body, function(err, result){
// 		res.send(
// 			(err === null) ? { msg: '' } : { msg: err}
// 		);
// 	});*/
// });

// router.delete('/deletelocation/:id', auth.isAllowed('Admin'), function(req, res){
// 	var locationToDelete = req.params.id;
// 	location.remove({ 'pid' : locationToDelete}).exec(function(err){
// 		res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
// 	});
// });

// function isLoggedIn(req, res, next) {
// 	controller.checkToken(req,'supersecrethere',next, function(response){
// 		res.json(response);
// 	});
// }

module.exports = router;