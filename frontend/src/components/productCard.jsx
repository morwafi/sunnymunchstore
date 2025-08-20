import React, {useState, useEffect} from "react";
import { label } from "framer-motion/client";
import useCart from "./useCart";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "./ui/card"
import { Badge } from "@/components/ui/badge";
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import { Heart, Cart, ShoppingBag }from "iconoir-react";
import { toast } from "sonner"
import axios from '../product-api';
import { motion } from "framer-motion";
import { fetchFilteredProducts } from "./lib/filtering";
const ProductCard = ({ products = [], onSelectProduct }) => {  
  const { addToCart } = useCart();

  return (
    <motion.div className="flex items-center overflow-auto flex-row flex-wrap justify-between">
      {products.map((item) => (
        <Card key={item._id} className="border border-gray-300 shadow-lg">
          <div className="flex flex-col gap-3.5 w-2xs items-start justify-between p-4">
            <a
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                if (onSelectProduct) onSelectProduct(item);
              }}
            >
              <CardHeader className="flex! h-2/3! w-full gap-3.5 flex-col">
                <img
                  src={item.fileUrl ? `http://localhost:5000${item.fileUrl}` : item.imageUrls?.[0] ? `http://localhost:5000${item.imageUrls[0]}` : '/placeholder.png'}
                  alt={item.title}
                  className="w-full h-40 object-fill mb-4"
                />
                <CardTitle>{item.title}</CardTitle>
                <CardTitle className="flex flex-row justify-center! items-center gap-4">
                  <Label className="text-lg">Price:</Label>
                  <p className="text-lg h-full">R{item.price}</p>
                </CardTitle>
                <CardDescription className="flex flex-col flex-wrap gap-4">
                  <Label className="underline">Categories</Label>
                  <div className="flex flex-row flex-wrap gap-2">
                    {item.categories?.map((cat, index) => (
                      <Badge key={cat ?? index}>{cat}</Badge>
                    ))}
                  </div>
                </CardDescription>
                <CardDescription className="flex flex-col flex-wrap gap-4">
                  <Label className="underline">Tags</Label>
                  <div className="flex flex-row flex-wrap gap-2">
                    {item.tags?.map((tag, index) => (
                      <Badge key={tag ?? index}>{tag}</Badge>
                    ))}
                  </div>
                </CardDescription>
              </CardHeader>
            </a>
            <CardFooter className="flex gap-3 flex-row items-center justify-between w-full">
              <CardAction
                onClick={async () => {
                  toast("Added to favorites");
                  try {
                    await axios.post("/tracking/product-tracking", { productId: item._id, type: "like" });
                  } catch {}
                }}
                className="w-2/3 border justify-items-center border-yellow-300 hover:border-yellow-600 hover:bg-yellow-300 text-gray-700 hover-text-blue-600 rounded-full p-2 transition"
              >
                <Heart />
              </CardAction>
              <CardAction
                onClick={() => addToCart(item, 1)}
                className="w-2/3 border justify-items-center border-green-300 hover:border-green-600 hover:bg-green-300 text-gray-700 hover-text-blue-600 rounded-full p-2 transition"
              >
                <ShoppingBag />
              </CardAction>
              <Input value={item._id} hidden />
            </CardFooter>
          </div>
        </Card>
      ))}
    </motion.div>
  );
};


export default ProductCard;