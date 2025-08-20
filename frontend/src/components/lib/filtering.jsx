import React, {useState, useEffect} from "react"
import axios from '../../product-api'
import SearchBar from "../search";
import CategoryFilter from '../filter'
import MenuBar from "../menubar";
import Home from "../../pages/home";



export const fetchFilteredProducts = async (filters, setFilteredProducts) => {
  
  try {
    const params = {};

    // Only send non-empty values
    if (filters.selectedMenu) {
      params.tags = Array.isArray(filters.selectedMenu)
        ? filters.selectedMenu
        : [filters.selectedMenu];
    }

    if (filters.selectedCategory) {
      params.categories = Array.isArray(filters.selectedCategory)
        ? filters.selectedCategory
        : [filters.selectedCategory];
    }

    if (filters.selectedBrand) {
      params.brands = Array.isArray(filters.selectedBrand)
        ? filters.selectedBrand
        : [filters.selectedBrand];
    }

    if (filters.selectedPrice) params.price = filters.selectedPrice;
    if (filters.selectedSort) params.sort = filters.selectedSort;
    if (filters.searchQuery) params.search = filters.searchQuery;

    // Convert array values to repeated query params for backend
    const queryParams = new URLSearchParams();
    for (const key in params) {
      if (Array.isArray(params[key])) {
        params[key].forEach(val => queryParams.append(key, val));
      } else {
        queryParams.append(key, params[key]);
      }
    }

    const res = await axios.get(`/product/retrieve-products-filter?${queryParams.toString()}`);
    setFilteredProducts(res.data);
    console.log('Fetched products:', res.data);
  } catch (err) {
    console.error("Error fetching products:", err);
    setFilteredProducts([]); // ensure UI updates even if error
  }
};