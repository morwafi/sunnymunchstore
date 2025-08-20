// MenuContent.jsx
import { motion } from "framer-motion";
import React from "react";

const variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 }
};

const MenuContent = ({ label }) => {
  return (
    <motion.div
      key={label} // triggers animation on change
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={variants}
      transition={{ duration: 0.4 }}
      className="mt-4 p-4 bg-white rounded-md shadow-lg text-center"
    >
      <p className="text-xl font-semibold">Showing content for: {label}</p>
    </motion.div>
  );
};

export default MenuContent;
