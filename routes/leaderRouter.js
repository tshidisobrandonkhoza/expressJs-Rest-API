var express = require('express');
var router = express.Router();

//database connection
// const mongoose = require('mongoose');

// const urlDb = "mongodb://127.0.0.1:27017/expressGenerator";
// const connect = mongoose.connect(urlDb);

//database models
const Leader = require('../models/leader');

//middleware
var bodyParser = require('body-parser');
//register middleware
router.use(bodyParser.json());


// const { default: mongoose } = require('mongoose');

// router.get('/', (req, res, next) => {
//     res.send('Dishes');
// });
router.route('/').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}).get(async (req, res, next) => {
    // res.send('Will send Dishes shortly');

    await Leader.find({})
        .then((results) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(results);

        }).catch(err => next(err));


}).post(async (req, res, next) => {
    // res.send('Will create Dishes shortly');
    await Leader.create(req.body)
        .then(results => {
            console.log(`Leader Create: ${results}`)

            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.json(results);
        }).catch(err => next(err));

}).put(async (req, res, next) => {
    res.statusCode = 403;
    res.send('Not Supported');
}).delete(async (req, res, next) => {
    // res.send('Will delet Dishes shortly');

    await Leader.deleteMany({})
        .then(results => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(results);
        })
        .catch(err => next(err));
});

router.route('/:itemid').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}).get(async (req, res, next) => {

    // res.statusCode(200);
    // res.send('Will send Dishes shortly' + req.params.itemid);


    await Leader.findById(req.params.itemid)
        .then((results) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(results);

        }).catch(err => next(err));

}).post((req, res, next) => {
    res.statusCode = 403;
    res.send('Not Supported :' + req.params.itemid);
}).put(async (req, res, next) => {
    // res.statusCode(200);
    // res.send('Will send Dishes shortly' + req.params.itemid);

    await Leader.findByIdAndUpdate(req.params.itemid, {
        $set: req.body

    }, { new: true }).exec().then(results => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(results);

    }).catch(err => next(err));

}).delete(async (req, res, next) => {
    // res.statusCode(200);
    // res.send('Will send Dishes shortly' + req.params.itemid);

    await Leader.findByIdAndDelete(req.params.itemid)
        .then(results => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(results);
        })
        .catch(err => next(err));

});



module.exports = router;

