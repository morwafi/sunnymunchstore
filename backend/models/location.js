const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },  // allow UUID strings
    userId: {type: String, required: true},
    country: String,
    province: String,
    city: String,
    streetaddress: String,
    postalcode: String
})

module.exports = mongoose.model('user-location', userSchema);