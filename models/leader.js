const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const leaderSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        default: '',
    },
    abbr: {
        type: String,
    },
    featured: {
        type: String,
        default: false,
    },
    description: {
        type: String,
        required: true,
    },

}, {
    timestamps: true
});

const Leader = mongoose.model('Leaders', leaderSchema);

module.exports = Leader;