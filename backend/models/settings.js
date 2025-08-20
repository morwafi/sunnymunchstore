const mongoose = require('mongoose');

const productSettingsSchema = new mongoose.Schema({
    brands: [String],
    categories: [String],
    tags: [String],
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
})

module.exports = mongoose.model('settings', productSettingsSchema)
