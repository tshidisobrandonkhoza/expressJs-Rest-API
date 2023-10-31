var createError = require('http-errors');
var express = require('express');
var path = require('path');


//import middleware
var cookieParser = require('cookie-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var logger = require('morgan');


var app = express();


//db connection
var mongoose = require('mongoose');
const urlDb = "mongodb://127.0.0.1:27017/expressGenerator";
const connect = mongoose.connect(urlDb);

//establish connection
connect.then((db) => {
  console.log(`Connected well to Database`);
}, () => { console.log(err) });


//require mongoose models
var Dishes = require('./models/dishes');


//routes initializing
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');
var dishRouter = require('./routes/dishRouter');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//
// app.use(cookieParser('54321-12345'));
app.use(session({
  name: 'session-id',
  store: new FileStore(),
  secret: '54321-12345',
  saveUninitialized: false,
  resave: false,


}));


//authentication
app.use((req, res, next) => {

  console.log(req.session);

  if (!req.session.user) {

    var authHeader = req.headers.authorization;


    if (!authHeader) { 
      var err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
    }  

    //splite where the is space into an array and take the 2nd element: toString split to get the username and password
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];

    if (username === 'admin' && password === 'password') {
      req.session.user = 'admin';
      // res.cookie('user', 'admin', { signed: true });
      next();
    } else {
      var err = new Error('You are not Authorized!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
  } else {

    if (req.session.user == 'admin') {
      next();
    } else {
      var err = new Error('You are not Authorized!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status(401);
      return next(err);
    }
  }
});

app.use(express.static(path.join(__dirname, 'public')));

//registering routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//exporting the application
module.exports = app;
