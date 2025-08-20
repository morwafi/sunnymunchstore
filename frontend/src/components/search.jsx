import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Search } from "iconoir-react"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { li } from "framer-motion/client"

const SearchBar = ({ products }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
      if (!Array.isArray(products)) return; // ✅ guard against undefined
    
      if (query.trim() === "") {
        setResults([]);
        return;
      }
    
      const filtered = products.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );
    
      setResults(filtered.slice(0, 5)); // ✅ correct
    }, [query, products]);

    // const handleSelect = (product) => {
    //     navigate(`/product/${product.slug || product.id}`)
    // };
    return(
       <div>
        <div className="border-2 rounded-full p-2 pr-5 h-[50px] w-full flex justify-center items-center flex-row">
            <Input 
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            class="border-none  h-full w-full" 
            />
            <Button>
                <Search color="black" className="rounded-full!"/>
            </Button>
        </div>
        { results.length > 0 && (
            <ul className="absolute z-50 bg-white border mt-1 w-full rounded-lg shadow-lg">
                {results.map((product) => (
                    <li
                    key={product._id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-4"
                    // onClick={() => handleSelect(product)}
                    >
                        {product.imageUrls?.[0] && (
                            <img
                             src={`http://localhost:5000${product.imageUrls?.[0]}`}
                             alt={product.title}
                             className="w-8 h-8 object-cover rounded"
                            />
                        )}
                        |
                        <Link to={`/product/${product.slug || product._id}`}>{product.title}</Link>
                    </li>
                ))}
            </ul>
        )}
        </div>
    )
}
export default SearchBar