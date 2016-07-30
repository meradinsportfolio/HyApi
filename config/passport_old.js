// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy= require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy  = require('passport-google-oauth').OAuth2Strategy;
var User            = require('../model/user');

var configAuth      = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

// 	// =========================================================================
//     // passport session setup ==================================================
//     // =========================================================================
//     // required for persistent login sessions
//     // passport needs ability to serialize and unserialize users out of session

//     // used to serialize the user for the session
//     passport.serializeUser(function(user, done) {
//         done(null, user.id);
//     });

//     // used to deserialize the user
//     passport.deserializeUser(function(id, done) {
//         User.findById(id, function(err, user) {
//             done(err, user);
//         });
//     });

//  	// =========================================================================
//     // LOCAL SIGNUP ============================================================
//     // =========================================================================
//     // we are using named strategies since we have one for login and one for signup
// 	// by default, if there was no name, it would just be called 'local'

//     //DONE returns werken niet chill in postman, bij fail zegt ie gwn 401 unauthorized

//     passport.use('local-signup', new LocalStrategy({
//         passReqToCallback : true // allows us to pass back the entire request to the callback
//     },
//     function(req, username, password, done) {
//         console.log('username::'+ username);
//         console.log('password::'+ password);

// 		// find a user whose email is the same as the forms email
// 		// we are checking to see if the user trying to login already exists
//         User.findOne({ 'local.username' :  username }, function(err, user) {
//             // if there are any errors, return the error
//             if (err)
//                 return done(err);

//             // check to see if theres already a user with that email
//             if (user) {
//                 return done(null, false, {'signupMessage': 'That username is already taken.'});
//             } else {
// 				// if there is no user with that email
//                 // create the user
//                 var newUser            = new User();

//                 // set the user's local credentials
//                 //newUser.email    = req.body.email;
//                 newUser.local.password = newUser.generateHash(password);
//                 newUser.local.username = username;

// 				// save the user
//                 newUser.save(function(err) {
//                     if (err)
//                         throw err;
//                     return done(null, newUser);
//                 });
//             }

//         });

//     }));

//     // =========================================================================
//     // LOCAL LOGIN =============================================================
//     // =========================================================================
//     // we are using named strategies since we have one for login and one for signup
//     // by default, if there was no name, it would just be called 'local'

//     passport.use('local-login', new LocalStrategy(
//     function(username, password, done) { // callback with email and password from our form
//         process.nextTick(function() {
//         // find a user whose email is the same as the forms email
//         // we are checking to see if the user trying to login already exists
//             User.findOne({ 'local.username' :  username }, function(err, user) {
//                 console.log(user);
//                 // if there are any errors, return the error before anything else
//                 if (err)
//                     return done(err);
    
//                 // if no user is found, return the message
//                 if (!user)
//                     return done(null, false, {'loginMessage': 'No user found.'}); // req.flash is the way to set flashdata using connect-flash
    
//                 // if the user is found but the password is wrong
//                 if (!user.validPassword(password))
//                     return done(null, false, {'loginMessage': 'Oops! Wrong password.'}); // create the loginMessage and save it to session as flashdata
    
//                 // all is well, return successful user
//                 return done(null, user);
//             });
//         });

//     }));


//     // =========================================================================
//     // FACEBOOK ================================================================
//     // =========================================================================
//     passport.use(new FacebookStrategy({
//         // pull in our app id and secret from the auth.js file.
//         clientID        : configAuth.facebookAuth.clientID,
//         clientSecret    : configAuth.facebookAuth.clientSecret,
//         callbackURL     : configAuth.facebookAuth.callbackURL
//     },
//     // facebook will send back the token and profile
//     function(token, refreshToken, profile, done) {
//         // asynchronous
//         process.nextTick(function() {
//             // find the user in the database based on their facebook id
//             User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
//                 // if there is an error, stop everything and return that
//                 // ie an error connecting to the database
//                 if (err)
//                     return done(err);

//                 // if the user is found, then log them in
//                 if (user) {
//                     return done(null, user); // user found, return that user
//                 } else {
//                     // if there is no user found with that facebook id, create them
//                     var newUser            = new User();

//                     // set all of the facebook information in our user model
//                     newUser.facebook.id    = profile.id; // set the users facebook id                   
//                     newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
//                     newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
//                     newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

//                     // save our user to the database
//                     newUser.save(function(err) {
//                         if (err)
//                             throw err;

//                         // if successful, return the new user
//                         return done(null, newUser);
//                     });
//                 }
//             });
//         });

//     }));


//     // =========================================================================
//     // TWITTER =================================================================
//     // =========================================================================
//     passport.use(new TwitterStrategy({

//         consumerKey     : configAuth.twitterAuth.consumerKey,
//         consumerSecret  : configAuth.twitterAuth.consumerSecret,
//         callbackURL     : configAuth.twitterAuth.callbackURL

//     },
//     function(token, tokenSecret, profile, done) {

//         // make the code asynchronous
//     // User.findOne won't fire until we have all our data back from Twitter
//         process.nextTick(function() {
            

//             // find the user in the database based on their facebook id
//             User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
            
//                 // if there is an error, stop everything and return that
//                 // ie an error connecting to the database
//                 if (err)
//                     return done(err);
            
//                 // if the user is found then log them in
//                 if (user) {
                      
//                         // if there is a user id already but no token (user was linked at one point and then removed)
//                         // just add our token and profile information
//                         if (!user.twitter.token) {
//                             user.twitter.token = token;
//                             user.twitter.username  = profile.username;
//                             user.twitter.displayName = profile.displayName;
            
//                             user.save(function(err) {
//                                 if (err)
//                                     throw err;
//                                 return done(null, user);
//                             });
//                         }
            
//                         return done(null, user); // user found, return that user
//                 } 
//             });

//         });

//     }));

//     // =========================================================================
//     // GOOGLE ==================================================================
//     // =========================================================================
//     passport.use(new GoogleStrategy({

//         clientID        : configAuth.googleAuth.clientID,
//         clientSecret    : configAuth.googleAuth.clientSecret,
//         callbackURL     : configAuth.googleAuth.callbackURL,

//     },
//     function(token, refreshToken, profile, done) {

//         // make the code asynchronous
//         // User.findOne won't fire until we have all our data back from Google
//         process.nextTick(function() {

//             // try to find the user based on their google id
//             User.findOne({ 'google.id' : profile.id }, function(err, user) {
//                 if (err)
//                     return done(err);

//                 if (user) {

//                     // if a user is found, log them in
//                     return done(null, user);
//                 } else {
//                     // if the user isnt in our database, create a new user
//                     var newUser          = new User();

//                     // set all of the relevant information
//                     newUser.google.id    = profile.id;
//                     newUser.google.token = token;
//                     newUser.google.name  = profile.displayName;
//                     newUser.google.email = profile.emails[0].value; // pull the first email

//                     // save the user
//                     newUser.save(function(err) {
//                         if (err)
//                             throw err;
//                         return done(null, newUser);
//                     });
//                 }
//             });
//         });

//     }));


};
