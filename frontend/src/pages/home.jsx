import { useState, useEffect } from 'react';
import CartIcon from '../components/cartButton';
import SocialIcons from '../components/socials';
import Logo from '../components/Logo';
import MenuBar from '../components/menubar';
import HeroImage from '../components/heroimage';
import Products from '../components/products';
import { motion, AnimatePresence } from 'framer-motion';
import Single from '../components/single';
import useCart from '../components/useCart';
import LoginButton from '../components/LoginButton';
import axios from '../product-api';
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { fetchFilteredProducts } from "../components/lib/filtering";
import {Button} from "../components/ui/button"
import CartModel from '../components/cart';
import Checkout from '../components/checkout';

const Home = ({ item, isVertical, setIsVertical }) => {
  const navigate = useNavigate();
  const {menu, slug } = useParams();
  const location = useLocation();

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [filters, setFilters] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const {cart, addToCart, removeFromCart, clearCart } = useCart(); // ✅
  const [products, setProducts] = useState([]);
  const [enrichedCart, setEnrichedCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  
  
useEffect(() => {
  const params = new URLSearchParams(location.search);
  setSelectedCategory(params.get('category') || null);
  setSelectedBrand(params.get('brand') || null);
  setSelectedPrice(params.get('price') || null);
  // ... any other filters
}, [location.search]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/product/retrieve-products');
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const newFilters = {};
    for(let [ key, value ] of searchParams.entries()) {
      newFilters[key] = value;
    }
    setFilters(newFilters);
  }, [location.search]);


  useEffect(() => {
    localStorage.setItem('lastPage', location.pathname + location.search);
  }, [location])
  useEffect(() => {
    const lastPage = localStorage.getItem("lastPage");
    if (lastPage && lastPage !==location.pathname) {
      navigate(lastPage, {replace: true});
    }
  }, [])

  useEffect(() => {
    if (slug && products.length > 0) {
      const match = products.find(p => p.slug === slug);
      if (match) setSelectedProductId(match._id);
    } else {
      setSelectedProductId(null);
    }
  }, [slug, products]);

useEffect(() =>{
  const enriched = cart.map(item => {
    const product = products.find(p => p._id === item.productId);
    if (product) {
      return {
      
        ...item,
        name: product.title || item.name,
        price: product.price,
        image: product.imageUrl?.[0] || item.image,
        quantity: product.quantity || ''
      
      };
    }
    return item;
  });
  setEnrichedCart(enriched)
}, [cart, products])

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [selectedSort, setSelectedSort] = useState(null);
useEffect(() => {
  fetchFilteredProducts(
    { selectedCategory, selectedBrand, selectedPrice, selectedSort },
    setFilteredProducts
  );
}, [selectedCategory, selectedBrand, selectedPrice, selectedSort]);
  return (
    <>
      <div className="w-full flex overflow-auto min-h-dvh items-center justify-start">

        {/* menubar */}
        <div className='flex flex-auto w-dvw items-center justify-start'>
          <MenuBar
            isVertical={isVertical}
            onChangeView={() => setIsVertical(prev => !prev)} // ✅ Toggle logic
              setFilteredProducts={setFilteredProducts}  // ✅ pass the setter

          />
        </div>
        <div className='flex-auto w-full h-screen flex items-center'>
          {/* logo */}
          <Logo />
          <div>
            <div className='w-[70%] h-full flex items-center justify-center'>
              {/* social media platforms */}
              <SocialIcons />

              {/* cart */}
              <button
                type="button"
                onClick={() => {
                  setShowCart(prev => !prev);
                  setShowCheckout(false);
                }}
                className="cursor-pointer"
              >
                <CartIcon />
              </button>

              {/* Animated Cart Panel */}
              <AnimatePresence>
                {showCart && (
                  <motion.div
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`h-full top-0 ${
                      showCheckout
                        ? "absolute left-0 w-full bg-black z-[100]"  // full-screen for checkout
                        : "fixed right-0 w-80 bg-gray-300 shadow-lg p-4 z-[99] overflow-y-auto" // drawer for cart
                    }`}                  >
                  {showCheckout ? ( 
                  <Checkout  onBack={() => setShowCheckout(false)} />
                  ) : (
                  <CartModel enrichedCart={enrichedCart} onCheckout={() => setShowCheckout(true)} onClose={() => setShowCart(false)} />
                  )
                  }
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div>
        <LoginButton showCheckout={showCheckout} setShowCheckout={setShowCheckout} />
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedProductId ? 'single' : isVertical ? 'products' : 'hero'}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            {selectedProductId ? (
              <Single productId={selectedProductId} />
            ) : isVertical ? (
<Products
  products={filteredProducts.length ? filteredProducts : products}
  
  onSelectProduct={(product) => {
    setSelectedProductId(product._id);
    navigate(`/products/${product.slug}`); 
     item={item}

  }}
  setSelectedCategory={setSelectedCategory}
  setSelectedBrand={setSelectedBrand}
  setSelectedPrice={setSelectedPrice}
  setSelectedSort={setSelectedSort}
  setFilteredProducts = {setFilteredProducts}
/>
            ) : (
              <HeroImage onSelectProduct={(product) => {
                  navigate(`${location.pathname}/${product.slug}`);
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default Home;
