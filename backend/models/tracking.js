const mongoose = require('mongoose');

const ProductTrackingSchema = new mongoose.Schema({
    title: String,
    price: Number,
    likes: {type: Number, default: 0},
    addToCartCount: {type: Number, default: 0},
    regionStats: {type: Map, of: Number, default: {} },
    trackingHistory: [{
        type: { type:String, enum: ['like', 'add_to_cart'], required: true},
        region: {type: String, required: true},
        date: {type:Date, default: Date.now}
    }]
}, {timestamps: true});

ProductTrackingSchema.index({'trackingHistory.date': 1});

module.exports = mongoose.model("ProductTracking", ProductTrackingSchema);
