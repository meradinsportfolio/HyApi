var express = require('express');
var router = express.Router();
var User = require('mongoose').model('User');
var passport = require('passport');
var controller = require('../controller/userController.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
	if (!req.user) {
		console.log('::GET /user/ :: accessed');
		res.render('user/index');
	} else {
		console.log('::REDIRECT to profile, user is authorized');
		res.redirect('/');
	}
});

//isLoggedIn midleware checkt of user ingelogd is
router.get('/profile', isLoggedIn,  function (req, res, next) {
	if (req.user) {
		console.log('::GET /user/profile:: accessed');
		res.render('user/profile', { user: req.user });
	} else {
		console.log('::REDIRECT to profile, user is un-authorized');
		res.redirect('/user');
	}
});

// route for logging out
router.get('/logout', isLoggedIn, function (req, res) {
	console.log(req.get('referrer'));
	if(req.user) {
		console.log("::LOGOUT USER:: \n");
		console.log(req.user);
		req.logout();
		res.redirect('/');
	} else {
		res.redirect('back');
	}	
});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// =====================================
	// LOCAL ROUTES ========================
	// =====================================
	
		// LOGIN ==================================
			// show the login form
			router.get('/login', function(req, res, next) {
				console.log('::GET /user/login:: accessed');
				res.render('user/login');
			});
			
			// process the login form
			router.post('/login', passport.authenticate('local-login', {
				successRedirect : '/user/profile', // redirect to the secure profile section
				failureRedirect : '/user/login', // redirect back to the signup page if there is an error
				failureFlash	: true // allow flash messages
			}), function (req, res) {
				console.log('::POST /user/login:: accessed');
			});
		
		// SIGNUP =================================
			// show the signup form
			router.get('/signup', function(req, res, next) {
				console.log('::GET /user/signup:: accessed')
				res.render('user/signup');
			});
			
			// process the signup form
			router.post('/signup', passport.authenticate('local-signup', {
				successRedirect : 'user/profile', // redirect to the secure profile section
				failureRedirect : 'user/signup', // redirect back to the signup page if there is
				failureFlash	: true // allow flash messages
			}), function (req, res) {
				console.log('::POST /user/signup:: accessed');
			});
	
	// =====================================
	// FACEBOOK ROUTES =====================
	// =====================================
		// send to facebook to do the authentication
		router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
		
		// handle the callback after facebook has authenticated the user
		router.get('/auth/facebook/callback', passport.authenticate('facebook', {
			successRedirect 	: '/profile',
			failureRedirect 	: '/'
		}));
	
	// =====================================
	// TWITTER ROUTES ======================
	// =====================================
		// send to twitter to do the authentication
		router.get('/auth/twitter', passport.authenticate('twitter'));
		
		// handle the callback after twitter has authenticated the user
		router.get('/auth/twitter/callback', passport.authenticate('twitter', {
			successRedirect 	: '/profile',
			failureRedirect 	: '/'
		}));
	
	// =====================================
	// GOOGLE ROUTES =======================
	// =====================================
		// send to google to do the authentication
		router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
		
		// the callback after google has authenticated the user
		router.get('/auth/google/callback', passport.authenticate('google', {
			successRedirect 	: '/profile',
			failureRedirect 	: '/'
		}));
//needs to be checked
	// =====================================
	// GITHUB ROUTES =======================
	// =====================================
		// send to github to do the authentication
		router.get('/auth/github', passport.authenticate('github'));
		
		// the callback after github has authenticated the user
		router.get('/auth/github/callback', passport.authenticate('github', {
			successRedirect 	: '/profile',
			failureRedirect 	: '/'
		}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// local ----------------------------------
		router.get('/connect/local', function(req, res) {
			res.render('connect-local.ejs', { message: req.flash('loginMessage') });
		});
		router.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect 	: '/profile', // redirect to the secure profile section
			failureRedirect 	: '/connect/local', // redirect back to the signup page if there is an error
			failureFlash 		: true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		router.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

		// handle the callback after facebook has authorized the user
		router.get('/connect/facebook/callback', passport.authorize('facebook', {
			successRedirect 	: '/profile',
			failureRedirect 	: '/'
		}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		router.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

		// handle the callback after twitter has authorized the user
		router.get('/connect/twitter/callback', passport.authorize('twitter', {
			successRedirect 	: '/profile',
			failureRedirect 	: '/'
		}));


	// google ---------------------------------

		// send to google to do the authentication
		router.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

		// the callback after google has authorized the user
		router.get('/connect/google/callback', passport.authorize('google', {
			successRedirect 	: '/profile',
			failureRedirect 	: '/'
		}));
//needs to be checked
	// github ---------------------------------

		// send to google to do the authentication
		router.get('/connect/github', passport.authorize('github'));

		// the callback after google has authorized the user
		router.get('/connect/github/callback', passport.authorize('github', {
			successRedirect 	: '/profile',
			failureRedirect 	: '/'
		}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local ----------------------------------
	router.get('/unlink/local', function(req, res) {
		var User 				= req.user;
		user.local.email 		= undefined;
		user.local.password 	= undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	router.get('/unlink/facebook', function(req, res) {
		var user 				= req.user;
		user.facebook.token 	= undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// twitter --------------------------------
	router.get('/unlink/twitter', function(req, res) {
		var user 				= req.user;
		user.twitter.token 		= undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// google ---------------------------------
	router.get('/unlink/google', function(req, res) {
		var user 				= req.user;
		user.google.token 		= undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});
//needs to be checked
	// github ---------------------------------
	router.get('/unlink/github', function(req, res) {
		var user 				= req.user;
		user.github.token 		= undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

function isLoggedIn(req, res, next) {
	// stuff i used to use (mark made)
	// controller.checkToken(req,'supersecrethere',next, function(response){
	// 	res.json(response);
	// });

	if (req.isAuthenticated())
		console.log("::CHECK :: user is logged in.");
		return next();
	
	console.log("::CHECK :: user is NOT logged in.");
	res.redirect('/');
}

module.exports = router;