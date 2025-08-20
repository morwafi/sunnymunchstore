import React, { useState, useRef } from "react";
import { Upload } from "iconoir-react"; // or any other upload icon you use
import { Input } from "@/components/ui/input"; // Assuming this is a styled input
import { Label } from "@/components/ui/label";
import { XmarkSquareSolid } from "iconoir-react";
import { Button } from "@/components/ui/button"
import MetadataDialog from "./Dialog";
import { toast } from "sonner"



const FileUploader = ({
  onImageSelect,
  onImageRemove,
  currentImage,
  className,
  placeholder = "Upload Image",
  disabled = false,
}) => {
  const [file, setFile] = useState(null);
          const [products, setProducts] = useState([]);
 
  const [preview, setPreview] = useState(currentImage || null);
  const [fileName, setFileName] = useState("");
  const [isDragOver, setIsDragOver] = useState("");
  const fileInputRef = useRef(null);

const handleFileSelect = (f) => {
  if (f && f.type.startsWith("image/")) {
    const previewUrl = URL.createObjectURL(f);
    setPreview(previewUrl);
    setFile(f);
    setFileName(f.name)
    console.log("selected:", f.name)
     onImageSelect?.(f); 

    toast.custom((t) => (
        <div className={`${
          t.visible ? 'animate-enter' : 'animate-leave '
        } p-4 bg-white rounded shadow-md flex flex-row justify-around items-center gap-3 w-3xl! absolute bottom-0 right-0 z-50`}>
          <button
            type="button"
            onClick={() => {
              setFile(null)
              setPreview(null);
              setFileName("");
              onImageRemove && onImageRemove();
              toast.dismiss(t);
            }}
            onDrop={e => {
              e.preventDefault();
              if (disabled) return;
              handleFileSelect(e.dataTransfer.files[0]);
            }}

            onDragOver={e => e.preventDefault()}
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
          >
            <XmarkSquareSolid className="w-4 h-4" />
          </button>

          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-32 object-contain mx-auto"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <p className="w-fit text-sm text-gray-600 text-center">{f.name}</p>

  {/* pass f directly here */}
        <MetadataDialog
          file={f}
          onImageRemove={() => {
            setFile(null);
            setPreview(null);
            setFileName("");
            onImageRemove?.();
            toast.dismiss(t);
          }}
            onSaved={(updatedProduct) => {
    if (!updatedProduct) {
      // fallback: re-fetch
      handleProductData();
      return;
    }
    setProducts(prev => prev.map(p => (p._id === updatedProduct._id ? updatedProduct : p)));
  }}
          />

          <div className="flex justify-end mt-2">
            <button
              onClick={() => toast.dismiss(t)}
              className="text-xs text-gray-500 underline"
            >
              <XmarkSquareSolid className="w-4 h-4" />
            </button>
          </div>
        </div>
    ));
  }
};

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div  className=" w-full h-full flex justify-center items-center">
    <div
      className={`relative z-10 grid border-dashed border-2 mt-6 h-56 border-gray-400 w-10/12 justify-center items-center gap-3 ${className || ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragOver(true); }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
      onDrop={handleDrop}
    >
      <Label htmlFor="picture" className="cursor-pointer text-center">
        <div className="p-4">
          <div className="p-4 border-2 border-gray-500 rounded-xl inline-block">
            <Upload width={36} height={36} />
          </div>
        </div>
        <p className="text-3xl ">{placeholder}</p>

      </Label>

      <Input
        id="picture"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={e => handleFileSelect(e.target.files?.[0])}
        className="absolute h-full w-full opacity-0"
        disabled={disabled}
      />


    </div>        
  
    </div>
  );
};

export default FileUploader;
