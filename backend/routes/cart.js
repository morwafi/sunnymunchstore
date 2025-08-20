const express = require('express');
const Cart = require("../models/cart");
const { v4: uuidv4 } = require('uuid');
const router = express.Router();



router.get("/retrieve-cart", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user?.id }); // adjust query
    if (!cart) {
      return res.status(200).json({ items: [] }); // return empty cart if none exists
    }
    res.status(200).json({ items: req.cart.items || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post('/addtocart', async (req, res) => {
    console.log("Incoming body:", req.body); // 🔍

    const { productId, name, price, image, quantity } = req.body;

    if (!productId) {
        return res.status(400).json({ error: "productId is required" });
    }

    const existing = req.cart.items.find(item => item.productId.toString() === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        req.cart.items.push({ productId, name, price, image, quantity });
    }

    req.cart.updatedAt = new Date();
    await req.cart.save();
    res.json(req.cart.items);
});

router.post('removefromcart', async(req, res) => {
   const {productId} = req.body;
   req.cart.items = req.cart.items.filter(item => item.productId.toString() !== productId);
   req.cart.updatedAt = new Date();
   await req.cart.save();
   res.json(req.cart.items);
});

router.post('/clear-cart', async(req, res) => {
    req.cart.items = [];
    req.cart.updatedAt = new Date();
    await req.cart.save();
    res.json([]);
})

module.exports = router;
