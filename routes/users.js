var express = require('express');
var router = express.Router();

//database connection
// const mongoose = require('mongoose');

// const urlDb = "mongodb://127.0.0.1:27017/expressGenerator";
// const connect = mongoose.connect(urlDb);

//user models
const User = require('../models/user');

//middleware 
var bodyParser = require('body-parser');
//register middleware
router.use(bodyParser.json());

/* GET users listing. */
router.route('/').all((req, res, next) => {
  res.status(200);
  res.setHeader('Content-Type', 'text/plain');
  next();

}).get(async (req, res, next) => {

  res.send("hello you have reached the user ");
})

router.post('/signup', async (req, res, next) => {

  console.log('error');
  await User.findOne({ username: req.body.username })
    .then(async results => {

      if (results !== null) {
        var err = new Error("Username already exist, Please pick another 1");
        err.status = 403;
        next(err);

      } else {
        await User.create({
          username: req.body.username,
          password: req.body.password,
        }).then(result => {

          console.log(`User created ${result}`);
          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.json(result);

        }).catch(err => next(err));
      }

    }).catch(err => next(err));

});

router.post('/login', async (req, res, next) => {
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
    // var username = auth[0];
    // var password = auth[1];

    await User.findOne({ username: req.body.username }).then(results => {
     
      if (results !== null && results.password === req.body.password) {


        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader("Content-Type", "appliation/json");
        res.end("you are authenticated");


      } else if (results === null) {
        var err = new Error('You could not be found');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 403;
        return next(err);
      } else {
        var err = new Error('Your password is incorret for User: ' + results.body.username);
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
      }



    }).catch(err => next(err));
  } else {

    if (req.session.user === 'authenticated') {


      res.statusCode = 200;
      res.setHeader('Content-Type', 'Text/Plain');
      res.end('You are already Logged In');

    } else {
      var err = new Error('You are not Authorized!');
      err.status = 401;
      return next(err);
    }

  }



});

router.get('/logout', () => {
  if (req.session) {
    //destroy on the server
    req.session.destroy();
    //destroy on the client
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var er = new Error('Ypu not logged In');
    err.status(403);
    next(err);

  }
});



module.exports = router;
