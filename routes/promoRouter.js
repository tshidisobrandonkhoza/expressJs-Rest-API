// const { router } = require('expressjs');
var express = require('express');
var router = express.Router();



router.get('/', (req, res, next) => {
    res.send('Promotions');
});

module.exports = router;