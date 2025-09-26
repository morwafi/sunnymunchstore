import React, {useEffect, useState} from "react";
import SearchBar from "./search";
import ProductCard from "./productCard";
import CategoryFilter from "./filter";
import { fetchFilteredProducts } from "../components/lib/filtering";

const Products = ({
  products = [],
  onSelectProduct,
  selectedCategory,
  selectedBrand,
  selectedPrice,
  selectedSort,
  setSelectedCategory,
  setSelectedBrand,
  setSelectedPrice,
  setSelectedSort,
  isVertical,
}) => {
  const [filteredProducts, setFilteredProducts] = useState([]);

 useEffect(() => {
    if (setFilteredProducts) {
      fetchFilteredProducts(
        { selectedCategory, selectedBrand, selectedPrice, selectedSort },
        setFilteredProducts
      );
    }
  }, [selectedCategory, selectedBrand, selectedPrice, selectedSort]);
return (
    <div className={`flex flex-col h-full gap-6 w-2/3 z-5 top-[90px] absolute right-[0px] px-10 ${isVertical ? 'max-sm:left-[0px] max-sm:w-full p-4' : ''}`}>
      <SearchBar products={products} />
      <CategoryFilter
        setSelectedCategory={setSelectedCategory}
        setSelectedBrand={setSelectedBrand}
        setSelectedPrice={setSelectedPrice}
        setSelectedSort={setSelectedSort}
        setFilteredProducts={setFilteredProducts}
      />
      <ProductCard
        products={products}
        onSelectProduct={onSelectProduct}
      />
    </div>
  );
};

export default Products;
