import { useState, useEffect } from "react";
import axios from "../product-api";
import { toast } from "sonner";

const useCart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
  const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    axios.get("/cart/retrieve-cart", { withCredentials: true }).then(res => {
      const items = res.data.items || []; // ✅ now always an array
      const merged = [...localCart];
    
      items.forEach(item => {
        const existing = merged.find(i => i.productId === item.productId);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          merged.push(item);
        }
      });
    
      setCart(merged);
      localStorage.setItem("cart", JSON.stringify(merged));
    });

  }, []);
  
  const syncLocal = (next) => {
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  } 

const addToCart = (product, quantity = 1) => {
  const updated = [...cart];
  const existing = updated.find(i => i.productId === product._id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    updated.push({
      productId: product._id,
      name: product.title,
      price: product.price,
      image: product.imageUrls?.[0],
      quantity
    });
  }

  syncLocal(updated);
  toast(`Added ${product.title} to cart`);

  axios.post("/cart/addtocart", { 
    productId: product._id, 
    name: product.title,
    price: product.price,
    image: product.imageUrls?.[0],
    quantity 
   })
    .catch(() => {});
};

  const removeFromCart = (productId) => {
    const updated = cart.filter(i => i.productId !== productId);
    syncLocal(updated)

    toast("Removed from cart", {
      description: `Product ${productId} was removed`,
    });

    axios.post("/cart/removefromcart", { productId }).catch(() => {});
  };

  const clearCart = () => {
    syncLocal([])
    toast("Cart cleared");
    axios.post('/clear-cart').catch(()=>{})
  };

  return { cart, addToCart, removeFromCart, clearCart };
};

export default useCart;
