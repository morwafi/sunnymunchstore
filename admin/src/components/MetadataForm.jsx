import React, {useState, useEffect,useRef, use} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, X, XmarkSquareSolid} from "iconoir-react";
import { Badge } from "@/components/ui/badge";
import { CubeScanSolid } from "iconoir-react";
import { toast } from "sonner";
import axios from "../product-api";
import axioSettings from '../settings-api'
import FileUploader from "./FileUploader";

const metadataSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    brands: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    collection: z.string().optional(),
    price: z.string().optional(),
    discount: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    focusKeyword: z.string().optional(),
    altText: z.string().optional(),
    productId: z.string().optional(),
})
const MetaDataForm = ({
 file, 
 onImageRemove,
 onCancel, 
 loading = false, 
 initialData = {},
 onSaved, // <-- NEW: parent callback to apply updated/created product
}) => {

const form = useForm({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
        title: '',
        description: '',
        tags: [],
        brands: [],
        categories: [],
        collection: '',
        price: 0,
        discount: 0,
        metaTitle: '',
        metaDescription: '',
        focusKeyword: '',
        altText: '',
        productId: initialData?._id ?? initialData?.productId ?? undefined,
        ...initialData,
    }

})
const [existingSettings, setExistingSettings] = useState({
  brands: [],
  tags: [],
  categories: []
});
const [id, setId] =useState('')
const [tagSuggestions, setTagSuggestions] = useState([]);
const [categorySuggestions, setCategorySuggestions] = useState([]);
const [brandSuggestions, setBrandSuggestions] = useState([]);

const handleBrandChange = (value) => {
  setNewBrand(value);
  if (!value.trim()) return setBrandSuggestions([]);

  const suggestions = existingSettings.brands.filter(
    brand =>
      brand.toLowerCase().includes(value.toLowerCase()) &&
      !(form.getValues('brands') || []).includes(brand)
  );
  setBrandSuggestions(suggestions);
};

// Add brand only if it exists in existingSettings
const addBrand = () => {
  if (!newBrand.trim()) return;
  if (!existingSettings.brands.includes(newBrand)) return; // block invalid brand

  const currentBrands = form.getValues('brands') || [];
  if (!currentBrands.includes(newBrand.trim())) {
    form.setValue('brands', [...currentBrands, newBrand.trim()]);
  }
  setNewBrand('');
};

const removeBrand = (brandToRemove) => {
  const currentBrands = form.getValues('brands') || [];
  form.setValue('brands', currentBrands.filter(brand => brand !== brandToRemove));
};

// Tag input change handler
const handleTagChange = (value) => {
  setNewTag(value);
  if (!value.trim()) return setTagSuggestions([]);
  
  const suggestions = existingSettings.tags.filter(
    tag =>
      tag.toLowerCase().includes(value.toLowerCase()) &&
      !(form.getValues('tags') || []).includes(tag)
  );
  setTagSuggestions(suggestions);
};

// Category input change handler
const handleCategoryChange = (value) => {
  setNewCategory(value);
  if (!value.trim()) return setCategorySuggestions([]);
  
  const suggestions = existingSettings.categories.filter(
    cat =>
      cat.toLowerCase().includes(value.toLowerCase()) &&
      !(form.getValues('categories') || []).includes(cat)
  );
  setCategorySuggestions(suggestions);
};


useEffect(() => {
  const handleRetrievedData = async () => {
    try {
      const response = await axioSettings.get('/retrieve-settings', {
        withCredentials: true
      });
      const data = response.data[0] || {}; // assuming array
      setExistingSettings({
        brands: data.brands || [],
        categories: data.categories || [],
        tags: data.tags || []
      });
      setId(data._id || "");
      form.reset({
        brands: data.brands || [],
        categories: data.categories || [],
        tags: data.tags || [],
        id: data._id || ""
      });
    } catch (err) {
      console.error('error fetching settings:', err);
    }
  };
  handleRetrievedData();
}, []);
const [newBrand, setNewBrand] = React.useState('')
const [model, setModel] = useState(null)
const [newTag, setNewTag] = React.useState('');
const [newCategory, setNewCategory] = React.useState('');
const [selectedImage, setSelectedImage] = useState(null);
const watchedTitle = form.watch('title');
const [modelFile, setModelFile] = useState(null);
const [products, setProducts] = useState([]);

const handleProductSubmit = async (values) => {
  console.log("Submitting:", values);
    console.log('Submitting productId:', values.productId);

  const isUpdate = Boolean(values.productId && values.productId !== 'undefined');
  const fd = new FormData();

  // files (if chosen)
  if (file instanceof File) fd.append('images', file, file.name);
  if (modelFile instanceof File) fd.append('model', modelFile, modelFile.name);

  if (isUpdate) fd.append('productId', values.productId);

  const appendIfValid = (key, val) => {
    if (!isUpdate || (val !== undefined && val !== null && val !== "")) {
      // append strings (convert arrays to comma list)
      fd.append(key, val ?? "");
    }
  };


  appendIfValid('title', values.title);
  appendIfValid('description', values.description);
  appendIfValid('metaTitle', values.metaTitle);
  appendIfValid('metaDescription', values.metaDescription);
  appendIfValid('collection', values.collection);
  appendIfValid('price', values.price != null ? String(values.price) : null);
  appendIfValid('discount', values.discount != null ? String(values.discount) : null);
  appendIfValid('focusKeyword', values.focusKeyword);
  appendIfValid('altText', values.altText);
  appendIfValid('categories', values.categories?.length ? values.categories.join(',') : null);
  appendIfValid('tags', values.tags?.length ? values.tags.join(',') : null);
  appendIfValid('brands', values.brands?.length ? values.brands.join(',') : null);

  for (const [k, v] of fd.entries()) console.log('FormData:', k, v instanceof File ? v.name : v);

  try {
    // Always send to /new-product (backend handles both create & update)
    const response = await axios.post('/new-product', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });
         if (response.data) {
        // use the callback passed from parent to update product list there
        if (typeof onSaved === 'function') {
          onSaved(response.data);
        }
        toast.success(isUpdate ? "Product updated successfully!" : "Product created successfully!");
      } else {
        // fallback: if parent provided a refresh function, call it via onSaved(null) or similar
        if (typeof onSaved === 'function') onSaved(null);
        toast.success(isUpdate ? "Product updated" : "Product created");
      }

    // backend returns the product object
    if (response.data) {
      // if it was an update, update local state; if create, optionally re-fetch or add new
      if (isUpdate) {
        setProducts(prev => prev.map(p => (p._id === values.productId ? response.data : p)));
        toast.success("Product updated successfully!");
      } else {
        // created new product — either push or re-fetch
        setProducts(prev => [response.data, ...prev]);
        toast.success("Product created successfully!");
      }
    } else {
      // fallback: refresh entire list
      await handleProductData();
      toast.success(isUpdate ? "Product updated" : "Product created");
    }

    onImageRemove?.();
    form.reset();
    setModelFile(null);
  } catch (err) {
    console.error('Submit error:', err);
    toast.error(isUpdate ? "Update failed" : "Upload failed");
  }
};

React.useEffect(() => {
  if (initialData && Object.keys(initialData).length) {
    form.reset({ 
      ...form.getValues(), 
      ...initialData, 
      productId: initialData._id ?? initialData.productId 
    });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [initialData]);

React.useEffect(() => {
    if(watchedTitle && !form.getValues('metaTitle')){
        form.setValue('metaTitle', watchedTitle)
    }
},[watchedTitle, form])

const addTag = () => {
  const trimmed = newTag.trim();
  if (!trimmed) return;

  if (!existingSettings.tags.includes(trimmed)) {
    toast.error("This tag does not exist in settings");
    return;
  }

  const currentTags = form.getValues('tags') || [];
  if (!currentTags.includes(trimmed)) {
    form.setValue('tags', [...currentTags, trimmed]);
  }
  setNewTag('');
};

  const handleModelUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setModel(f);
    // optional: also tell RHF about it, but not required if we use local state for submit:
    form.setValue("model", f, { shouldDirty: true });
  };

const removeTag = (tagToRemove) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove))
}

const addCategory = () => {
  const trimmed = newCategory.trim();
  if (!trimmed) return;

  if (!existingSettings.categories.includes(trimmed)) {
    toast.error("This category does not exist in settings");
    return;
  }

  const currentCategories = form.getValues('categories') || [];
  if (!currentCategories.includes(trimmed)) {
    form.setValue('categories', [...currentCategories, trimmed]);
  }
  setNewCategory('');
};

const removeCategory = (categoryToRemove) =>{
    const currentCategories = form.getValues('categories') || [];
    form.setValue('categories', currentCategories.filter(cat => cat !== categoryToRemove))
};

const handleKeyPress = (e, action) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    action();
  }
};

return (
    <Card>
        <Form {...form}>
            <div>
                <form action="" className="space-y-6" onSubmit={form.handleSubmit(handleProductSubmit)}>
                        <div className="space-y-4">
                        <h4  className="font-medium text-sm text-muted-foreground uppercase tracking-wide text-center">
                            Basic information
                        </h4>

                        <FormField
                          control={form.control}
                          name="model"
                          render={({ field }) => (
   <FormField
  control={form.control}
  name="model"
  render={({ field }) => (
    <FormItem>


<FormField
  control={form.control}
  name="model"
  render={({ field }) => (
    <FormItem>
      <div
        className="relative flex justify-center items-center border-2 border-gray-400 border-dashed h-28 cursor-pointer"
        onClick={() => document.getElementById('modelInput').click()}
      >
        <FormLabel><CubeScanSolid /> 3D Model</FormLabel>

        { /* preview filename if present */ }
        {form.watch('model')?.name && (
          <span className="text-xs text-green-600 ml-2">
            {form.watch('model').name}
          </span>
        )}

        <FormControl>
          {/* IMPORTANT: do NOT spread {...field} here (that causes file-input value errors) */}
          <input
            id="modelInput"
            type="file"
            accept=".glb,.gltf,.obj,.fbx,.blend"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setModelFile(f);         // local state for submit & preview
              field.onChange(f);       // tell react-hook-form about it
            }}
          />
        </FormControl>
      </div>
    </FormItem>
  )}
/>

    </FormItem>
  )}
/>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter product title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter product description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        
                        <FormField
                          control={form.control}
                          name="collection"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Collection</FormLabel>
                              <FormControl>
                                <Input placeholder="Group products into a collection" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="mt-6 space-y-6">
                            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide text-center">
                                Tags & categories
                            </h4>
                       
                        <div>
{/* Tags Section */}
<FormLabel>Tags</FormLabel>
<div className="mt-2 space-y-2 relative">
  <div className="flex flex-row gap-2">
    <div className="flex-1 relative">
      <Input
        placeholder="Add a Tag"
        value={newTag}
        onChange={(e) => handleTagChange(e.target.value)}
        onKeyDown={(e) => handleKeyPress(e, addTag)}
      />
      {/* Suggestion dropdown */}
      {tagSuggestions.length > 0 && (
        <div className="absolute z-10 bg-white border mt-1 rounded w-full max-h-40 overflow-auto">
          {tagSuggestions.map((tag) => (
            <div
              key={tag}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                form.setValue('tags', [...(form.getValues('tags') || []), tag]);
                setNewTag('');
                setTagSuggestions([]);
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
    <Button type="button" onClick={addTag} size="sm" className="border-2 border-gray-500">
      <Plus color="black" />
    </Button>
  </div>

  {/* Selected tags */}
  {form.watch('tags')?.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {form.watch('tags').map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="flex items-center gap-1 border-2 border-gray-500"
        >
          {tag}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="p-0 h-4 w-4"
            onClick={() => removeTag(tag)}
          >
            <XmarkSquareSolid className="h-3 w-3" color="black" />
          </Button>
        </Badge>
      ))}
    </div>
  )}
</div>

                                                    <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>price</FormLabel>
                              <FormControl>
                                <Input 
                                type="number" 
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                placeholder="products price" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="discount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discount Price</FormLabel>
                              <FormControl>
                                <Input 
                                type="number" 
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                placeholder="products Discounted price" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        </div>

                        <div >
                                {/* Categories Section */}
                                <FormLabel>Categories</FormLabel>
                                <div className="mt-2 space-y-6 relative">
                                  <div className="flex flex-row gap-2">
                                    <div className="flex-1 relative">
                                      <Input
                                        placeholder="Add category"
                                        value={newCategory}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        onKeyDown={(e) => handleKeyPress(e, addCategory)}
                                      />
                                      {/* Suggestion dropdown */}
                                      {categorySuggestions.length > 0 && (
                                        <div className="absolute z-10 bg-white border mt-1 rounded w-full max-h-40 overflow-auto">
                                          {categorySuggestions.map((cat) => (
                                            <div
                                              key={cat}
                                              className="p-2 hover:bg-gray-200 cursor-pointer"
                                              onClick={() => {
                                                form.setValue('categories', [...(form.getValues('categories') || []), cat]);
                                                setNewCategory('');
                                                setCategorySuggestions([]);
                                              }}
                                            >
                                              {cat}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    <Button type="button" onClick={addCategory} size="sm" className="border-2 border-gray-500">
                                      <Plus color="black" />
                                    </Button>
                                  </div>
                                
                                  {/* Selected categories */}
                                  {form.watch('categories')?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {form.watch('categories').map((cat) => (
                                        <Badge
                                          key={cat}
                                          variant="outline"
                                          className="flex items-center gap-1 border-2 border-gray-500!"
                                        >
                                          {cat}
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="p-0 h-4 w-4"
                                            onClick={() => removeCategory(cat)}
                                          >
                                            <XmarkSquareSolid className="h-3 w-3" color="black" />
                                          </Button>
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <FormLabel>Brands</FormLabel>
                                    <div className="mt-2 space-y-2 relative">
                                      <div className="flex flex-row gap-2">
                                        <div className="flex-1 relative">
                                          <Input
                                            placeholder="Add a Brand"
                                            value={newBrand}
                                            onChange={(e) => handleBrandChange(e.target.value)}
                                            onKeyDown={(e) => handleKeyPress(e, addBrand)}
                                          />
                                          {/* Brand suggestion dropdown */}
                                          {brandSuggestions.length > 0 && (
                                            <div className="absolute z-10 bg-white border mt-1 rounded w-full max-h-40 overflow-auto">
                                              {brandSuggestions.map((brand) => (
                                                <div
                                                  key={brand}
                                                  className="p-2 hover:bg-gray-200 cursor-pointer"
                                                  onClick={() => {
                                                    form.setValue('brands', [...(form.getValues('brands') || []), brand]);
                                                    setNewBrand('');
                                                    setBrandSuggestions([]);
                                                  }}
                                                >
                                                  {brand}
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                        <Button
                                          type="button"
                                          onClick={addBrand}
                                          size="sm"
                                          className="border-2 border-gray-500"
                                          disabled={!existingSettings.brands.includes(newBrand)} // disable if not in existing
                                        >
                                          <Plus color="black" />
                                        </Button>
                                      </div>
                                    
                                      {/* Selected brands */}
                                      {form.watch('brands')?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          {form.watch('brands').map((brand) => (
                                            <Badge
                                              key={brand}
                                              variant="secondary"
                                              className="flex items-center gap-1 border-2 border-gray-500"
                                            >
                                              {brand}
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="p-0 h-4 w-4"
                                                onClick={() => removeBrand(brand)}
                                              >
                                                <XmarkSquareSolid className="h-3 w-3" color="black" />
                                              </Button>
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                </div>
                        </div>            
                    </div>

                    {/* SEO Fields */}
                    <div className="mt-6 space-y-6">
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide text-center">
                            SEO Optimization
                        </h4>

                        <FormField
                        control={form.control}
                        name="metaTitle"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Meta Title</FormLabel>
                            <FormControl>
                                <Input placeholder="SEO-Optimization title" {...field} />
                            </FormControl>
                            <FormMessage/>
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="metaDescription"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Meta Description</FormLabel>
                            <FormControl>
                                <Input placeholder="SEO-Optimization Description" {...field} />
                            </FormControl>
                            <FormMessage/>
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="focusKeyword"
                        render={({ field }) =>( 
                            <FormItem>
                            <FormLabel>Focus Keyword</FormLabel>
                            <FormControl>
                                <Input placeholder="Primary SEO keyword" {...field} />
                            </FormControl>
                            <FormMessage/>
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="altText"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Alt Text</FormLabel>
                            <FormControl>
                                <Input placeholder="Alternative text accessibility" {...field} />
                            </FormControl>
                            <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <FormField 
                        control={form.control}
                        name="productId"
                        render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="hidden" {...field} />
                          </FormControl>
                        </FormItem>
                        )}
                        />
                        {/* Form Action */}
                        <div className="space-x-4">
                        {onCancel && (
                        <Button className="border-2 text-black border-gray-500">
                            Cancel
                        </Button>
                        )}
                        <Button className="border-2 text-black border-gray-500">
                            Save Draft
                        </Button>

                        <Button  className="border-2 text-black border-gray-500" type="submit" disabled={loading} >
                            {loading ? 'saving...' : 'Save Metadata'}
                        </Button>
                        </div>
                    </div>
                    </div>
                </form>
            </div> 

        </Form>
    </Card>
)
}
export default MetaDataForm