const {v4: uuidv4} = require('uuid');
const Cart = require('../models/cart');

module.exports = async (req, res, next) => {
    if(req.user) {
        //logged-in user cart
        let cart = await Cart.findOne({userId: req.user._id});
        if(!cart){
            cart = await Cart.create({userId: req.user._id, items: []});
        }
        req.cart = cart;
    }else{
        //Guest cart via cookie
        if(!req.cookies.cartId){
            res.cookie( "cartId", 
                uuidv4(), 
                {
                    httpOnly: true, 
                    maxAge: 1000 * 60 * 60 * 24 * 7
                }
            );
        }
        const cartId = req.cookies.cartId;
        let cart = await Cart.findOne({ cartId });
        if(!cart){
            cart = await Cart.create({cartId, items: []});
        }
        req.cart = cart
    }
    next();
}