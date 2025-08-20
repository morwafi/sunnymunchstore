import { useEffect, useState } from "react";
import axios from "../product-api";
import {motion, AnimatePresence} from 'framer-motion';
import ThreeDProductView from './ThreeDProductView';
import SingleFunctionProductView from "./singleProductView";
function Single({ productId }) {
  const [product, setProduct] = useState(null);
  const [isThreeD, setIsThreeD] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/product/retrieve-products`, { params: { id: productId } });
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className={`overflow-scroll flex flex-col h-full gap-6 w-2/3 z-10 absolute right-[0px] px-10 ${isThreeD ? 'top-0 px-0!' : 'top-1/6'}`}>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          {isThreeD ? (
            <ThreeDProductView 
              product={product} 
              onChangeThreeD={() => setIsThreeD(false)} 
            />
          ) : (
            <SingleFunctionProductView 
              product={product} 
              onChangeThreeD={() => setIsThreeD(true)} 
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


export default Single;
