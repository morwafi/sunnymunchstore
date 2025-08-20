import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { useNavigate, useLocation, href, useParams } from "react-router-dom";
import axios from "../product-api"
import { useState, useEffect } from "react";
import { fetchFilteredProducts } from "./lib/filtering";


const CategoryFilter = ({
  setSelectedCategory,
  setSelectedBrand,
  setSelectedPrice,
  setSelectedSort,
  selectedCategory,
  selectedBrand,
  selectedPrice,
  selectedSort,
  setFilteredProducts
}) => {

// useEffect(() => {
//   fetchFilteredProducts(
//     {
//       selectedCategory,
//       selectedBrand,
//       selectedPrice,
//       selectedSort,
//     },
//     setFilteredProducts
//   );
// }, [selectedCategory, selectedBrand, selectedPrice, selectedSort]);

  const navigate = useNavigate();
  const location = useLocation();
  const applyFilter = (type, value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(type, value);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  }
const sortables = [
    {
        label: 'Price',
        href: '/sort/price',

    },
    {
        label: 'Popularity',
        href: '/sort/popularity',
    },
    {
        label: 'Rating',
        href: '/sort/rating',
    },
    {
        label: 'Newest',
        href: '/sort/newest',
    }
]

const [categories, setCategory] = useState([]);
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axios.get('/settings/retrieve-settings');
      const allProducts = res.data;
      
      const allCategories = allProducts.flatMap(p => p.categories || []);
      
      const uniqueCategories = [... new Set(allCategories)];

      const categoriesWithCount = uniqueCategories.map(category =>({
        label: category,
        found: 0,
        href: `/brand/${category.toLowerCase().replace(/\s+/g, '-')}`
      }))
console.log(categoriesWithCount)
      setCategory(categoriesWithCount)
    }catch (err){
      console.error('Failed to fetch branch:', err);
    }
  }
  fetchCategories();
}, []) 

const price = [
      { label: "Under R100", found: 45, href: "/products?price=under-100" },
      { label: "R100 - R250", found: 72, href: "/products?price=100-250" },
      { label: "R250 - R500", found: 61, href: "/products?price=250-500" },
      { label: "R500 - R1000", found: 38, href: "/products?price=500-1000" },
      { label: "Above R1000", found: 20, href: "/products?price=above-1000" }
]

const [brands, setBrand] = useState([]);
useEffect(() => {
  const fetchBrands = async () => {
    try {
      const res = await axios.get('/settings/retrieve-settings');
      const allProducts = res.data;
      console.log(allProducts);
      //Flatten all brands into a single array
    const allBrands = allProducts.flatMap(p => {
  if (Array.isArray(p.brands)) return p.brands;
  if (p.brand) return [p.brand];
  return [];
});

const uniqueBrands = [...new Set(allBrands)];

const brandsWithCount = uniqueBrands.map(brand => ({
  label: brand,
  found: allProducts.filter(p => {
    if (Array.isArray(p.brands)) return p.brands.includes(brand);
    if (p.brand) return p.brand === brand;
    return false;
  }).length,
  href: `/brand/${brand.toLowerCase().replace(/\s+/g, '-')}`
}));

setBrand(brandsWithCount);
      console.log(brandsWithCount)
    }catch (err) {
      console.error('Failed to fetch branch:', err);
    }
  };
  fetchBrands();
}, [])

const { menu } = useParams();  // <-- grab current menu from URL

return (
    <div className="border border-gray-300 rounded-full flex items-center flex-row flex-wrap justify-between mb-4">
    <div className="flex items-center flex-row flex-wrap justify-between">
        {/* {content.map((item, index) => ( */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="rounded-full!">sort</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {sortables.map((item, index) => (
                    <NavigationMenuLink 
                    className="w-3xs!" 
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      applyFilter('sortable', sortables.label.toLowerCase());
                    }}
                    >
                      {item.label}
                    </NavigationMenuLink>
                    ))}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
        {/* ))} */}
    </div>
    <div className="flex items-center flex-row flex-wrap justify-between">
        <NavigationMenu >
          <NavigationMenuList >
            <NavigationMenuItem>
              <NavigationMenuTrigger className="rounded-full!">Category</NavigationMenuTrigger>
              <NavigationMenuContent >
                {categories.map((category, index) => (
                <NavigationMenuLink 
                className="w-3xs!" 
                key={index} 
                onClick={(e) => {
                  e.preventDefault();
                   setSelectedCategory(category.label);
                }}
                >
                 {category.label} ({category.found})
                </NavigationMenuLink>
                
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        </div>
    <div className="flex items-center flex-row flex-wrap justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="rounded-full!">Price</NavigationMenuTrigger>
              <NavigationMenuContent>
                {price.map((price, index) => (
                <NavigationMenuLink 
                className="w-3xs!" 
                key={index} 
                onClick={(e) => {
                  e.preventDefault();
                  applyFilter('price', price.label.toLowerCase())
                }}
                >
                  {price.label}
                </NavigationMenuLink>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        </div>
    <div className="flex items-center flex-row flex-wrap justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="rounded-full!">Brand</NavigationMenuTrigger>
              <NavigationMenuContent>
                {brands.map((brand, index) => (
                <NavigationMenuLink 
                className="w-3xs!" 
                key={index} 
                    onClick={async (e) => {
                     setSelectedBrand(brand.label)

                    }}
                >
                 {brand.label} ({brand.found})
                </NavigationMenuLink>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        </div>
    </div>
)
}
export default CategoryFilter