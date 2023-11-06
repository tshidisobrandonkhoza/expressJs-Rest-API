var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Add the username and password
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({ 
    admin: {
        type: Boolean,
        default: false,
    }
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);
module.exports = User;

