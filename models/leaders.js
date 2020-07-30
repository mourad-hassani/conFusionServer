const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;

const LeaderSchema = new Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    image: {
        type: String,
        require: true,
    },
    designation: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
        unique: true
    },
    abbr: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    featured: {
        type: Boolean,
        required: true,
    }
});

exports = mongoose.model("Leader", LeaderSchema);