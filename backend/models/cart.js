const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    name: {type: String},
    price: {type: String},
    image: {type: String},
    quantity: { type: Number, default: 1 }
});

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    cartId: { type: String },
    items: [CartItemSchema],
    createdAt: { type:Date, default: Date.now },
    updatedAt: {type: Date, default: Date.now}
})

CartSchema.index({updatedAt: 1}, { expireAfterSeconds: 60 * 60 * 24 * 60})

module.exports = mongoose.model("Cart", CartSchema);