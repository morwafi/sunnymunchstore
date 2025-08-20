import React, {useEffect, useState} from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form";
import {z}  from "zod"
import { Plus, X, XmarkSquareSolid} from "iconoir-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import axios from "../settings-api"
import {toast} from 'sonner'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  brands: z.array(z.string()).min(1, {
    message: "At least 1 brand is required.",
  }).optional(),
  tags: z.array(z.string()).min(1, {
    message: "At least 1 tag is required.",
  }).optional(),
  categories: z.array(z.string()).min(1, {
    message: "At least 1 category is required.",
  }).optional(),
  id: z.string().optional(), // since you're adding id to form
}).refine(
  (data) => Object.values(data).some((val) => val !== undefined && val !== ""),
  { message: "At least one field must be filled" }
);

const SettingsFields = ({
    loading = false,
    onSaved
}) => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            brands: [],
            tags: [],
            categories: [],
            id: ""
        }
    })

    const { handleSubmit } = form;
    const [newTag, setNewTag] = React.useState('');
    const [newBrand, setNewBrand] =React.useState('');
    const [newCategory, setNewCategory] = React.useState('');


    const addTag = () => {
        if(newTag.trim()) {
            const currentTags = form.getValues('tags') || [];
            if(!currentTags.includes(newTag.trim())){
                form.setValue('tags', [...currentTags, newTag.trim()]);
            }
            setNewTag('');
        }
    }

    const removeTag = (tagToRemove) => {
            const currentTags = form.getValues('tags') || [];
            form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove)); 
    }

    const addBrand = () => {
        if(newBrand.trim()){
            const currentBrand = form.getValues('brands') || [];
            if(!currentBrand.includes(newBrand.trim())){
                form.setValue('brands', [...currentBrand, newBrand.trim()]);
            }
        }
    }

   const removeBrand = (brandToRemove) => {
        const currentBrand = form.getValues('brands') || [];
        form.setValue('brands', currentBrand.filter(brand => brand !==brandToRemove))
    }
 

    

    const addCategory = () => {
        if(newCategory.trim()){
            const currentCategories = form.getValues('categories') || [];
            if(!currentCategories.includes(newCategory.trim())){
                form.setValue('categories', [...currentCategories, newCategory.trim()])
            }
        }
    }

    const removeCategory = (categoryToRemove) => {
        const currentCategories = form.getValues('categories' || []);
        form.setValue('categories', currentCategories.filter(cat => cat !==categoryToRemove));
    }

    const handleKeyPress = (e, action) => {
        if(e.key === 'Enter'){
            e.preventDefault();
            action();
        }
    }

const handleProductSettingsData = async (values) => {
  console.log('submit fired with:', values)
  const fd = new FormData();

  if(values.brands?.length) {
  fd.append("brands", values.brands?.join(",") || "");
  }

  if(values.tags?.length){
  fd.append("tags", values.tags?.join(",") || "");
  }

  if(values.categories?.length){
  fd.append("categories", values.categories?.join(",") || "");
  }

  if(values.id){
  fd.append("id", values.id || "");
  }

  try {
    const response = await axios.post("/product-settings", fd, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true, // ✅ use withCredentials instead of credentials
    });
    console.log('settings:', response)

    if (onSaved) onSaved(response.data);
    toast.success(
      response.status === 201 ? "Settings created" : "Settings updated"
    );
  } catch (err) {
    console.error("submit error:", err);
    toast.error("Failed to save settings");
  }
};

    const [id, setId] =useState('')
    useEffect (() => {
        const handleRetrievedData = async () => {
        try{
            const response = await axios.get('/retrieve-settings', {
                credentials: true
            })

            const data = response.data

            setId(data._id)
        }catch (err) {
            console.error('error fetching settings:', err)
        }
    }
    handleRetrievedData()
   }, [])
    return(
        <div> 
            <Form {...form}>
                <form     
                onSubmit={form.handleSubmit(handleProductSettingsData)} 
                >
            <div>
                <FormLabel>
                    Brands
                </FormLabel>
                <div className="mt-2 space-y-6">
                    <div className="flex flex-row gap-2">
                        <Input
                        placeholder="Add a Brand"
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, addBrand)}
                        />
                        <Button type="Button" onClick={addBrand} size="sm" className="border-2 border-gray-500!">
                            <Plus color="black"/>
                        </Button>
                    </div>
                    {form.watch('brands')?.length > 0 &&(
                    <div className="">
                    {form.watch('brands')?.map((brand) => (
                        <Badge key={brand} variant="secondary" className="flex items-center gap-1 border-2 border-gray-500!">
                            {brand}
                            <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="p-0 h-4 w-4"
                            onClick={() => {removeBrand(brand)}}
                            >
                                <XmarkSquareSolid className="h-3 w-3" color="black"/>
                            </Button>
                        </Badge>
                    ))}
                    </div>
                )}
                </div>
            </div>
            <div>
                <FormLabel>
                    Tags
                </FormLabel>
                <div className="mt-2 space-y-6">
                    <div className="flex flex-row gap-2">
                        <Input
                        placeholder="Add a Tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, addTag)}
                        />
                        <Button type="Button" onClick={addTag} size="sm" className="border-2 border-gray-500!">
                            <Plus color="black"/>
                        </Button>
                    </div>
                    {form.watch('tags')?.length > 0 &&(
                    <div className="">
                    {form.watch('tags')?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1 border-2 border-gray-500!">
                            {tag}
                            <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="p-0 h-4 w-4"
                            onClick={() => {removeTag(tag)}}
                            >
                                <XmarkSquareSolid className="h-3 w-3" color="black"/>
                            </Button>
                        </Badge>
                    ))}
                    </div>
                )}
                </div>
            </div>
            <div>
                <FormLabel>
                    categories
                </FormLabel>
                <div className="mt-2 space-y-6">
                    <div className="flex flex-row gap-2">
                        <Input
                        placeholder="Add a category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, addCategory)}
                        />
                        <Button type="Button" onClick={addCategory} size="sm" className="border-2 border-gray-500!">
                            <Plus color="black"/>
                        </Button>
                    </div> 
                    {form.watch('categories')?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                    {form.watch('categories').map((category) => (
                   
                        <Badge key={category} variant="outline" className="flex items-center gap-1 border-2 border-gray-500!">
                            {category}
                            <Button 
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="p-0 h-4 w-4"
                            onClick={() => removeCategory(category)}
                            >
                                <XmarkSquareSolid className="h-3 2-3" color="black"/>
                            </Button>
                        </Badge>
                    ))} 
                    </div>
                )}

                <FormField 
                control={form.control}
                name="id"
                render = {({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input value={id} type="hidden" {...field}/>
                        </FormControl>
                    </FormItem>
                )}
                />
                </div>    
                <Button className="border-2 text-black border-gray-500" type="submit" disabled={loading} >
                    Submit
                </Button>
            </div>               
          </form>
        </Form>

    </div>
    )
}
export default SettingsFields