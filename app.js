var express 		= require('express'),
	path 			= require('path'),
	favicon 		= require('serve-favicon'),
	logger 			= require('morgan'),
	cookieParser 	= require('cookie-parser'),
	bodyParser 		= require('body-parser'),
	mongoose 		= require('mongoose'),
	passport 		= require('passport'),
	expressSession 	= require('express-session'),
	bCrypt 			= require('bcryptjs');

/// Database
require('./config/database')(mongoose);

function handleError(req, res, statusCode, message){
	res.status(statusCode);
	res.json(message);
}

/// Routes
var indexRoute = require('./routes/index');
var userRoute = require('./routes/user');
var adminRoute = require('./routes/admin');
var chatRoute = require('./routes/chat');

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

app.use(expressSession({secret: "pikapika", saveUninitialized: true, resave: false}));
app.use(passport.initialize());
app.use(passport.session());

var roles = require('./config/roles')();

app.use('/', indexRoute);
app.use('/user', userRoute);
app.use('/admin', roles.can('admin'), adminRoute);
app.use('/chat', chatRoute);

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
		res.render('AppError', {
			title: 'Error - Something went wrong',
			pageTitle: 'Error - Something went wrong',
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('appError', {
		title: 'Error - Something went wrong',
		pageTitle: 'Error - Something went wrong',
		message: err.message,
		error: {}
	});
});

module.exports = app;