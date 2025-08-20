import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FileUploader from "../components/FileUploader";
import { Toaster } from "sonner";
import MetadataDialog from "../components/Dialog";
import ProductGrid from "../components/ProductGrid";
function Products() {
    const [selectedImage, setSelectedImage] = useState(null);
const handleImageSelect = (file) => {
  console.log('Products: got file from uploader', file); // should be File
  setSelectedImage(file);
};
  const handleImageRemove = () => {
    setSelectedImage(null)
  };
  return (
  <>
    <div className="flex flex-col items-center w-full p-6 justify-center h-screen min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Products Page</h1>
      <p className="text-gray-700">This is the products page.</p>
       <Tabs defaultValue="account" className="w-full mt-6">
            <TabsList className="w-full">
              <TabsTrigger value="account" className="text-3xl">Upload</TabsTrigger>
              <TabsTrigger value="password" className="text-3xl w-1/2!">Products</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="w-full flex justify-center items-center">
              <FileUploader
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
              placeholder="Drop or click to upload"
              />
            </TabsContent>
            <TabsContent value="password">
               <ProductGrid />
            </TabsContent>
          </Tabs>
            
    </div>
    <Toaster
             file={selectedImage} 
             onImageRemove={handleImageRemove}
             className =  'w-full! hover:transform-none! hover:transition-all! z-50! '
             toastOptions={{
                 style: {
                   transform: 'none',
                   transition: 'none',
                 },                    
                  duration: 50000,
                  theme: "system"
               }}
             />
                   {/* If you show the dialog in the page (or inside toast), pass file prop */}
      <MetadataDialog file={selectedImage} onImageRemove={handleImageRemove} />
             </>
  );
}
export default Products;