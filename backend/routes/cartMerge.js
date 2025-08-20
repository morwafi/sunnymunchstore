const express = require('express');
const Cart = require('../models/cart');

const router = express.Router();

router.post('/cart/merge', async(req, res) => {
    const {items} = req.body;
    if(!req.user) return res.status(402).json({error: "Login required"});

    items.forEach(item => {
        const existing = userCart.items.find(i => i.productId.toString() === item.productId);
        if(existing ) {
            existing.quantity += item.quantity;
        }else{
            userCart.items.push(item);
        }
    });

    await userCart.save();

    //Delete guest cart
    if(req.cookies.cartId){
        await Cart.deleteOne({cartId: req.cookies.cartId});
        res.clearCookie("cartId")
    }

    res.json(userCart.items);
})

module.exports = router;