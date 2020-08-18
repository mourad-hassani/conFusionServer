const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favorateSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
});

var Favorates = mongoose.model('Favorate', favorateSchema);
module.exports = Favorates;