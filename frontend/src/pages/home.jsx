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
import CartModel from '../components/cart';
import Checkout from '../components/checkout';
import { Menu, Xmark } from 'iconoir-react';

const Home = ({ item, isVertical, setIsVertical }) => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const location = useLocation();

  const [hasNavigated, setHasNavigated] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const [products, setProducts] = useState([]);
  const [enrichedCart, setEnrichedCart] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [ActivePage, setActivePage] = useState("hero");
  const [isMenuVisible, setIsMenuVisible] = useState(true); // controls visibility only

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);

  // Menu item click
  const handleMenuItemClick = async (itemLabel) => {

    setIsVertical(true);  // hide menu immediately after navigation
    navigate(`/products/${itemLabel.toLowerCase()}`);
    await fetchFilteredProducts(
      { selectedMenu: itemLabel, selectedCategory, selectedBrand, selectedPrice, selectedSort },
      setFilteredProducts
    );
  };

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
    const params = new URLSearchParams(location.search);
    setSelectedCategory(params.get('category') || null);
    setSelectedBrand(params.get('brand') || null);
    setSelectedPrice(params.get('price') || null);
  }, [location.search]);

  useEffect(() => {
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
    setEnrichedCart(enriched);
  }, [cart, products]);

  useEffect(() => {
    fetchFilteredProducts(
      { selectedCategory, selectedBrand, selectedPrice, selectedSort },
      setFilteredProducts
    );
  }, [selectedCategory, selectedBrand, selectedPrice, selectedSort]);

  useEffect(() => {
    if (slug && products.length > 0) {
      const match = products.find(p => p.slug === slug);
      if (match) setSelectedProductId(match._id);
    } else {
      setSelectedProductId(null);
    }
  }, [slug, products]);

  return (
    <>
      {/* Menu icon for Phase 2 */}
      {isVertical && (
        <div
          className={`sm:hidden ${
            isMenuVisible
              ? " max-sm:!visible bg-black z-50 rounded-full h-12 w-12 flex items-center justify-center absolute bottom-12 ml-2 z-[999] cursor-pointer"
              : " max-sm:!visible bg-black rounded-br-full rounded-tr-full h-12 w-20 flex items-center justify-center absolute left-1/4 top-23 ml-2 z-[999] cursor-pointer"
          }`}
          onClick={() => setIsMenuVisible(!isMenuVisible)} // ✅ toggle here
        >
          {!isMenuVisible ? (
            <Xmark color="white" /> // ✅ show close icon when menu is visible
          ) : (
            <Menu color="white" /> // ✅ show menu icon when menu is hidden
          )}
        </div>
      )}
      {/* MenuBar */}
<div
  className={`w-100 flex overflow-auto min-h-dvh items-center justify-start
    transition-all duration-300 ease-in-out absolute top-0 left-0 z-50
    ${isVertical 
      ? (isMenuVisible 
          ? "max-sm:-translate-x-full max-sm:opacity-0 pointer-events-none"
          : "max-sm:translate-x-0 max-sm:opacity-100 pointer-events-auto")
      : ""}
  `}
>
<motion.div
  className="flex flex-auto w-dvw items-center justify-start"
  animate={hasNavigated ? { x: isVertical ? 0 : '-100%', opacity: isVertical ? 1 : 0 } : {}}
  initial={hasNavigated ? {} : { x: 0, opacity: 1 }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
>
  <MenuBar
    isVertical={isVertical}
    onChangeView={() => setIsVertical(prev => !prev)}
    setFilteredProducts={setFilteredProducts}
  />
</motion.div>
        {/* Main Content */}
        <div className='flex-auto w-full h-screen flex items-center'>
          <Logo />
          <div>
            <div className='w-[70%] h-full flex items-center justify-center'>
     

              <button
                type="button"
                onClick={() => { setShowCart(prev => !prev); setShowCheckout(false); }}
                className="cursor-pointer"
              >
                <CartIcon />
              </button>

              <AnimatePresence>
                {showCart && (
                  <motion.div
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`h-full top-0 ${
                      showCheckout
                        ? "absolute left-0 w-full bg-black z-[100]"
                        : "fixed right-0 w-80 bg-gray-300 shadow-lg p-4 z-[99] overflow-y-auto"
                    }`}
                  >
                    {showCheckout ? (
                      <Checkout onBack={() => setShowCheckout(false)} />
                    ) : (
                      <CartModel enrichedCart={enrichedCart} onCheckout={() => setShowCheckout(true)} onClose={() => setShowCart(false)} />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
         <SocialIcons />
      <LoginButton isMenuVisible={isMenuVisible} isVertical={isVertical} showCheckout={showCheckout} setShowCheckout={setShowCheckout} />

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
                  setActivePage("single");
                  navigate(`/products/${product.slug}`);
                }}
                hasNavigated={hasNavigated}   // ✅ fixed
                setHasNavigated={setHasNavigated} // optional if Products needs to update it
                isVertical={isVertical}
                setSelectedCategory={setSelectedCategory}
                setSelectedBrand={setSelectedBrand}
                setSelectedPrice={setSelectedPrice}
                setSelectedSort={setSelectedSort}
                setFilteredProducts={setFilteredProducts}
              />
          ) : (
            <HeroImage
              onSelectProduct={(product) => {
                // setHasNavigated(true);
                // setIsVertical(true);
                navigate(`${location.pathname}/${product.slug}`);
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Home;
