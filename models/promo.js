const mongoose = reqiuire('mongoose');
const Schema = mongoose.Schemma;


const promoSchema = new Schema({
    name: {
        type: String,
        required: true,
    }, image: {
        type: String,
        required: true,
    }, label: {
        type: String,
        default: '',
    }, price: {
        type: Boolean,
        min: 0,
    }, featured: {
        type: String,
        default: false,
    }, description: {
        type: String,
        required: true,
    },

}, {
    timestamps: true
});

const Promo = mongoose.model('Promotions', promoSchema);

module.exports = Promo;