var express 		= require('express'),
	path 			= require('path'),
	favicon 		= require('serve-favicon'),
	logger 			= require('morgan'),
	cookieParser 	= require('cookie-parser'),
	bodyParser 		= require('body-parser'),
	mongoose 		= require('mongoose'),
	passport 		= require('passport'),
	expressSession 	= require('express-session'),
	localStrategy 	= require('passport-local').Strategy,
	ConnectRoles 	= require('connect-roles'),
	bCrypt 			= require('bcryptjs'),
	User,
	location;

var roles = new ConnectRoles({
	failureHandler: function(req, res, event){
		res.status(401);
		res.render('noauth');
	}
});

roles.use('admin user', function (req) {
	if(!req.user) { return false; }
	if(req.user.hasAnyRole('admin')) {
		console.log('admin true');
		return true;
	}
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

/// Database
mongoose.connect('mongodb://MeReadin:DataReadin@ds021895.mlab.com:21895/hyapi');
var db = mongoose.connection;

db.on('error', function (msg) {
	console.log("db connection failed.");
});

db.once('open', function() {
	console.log("db connection succeeded.");
});

require('./model/user')(mongoose);
// require('./model/role')(mongoose);
// require('./model/location')(mongoose);
// require('./model/pokemon')(mongoose);
// require('./model/type')(mongoose);

function handleError(req, res, statusCode, message){
	res.status(statusCode);
	res.json(message);
}

var routes = require('./routes/index');
var users = require('./routes/user');
// var map = require('./routes/map');
// var pokemons = require('./routes/pokemons');
// var types = require('./routes/types');
// var admin = require('./routes/admin');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));


require('./config/passport')(passport);

/// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/// uncomment after placing your favicon in /public
///app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({
	limit: "200mb"
}));
app.use(bodyParser.urlencoded({ extended: false, limit: "200mb" }));
app.use(cookieParser());
//app.use(expressSession({secret: "pikapika"}));	//
//app.use(cookieParser());							//

app.use(expressSession({secret: "pikapika", saveUninitialized: true, resave: false}));
app.use(passport.initialize());
app.use(passport.session());

// var auth = require('./controller/auth');			//

app.use('/', routes);
app.use('/user', users);
// app.use('/map', map);
// app.use('/pokemon', pokemons);
// app.use('/type', types);
// app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;