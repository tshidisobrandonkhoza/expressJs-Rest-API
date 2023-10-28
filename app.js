var createError = require('http-errors');
var express = require('express');
var path = require('path');


//import middleware
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express();


//db connection
var mongoose = require('mongoose');
const urlDb = "mongodb://127.0.0.1:27017/expressGenerator";
const connect = mongoose.connect(urlDb);

//establish connection
connect.then((db) => {
  console.log(`Connected well to Server: ${db}`);
}, () => { console.log(err) });


//require mongoose models
var Dishes = require('./models/dishes');


//routes initializing
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');
var dishRouter = require('./routes/dishRouter');
const { connect } = require('http2');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//registering routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dish', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leader', leaderRouter);

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
