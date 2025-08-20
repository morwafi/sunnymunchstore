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


const CategoryFilter = () => {
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

const categories = [
        { label: "Skincare", found: 128, href: "/category/skincare" },
        { label: "Makeup", found: 95, href: "/category/makeup" },
        { label: "Hair Care", found: 76, href: "/category/hair-care" },
        { label: "Fragrances", found: 43, href: "/category/fragrances" },
        { label: "Nail Care", found: 22, href: "/category/nail-care" },
        { label: "Bath & Body", found: 59, href: "/category/bath-body" },
        { label: "Men's Grooming", found: 30, href: "/category/mens-grooming" },
        { label: "Beauty Tools", found: 18, href: "/category/beauty-tools" },
        { label: "K-Beauty", found: 12, href: "/category/k-beauty" },
        { label: "Organic Beauty", found: 9, href: "/category/organic-beauty" }
]

const price = [
      { label: "Under R100", found: 45, href: "/products?price=under-100" },
      { label: "R100 - R250", found: 72, href: "/products?price=100-250" },
      { label: "R250 - R500", found: 61, href: "/products?price=250-500" },
      { label: "R500 - R1000", found: 38, href: "/products?price=500-1000" },
      { label: "Above R1000", found: 20, href: "/products?price=above-1000" }
]

const brands = [
  { label: "L'Oréal", found: 34, href: "/brand/loreal" },
  { label: "Maybelline", found: 28, href: "/brand/maybelline" },
  { label: "Neutrogena", found: 21, href: "/brand/neutrogena" },
  { label: "Revlon", found: 19, href: "/brand/revlon" },
  { label: "The Body Shop", found: 15, href: "/brand/the-body-shop" },
  { label: "Nivea", found: 42, href: "/brand/nivea" },
  { label: "Estée Lauder", found: 8, href: "/brand/estee-lauder" },
  { label: "MAC", found: 11, href: "/brand/mac" },
  { label: "Clinique", found: 10, href: "/brand/clinique" },
  { label: "Garnier", found: 26, href: "/brand/garnier" }
];

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
                    <NavigationMenuLink className="w-3xs!" key={index}>{item.label}</NavigationMenuLink>
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
                <NavigationMenuLink className="w-3xs!" key={index} href={category.href}>{category.label}</NavigationMenuLink>
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
                <NavigationMenuLink className="w-3xs!" key={index} href={price.href}>{price.label}</NavigationMenuLink>
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
                {brands.map((brands, index) => (
                <NavigationMenuLink className="w-3xs!" key={index} href={brands.href}>{brands.label}</NavigationMenuLink>
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