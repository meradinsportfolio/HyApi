var express		= require('express');
var router 		= express.Router();
var controller 	= require('../controller/userController.js');

var auth 		= require('../controller/auth');
var async 		= require('async');
var http 		= require('http');

var User 		= require('mongoose').model('User');
var Roles 		= require('mongoose').model('Role');
var Pokemon 	= require('mongoose').model('Pokemon');
var PokeLocate 	= require('mongoose').model('Location');


// /* GET home page. */
router.get('/', function (req, res, next) {
	res.render('admin/index', { title: 'Admin home' });
});

router.get('/users', function (req, res, next) {

	User.find(function (err, users) {
		if (err) return console.error(err);

		res.render('admin/users', { title: 'Userlist' , users: users});
	}).sort({ role: 1 });
});

router.get('/users/:id/:action', function (req, res, next) {

	User.findById(req.params.id, function (err, user) {
		if (err) {
			res.render('404', { title: '404 - Page not found' });
		}
		else {
			if (req.params.action == 'delete') {

				user.remove();
				res.redirect('/admin/users');
			} else if (req.params.action == 'update') {

				Roles.find(function (err, roles) {
					if (err) return console.error(err);

					res.render('admin/userUpdate', { title: 'user detail', user: user, roles: roles });
				});
			} else {
				res.render('404', { title: '401 - Page not found' });
			}
		}
	});
});

router.post('/users/:id/:action', function (req, res, next) {
	if (req.params.action == 'update') {

		User.findById(req.params.id, function (err, user) {
			if (err) { console.error(err); }
			
			user.role = req.body.role;
	
			user.save(function (err) {
				if (err)
					throw err;
			});
		
		});

	}
	res.redirect('/admin/users');
});

router.get('/pokemons', function (req, res, next) {

	Pokemon.find(function (err, pokemons) {
		if (err) return console.error(err);

		PokeLocate.find(function (err, locations) {
			if (err) return console.error(err);

			res.render('admin/pokemons', { title: 'Pokemonlist' , pokemons: pokemons, pokeLocations: locations});
		});

	}).sort({ pid: 1 });
});

router.get('/pokemons/fillpokedex', function (req, res, next) {

	var results = {};

	getPokemon(req, res, function (pokemons) {
		var count = 0;
		pokemons.results.forEach(function (pokemon) {
			Pokemon.find({ pid: count }, function (err, docs) {
				count++;

				if (!docs || !docs.length) {
					console.log("Number: " + count + " Name: " + pokemon.name)
					var poke = new Pokemon({
						pid: count,
						name: pokemon.name
					});

					poke.save(function (err) {
						// if (err)
						// 	throw err;
					});
				}
			});
		});
	});
	res.redirect('/admin/pokemons');
});

// router.get('/locationlist', auth.isAllowed('Admin'), function(req, res){
// 	location.find({}).exec(function(e, docs){
// 		if(e) return res.status(500).json('error occured');

//   		res.json(docs);
// 	})
// });

router.post('/pokemons/addlocation', function (req, res){
	console.log(req.body);

	var newlocation = new PokeLocate(req.body);

	newlocation.save(function(err, doc){
		//if (err) return err;

		res.status(200).send((err === null) ? { msg: '' } : { msg: err});
		//res.status(200).json("Succesfully saved the new location");
	});
	/*location.collection.insert(req.body, function(err, result){
		res.send(
			(err === null) ? { msg: '' } : { msg: err}
		);
	});*/
});

router.delete('/pokemons/deletelocation/:id', function (req, res){
	var locationToDelete = req.params.id;
	PokeLocate.remove({ 'pid' : locationToDelete}).exec(function(err){
		res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
	});
});



function getPokemon(req, res, callback){
	var startDate = new Date();
	var options = {
		host: 'pokeapi.co',
		port: 80,
		path: '/api/v2/pokemon/',
		method: 'GET'
	};
	if (req.params.name){
		options.path += req.params.name.toString() + '/'
	} else {
		options.path += '?limit=720'
	}
	console.log(options);

	http.get(options, function(response) {
		var d = '';

		response.on('data', function (chunk) {
					// console.log("Response:: "+chunk);
			d += chunk;
		});

		response.on('end', function () {

			var object = JSON.parse(d);
			// console.log("OBJECT:: "+object.results);
			if (req.params.name) {
				callback({
					results: object
					//requestTime: (new Date() - startDate)
				});
			} else {
				callback({
					results: object.results
					//requestTime: (new Date() - startDate)
				});
			}
		});
	})
}

module.exports = router;