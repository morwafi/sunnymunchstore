import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { fetchFilteredProducts } from './lib/filtering';
const MenuBar = ({ 
  isVertical, 
  onChangeView, 
  selectedCategory, 
  selectedBrand, 
  selectedPrice, 
  selectedSort, 
  searchQuery,
  setFilteredProducts
}) => {
  
  const navigate = useNavigate();
  const menubar = [
    { label: 'Men', href: '/men' },
    { label: 'Women', href: '/women' },
    { label: 'Special', href: '/special' }
  ];

  return (
    <div className="z-50 flex w-dvw justify-center items-center">
      <motion.ul
        layout
        transition={{ duration: 0.6, type: 'spring' }}
        className={`flex ${isVertical ? 'flex-col items-center w-1/3! absolute left-[20%] max-sm:left-px gap-4 mt-[10%] text-center' : 'flex-row justify-around'} w-full text-center`}
      >
        {menubar.map((item, index) => (
          <motion.li
            layout
            key={index}
            className="cursor-pointer"
          >
            <span
              onClick={async(e) => {
                e.preventDefault();
                onChangeView();
                navigate(`/products/${item.label.toLowerCase()}`);
                if (handleMenuItemClick) await handleMenuItemClick(item.label);

                // // Call fetch with the clicked menu
                //  await fetchFilteredProducts(
                //        {
                //          selectedMenu: item.label, 
                //          selectedCategory, 
                //          selectedBrand, 
                //          selectedPrice, 
                //          selectedSort, 
                //          searchQuery
                //        },
                //        setFilteredProducts  // ✅ this must exist in the scope
                //      );
                   }}
              className="bg-gradient-gray5-text text-3xl! hover:underline louise-goerge-cafe"
            >
              {item.label}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};


export default MenuBar;
