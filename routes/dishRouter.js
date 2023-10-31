var express = require('express');
var router = express.Router();

//database connection
// const mongoose = require('mongoose');

// const urlDb = "mongodb://127.0.0.1:27017/expressGenerator";
// const connect = mongoose.connect(urlDb);

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
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}).get(async (req, res, next) => {
    // res.send('Will send Dishes shortly');

    await Dishes.find({})
        .then((results) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(results);

        }).catch(err => next(err));


}).post(async (req, res, next) => {
    // res.send('Will create Dishes shortly');
    await Dishes.create(req.body)
        .then(results => {
            console.log(`Dishes Create: ${results}`)

            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.json(results);
        }).catch(err => next(err));

}).put(async (req, res, next) => {
    res.statusCode = 403;
    res.send('Not Supported');
}).delete(async (req, res, next) => {
    // res.send('Will delet Dishes shortly');

    await Dishes.deleteMany({})
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


    await Dishes.findById(req.params.itemid)
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

    await Dishes.findByIdAndUpdate(req.params.itemid, {
        $set: req.body

    }, { new: true }).exec().then(results => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(results);

    }).catch(err => next(err));

}).delete(async (req, res, next) => {
    // res.statusCode(200);
    // res.send('Will send Dishes shortly' + req.params.itemid);

    await Dishes.findByIdAndDelete(req.params.itemid)
        .then(results => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(results);
        })
        .catch(err => next(err));

});


router.route('/:itemid/comments').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();

}).get(async (req, res, next) => {
    // res.send('Will send Dishes shortly');

    await Dishes.findById(req.params.itemid)
        .then((results) => {

            if (results != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(results.comments);
            } else {
                // res.statusCode = 403;
                // res.setHeader('Content-Type', 'application/json');
                // res.send('Data not found');

                //to be handled by the app.js file error handler
                err = new Error('Data not found for' + req.params.itemid);
                err.status = 404;
                return next(err);
            }
        }).catch(err => next(err));


}).post(async (req, res, next) => {
    // res.send('Will create Dishes shortly');
    //find the dish
    await Dishes.findById(req.params.itemid)
        .then((results) => {
            if (results != null) {
                results.comments.push(req.body);
                results.save()
                    .then(result => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(result);
                    }).catch(err => next(err));

            } else {
                //to be handled by the app.js file error handler
                err = new Error('Data not found for' + req.params.itemid);
                err.status = 404;
                return next(err);
            }

        }).catch(err => next(err));

}).put(async (req, res, next) => {
    res.statusCode = 403;
    res.send('Not Supported ' + req.params.itemid);
}).delete(async (req, res, next) => {
    // res.send('Will delet Dishes shortly');

    await Dishes.findById(req.params.itemid)
        .then(async results => {

            if (results != null) {


                // return Dishes.deleteMany({})
                //     .then(result => {
                //         res.statusCode = 200;
                //         res.setHeader('Content-Type', 'application/json');
                //         res.json(result);
                //     })
                //     .catch(err => next(err));


                // results.comments.forEach(async element => {
                //     // console.log(results.comments._id);
                //     // console.log(results.comments.id(element._id));

                //     await results.comments.pull({ _id: element._id });
                // });

                for (var i = (results.comments.length - 1); i >= 0; i--) {
                    await results.comments.pull({ _id: results.comments[i]._id });
                    console.log(i);
                }

                results.save()
                    .then(result => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(result);

                    }).catch(err => next(err));

            } else {
                //to be handled by the app.js file error handler
                err = new Error('Data not found for' + req.params.itemid);
                err.status = 404;
                return next(err);
            }

        })
        .catch(err => next(err));
});


router.route('/:itemid/comments/:itemsid').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}).get(async (req, res, next) => {


    await Dishes.findById(req.params.itemid)
        .then((results) => {

            if (results != null && results.comments.id(req.params.itemsid) != null) {


                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(results.comments.id(req.params.itemsid));

                //                results.comments.push(req.body);
                // results.save()
                //     .then(result => {
                //         res.statusCode = 200;
                //         res.setHeader('Content-Type', 'application/json');
                //         res.json(result);
                //     }).catch(err => next(err));

            }
            else if (results == null) {

                err = new Error('Dish not found for comments');
                err.status = 404;
                return next(err);

            } else {
                //to be handled by the app.js file error handler
                err = new Error('Comments not found for comments');
                err.status = 404;
                return next(err);
            }


        }).catch(err => next(err));




    // res.statusCode(200);
    // res.send('Will send Dishes shortly' + req.params.itemid);


    // await Dishes.findById(req.params.itemid)
    //     .then((results) => {
    //         res.statusCode = 200;
    //         res.setHeader('Content-Type', 'application/json');
    //         res.json(results);

    //     }).catch(err => next(err));

}).post(async (req, res, next) => {
    // res.statusCode = 403;
    // res.send('Not Supported :' + req.params.itemsid + ' comments');



    await Dishes.findById(req.params.itemid)
        .then((results) => {

            if (results != null) {


                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(results.comments.id(req.params.itemsid));

                results.comments.push(req.body);
                results.save()
                    .then(result => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(result);
                    }).catch(err => next(err));

            }
            else {

                err = new Error('Dish not found for comments');
                err.status = 404;
                return next(err);

            }


        }).catch(err => next(err));







}).put(async (req, res, next) => {

    await Dishes.findById(req.params.itemid)
        .then((results) => {

            if (results != null && results.comments.id(req.params.itemsid) != null) {

                if (req.body.rating) {
                    results.comments.id(req.params.itemsid).rating = req.body.rating;
                }
                if (req.body.comment) {
                    results.comments.id(req.params.itemsid).comment = req.body.comment;
                }


                results.save()
                    .then(result => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(result);
                    }).catch(err => next(err));


            }
            else if (results == null) {

                err = new Error('Dish not found for comments');
                err.status = 404;
                return next(err);

            } else {
                //to be handled by the app.js file error handler
                err = new Error('Comments not found for comments');
                err.status = 404;
                return next(err);
            }


        }).catch(err => next(err));


}).delete(async (req, res, next) => {


    await Dishes.findById(req.params.itemid)
        .then(async results => {

            if (results != null && results.comments.id(req.params.itemsid) != null) {

                results.comments.id(req.params.itemsid).deleteOne({});

                results.save()
                    .then(result => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(result);
                    }).catch(err => next(err));


            }
            else if (results == null) {

                err = new Error('Dish not found for comments');
                err.status = 404;
                return next(err);

            } else {
                //to be handled by the app.js file error handler
                err = new Error('Comments not found for comments');
                err.status = 404;
                return next(err);
            }


        }).catch(err => next(err));

});







module.exports = router;