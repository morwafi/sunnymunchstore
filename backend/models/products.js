const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    title: {type: String, required:true},
    description: String,
    categories: [String],
    tags: [String],
    brands: [String],
    price: Number,
    discount: Number,
    metaTitle: String,
    metaDescription: String,
    focusKeyword: String,
    altText: String,
    productId: String,
    imageUrls: [String],
    modelUrls: [String],
    qrUrls: { type: [String], default: [] },
    fileUrl: {type: String},
    uploadedAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Products', MediaSchema);