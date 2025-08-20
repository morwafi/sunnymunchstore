import { useState, useEffect } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Settings, Cart, BinMinusIn }from "iconoir-react";
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge";
import {Label} from '@/components/ui/label'
import { Separator } from "@/components/ui/separator"
import axios from "../product-api";
import MetadataDialog from "./Dialog";
import { RefreshDouble, MediaImage, IconoirProvider } from "iconoir-react";
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
function ProductGrid ()  {
  useEffect(() => {
  handleProductData();
}, []);
        const [uploadingId, setUploadingId] = useState(null);
        const [products, setProducts] = useState([]);
        const handleProductData = async () =>{
          try{
            const res = await axios.get('/retrieve-products')
            
            setProducts(res.data)
          }catch(err){
            console.error(err)
          }
        }
            
   const handleClick = (message) => {
          toast(message, {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })   
   };

const handleFileChange = async (event, productId) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Optional: optimistic preview — set product.fileUrl to local preview
  const previewUrl = URL.createObjectURL(file);
  setProducts(prev =>
    prev.map(p => (p._id === productId ? { ...p, fileUrl: previewUrl } : p))
  );

  setUploadingId(productId);

  const formData = new FormData();
  // IMPORTANT: field name must match multer config -> 'images'
  formData.append('images', file, file.name);

  // Tell backend this is an update for that product
  if (productId) formData.append('productId', productId);

  try {
    // backend handles create and update on /new-product
    const response = await axios.post('/new-product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    // backend returns the product object as response.data
    if (response.data) {
      setProducts(prev =>
        prev.map(prod => (prod._id === productId ? response.data : prod))
      );
      toast.success("Image updated successfully!");
    } else {
      // fallback: re-fetch products if response unexpected
      await handleProductData();
    }
  } catch (error) {
    console.error("Error updating image:", error);
    toast.error("Failed to update image.");
    // rollback to server state
    await handleProductData();
  } finally {
    setUploadingId(null);
    // allow selecting same file again
    event.target.value = null;
    // release the object URL after a short while
    setTimeout(() => URL.revokeObjectURL(previewUrl), 1000);
  }
};

return(
<>
<div>
  <div className="absolute space-y-6 space-x-6 flex items-center flex-row flex-wrap justify-center p-6 h-full">  
  {products.map((item, index) => (
    <Card key={index} className="border w-[400px] space-y-6 border-gray-300 shadow-lg">
        <div className="flex flex-col gap-3.5 w-full items-start justify-between p-4">
         <CardHeader className="relative flex! h-2/3! w-full gap-3.5 flex-col">
<img
  src={
    item.fileUrl
      ? `http://localhost:5000${item.fileUrl}`
      : item.imageUrls?.[0]
      ? `http://localhost:5000${item.imageUrls[0]}`
      : '/placeholder.png'
  }
  alt={item.title}
  className="w-full h-40 object-fill mb-4"
/>             
<label className="absolute top-2 left-8 bg-gray-200 rounded-2xl cursor-pointer shadow-2xl shadow-gray-400 h-10 w-16 flex items-center justify-center gap-2 p-2">
  <RefreshDouble height={26} width={26} strokeWidth="1.2" color="black" />
  <MediaImage height={14} width={14} color="black" className="absolute z-10 left-2/5" />
  <Input
    type="file"
    className="absolute z-50 opacity-0 h-full w-full cursor-pointer"
    onChange={(e) => handleFileChange(e, item._id)}
  />
</label>

          <CardTitle>
              {item.title}
          </CardTitle>
          < Separator className='bg-gray-600' />
          <CardDescription className="flex flex-col flex-wrap gap-2">
            <Label className="underline">Categories</Label>
            <div className="flex flex-row flex-wrap gap-2">
            {item.categories?.map((cat, index) => {
              // some extra logic possible here
              return (
                <Badge key={cat ?? index}>
                  {cat}
                </Badge>
              );
            })}
            </div>
          </CardDescription>

          <CardDescription className="flex flex-col flex-wrap gap-2">
            <Label className="underline">Tags</Label>
            <div className="flex flex-row flex-wrap gap-2">
            {item.tags?.map((tag, index) => {
              // some extra logic possible here
              return (
                <Badge key={tag ?? index}>
                  {tag}
                </Badge>
              );
            })}
            </div>
          </CardDescription>
            < Separator className='bg-gray-600' />

          <CardDescription className="flex flex-row gap-2">
                <Label className="underline">Price</Label>
                R{item.price}
          </CardDescription>

          <CardDescription className="flex flex-row gap-2">
               <Label className="underline">Discount</Label>
                R{item.discount}
          </CardDescription>
          < Separator className='bg-gray-600' />

          <CardDescription className="flex flex-row gap-2">
                <Label className="underline">Uploaded at:</Label>
                {item.uploadedAt}
          </CardDescription>

         </CardHeader>
         <CardFooter className="flex gap-3 flex-row items-center justify-between w-full">  

            <CardAction onClick={() => handleClick(`${item.label} added to favorites`)} className="w-1/2 flex flex-row justify-center items-center border gap-2 border-red-300 hover:border-red-500 hover:bg-red-300 text-red-400 hover:text-red-600 rounded-full p-2 transition">
               
                      <BinMinusIn height={16} width={16}/> <span>Delete</span>  
            </CardAction>

            <CardAction onClick={() => handleClick(`${item.label} added to cart`)} className="w-1/2 flex flex-row border justify-center items-center gap-2 border-green-300 hover:border-green-600 hover:bg-green-300 text-gray-700 hover-text-blue-600 rounded-full p-2 transition">
            <MetadataDialog
              file={null}
              initialData={item}
              mode="edit"
              onSaved={(updatedProduct) => {
                if (!updatedProduct) {
                  // fallback: re-fetch
                  handleProductData();
                  return;
                }
                setProducts(prev => prev.map(p => (p._id === updatedProduct._id ? updatedProduct : p)));
              }}
            >
              <Settings height={16} width={16}/> <span>Settings</span>
            </MetadataDialog>

            </CardAction>

         </CardFooter>
         </div>
    </Card>      
    
  ))}
  </div>
</div>
</>
)
}
export default ProductGrid