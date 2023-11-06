const passport = require("passport"); 
const User = require('../models/user');
const { Strategy } = require("passport-local");

exports.local = passport.use(new Strategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());