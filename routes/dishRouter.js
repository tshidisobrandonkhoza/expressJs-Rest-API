var express = require('express');
var router = express.Router();

//database connection
const mongoose = require('mongoose');

const urlDb = "mongodb://127.0.0.1:27017/expressGenerator";
const connect = mongoose.connect(urlDb);

//database models
const Dishes = require('../models/dishes');

//middleware
var bodyParser = require('body-parser');
//register middleware
router.use(bodyParser.json());


// const { default: mongoose } = require('mongoose');

// router.get('/', (req, res, next) => {
//     res.send('Dishes');
// });
router.route('/').all((req, res, next) => {
    res.statusCode(200);
    res.setHeader('Content-Type', 'text/plain');
    next();
}).get((req, res, next) => {
    res.send('Will send Dishes shortly');
}).post((req, res, next) => {
    res.send('Will create Dishes shortly');
}).put((req, res, next) => {
    res.send('Will put Dishes shortly');
}).delete((req, res, next) => {
    res.send('Will delet Dishes shortly');
});







module.exports = router;