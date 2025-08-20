import React from 'react';
import { CubeScan } from "iconoir-react";
import { Label } from "@/components/ui/label";
import { motion } from 'framer-motion';
const SingleFunctionProductView = ({product, onChangeThreeD}) => {
    return(
    <motion.div className="absolute inset-0 gap-6 p-6">
      <motion.h1 onClick={
        (e) => {
            e.preventDefault();
            onChangeThreeD();
        }
      }>{product.title}</motion.h1>
      <motion.div className="relative">
        <motion.div className="z-50 absolute flex flex-row top-0 right-0">
          <Label>View 3D</Label>
          <CubeScan height={24} width={24}/>
        </motion.div>
      <motion.img
        src={
          product.fileUrl
            ? `http://localhost:5000${product.fileUrl}`
            : product.imageUrls?.[0]
            ? `http://localhost:5000${product.imageUrls[0]}`
            : '/placeholder.png'
        }
        alt={product.title}
      />
      </motion.div>
      <p >{product.description}</p>
    </motion.div>
    )
}
export default SingleFunctionProductView