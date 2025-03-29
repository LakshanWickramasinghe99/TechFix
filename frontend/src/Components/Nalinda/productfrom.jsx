import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { 
  Upload, 
  Trash2, 
  Info, 
  ShoppingCart, 
  Tag, 
  Layers, 
  DollarSign, 
  Box 
} from "lucide-react";

const brands = ["Apple", "Samsung", "Sony", "Hp", "Lenovo", "Huawei", "Oppo", "OnePlus", "Xiaomi"];
const categories = [
  "Mobiles", "Laptops", "Watches", "Earphones", "Monitors",
  "PowerBanks", "Gaming", "Storages"
];

const ProductForm = () => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm();
  const [preview, setPreview] = useState(null);
  const image = watch("image");

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      alert("You can upload only one image");
      return;
    }
    const file = acceptedFiles[0];
    setPreview(URL.createObjectURL(file));
    setValue("image", file);
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setValue("image", null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {'image/*': ['.jpeg', '.jpg', '.png', '.gif']},
    maxFiles: 1
  });

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("salePrice", data.salePrice);
    formData.append("totalStock", data.totalStock);
    formData.append("description", data.description);
    formData.append("brand", data.brand);
    formData.append("category", data.category);
    if (data.image) formData.append("image", data.image);

    try {
      await axios.post("http://localhost:5000/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      reset();
      setPreview(null);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error);
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200 transform transition-all hover:shadow-3xl hover:scale-[1.01]">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ShoppingCart className="w-10 h-10 text-white/90" />
            <h2 className="text-3xl font-extrabold tracking-wide">Add New Product</h2>
          </div>
          <Info className="w-7 h-7 text-white/70 hover:text-white cursor-pointer hover:scale-110 transition" />
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-10 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Product Title */}
            <div className="relative">
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-indigo-500" />
                Product Title <span className="text-red-500 ml-1">*</span>
              </label>
              <input 
                id="title" 
                {...register("title", { 
                  required: "Product title is required", 
                  minLength: { value: 3, message: "Title must be at least 3 characters" } 
                })} 
                placeholder="Enter product title"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 ease-in-out hover:border-indigo-300 bg-white shadow-sm"
              />
              {errors.title && (
                <p className="absolute text-red-500 text-xs mt-1 flex items-center">
                  <Info className="w-3 h-3 mr-1" /> {errors.title.message}
                </p>
              )}
            </div>

            {/* Brand Dropdown */}
            <div className="relative">
              <label htmlFor="brand" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                <Layers className="w-5 h-5 mr-2 text-indigo-500" />
                Brand <span className="text-red-500 ml-1">*</span>
              </label>
              <select 
                id="brand" 
                {...register("brand", { required: "Brand selection is required" })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 ease-in-out hover:border-indigo-300 bg-white shadow-sm"
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              {errors.brand && (
                <p className="absolute text-red-500 text-xs mt-1 flex items-center">
                  <Info className="w-3 h-3 mr-1" /> {errors.brand.message}
                </p>
              )}
            </div>
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Regular Price */}
            <div className="relative">
              <label htmlFor="price" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                Regular Price <span className="text-red-500 ml-1">*</span>
              </label>
              <input 
                id="price" 
                type="number" 
                min="0.01" 
                step="0.01" 
                placeholder="0.00" 
                {...register("price", { 
                  required: "Price is required", 
                  valueAsNumber: true, 
                  validate: value => value > 0 || "Price must be greater than 0" 
                })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 ease-in-out hover:border-indigo-300 bg-white shadow-sm"
              />
              {errors.price && (
                <p className="absolute text-red-500 text-xs mt-1 flex items-center">
                  <Info className="w-3 h-3 mr-1" /> {errors.price.message}
                </p>
              )}
            </div>

            {/* Sale Price */}
            <div className="relative">
              <label htmlFor="salePrice" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                Sale Price <span className="text-red-500 ml-1">*</span>
              </label>
              <input 
                id="salePrice" 
                type="number" 
                min="0" 
                step="0.01" 
                placeholder="0.00" 
                {...register("salePrice", { 
                  required: "Sale price is required", 
                  valueAsNumber: true, 
                  min: { value: 0, message: "Sale price cannot be negative" }, 
                  validate: (value, formValues) => value <= formValues.price || "Sale price must be less than or equal to regular price" 
                })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 ease-in-out hover:border-indigo-300 bg-white shadow-sm"
              />
              {errors.salePrice && (
                <p className="absolute text-red-500 text-xs mt-1 flex items-center">
                  <Info className="w-3 h-3 mr-1" /> {errors.salePrice.message}
                </p>
              )}
            </div>

            {/* Total Stock */}
            <div className="relative">
              <label htmlFor="totalStock" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                <Box className="w-5 h-5 mr-2 text-purple-500" />
                Total Stock <span className="text-red-500 ml-1">*</span>
              </label>
              <input 
                id="totalStock" 
                type="number" 
                min="0" 
                step="1" 
                placeholder="0" 
                {...register("totalStock", { 
                  required: "Stock quantity is required", 
                  valueAsNumber: true, 
                  min: { value: 0, message: "Stock cannot be negative" }, 
                  validate: value => Number.isInteger(value) || "Stock must be a whole number" 
                })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 ease-in-out hover:border-indigo-300 bg-white shadow-sm"
              />
              {errors.totalStock && (
                <p className="absolute text-red-500 text-xs mt-1 flex items-center">
                  <Info className="w-3 h-3 mr-1" /> {errors.totalStock.message}
                </p>
              )}
            </div>
          </div>

          {/* Category and Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Category Dropdown */}
            <div className="relative">
              <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                <Layers className="w-5 h-5 mr-2 text-indigo-500" />
                Category <span className="text-red-500 ml-1">*</span>
              </label>
              <select 
                id="category" 
                {...register("category", { required: "Category selection is required" })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 ease-in-out hover:border-indigo-300 bg-white shadow-sm"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="absolute text-red-500 text-xs mt-1 flex items-center">
                  <Info className="w-3 h-3 mr-1" /> {errors.category.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="relative">
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                <Info className="w-5 h-5 mr-2 text-indigo-500" />
                Description <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea 
                id="description" 
                rows="4" 
                placeholder="Enter detailed product description..." 
                {...register("description", { 
                  required: "Product description is required", 
                  minLength: { value: 20, message: "Description should be at least 20 characters" } 
                })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 ease-in-out hover:border-indigo-300 bg-white shadow-sm resize-none"
              ></textarea>
              {errors.description && (
                <p className="absolute text-red-500 text-xs mt-1 flex items-center">
                  <Info className="w-3 h-3 mr-1" /> {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-indigo-500" />
              Product Image (Only 1 allowed)
            </label>
            <div 
              {...getRootProps()} 
              className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition duration-300 group
                ${isDragActive 
                  ? 'border-indigo-500 bg-indigo-50 scale-[1.02] shadow-md' 
                  : 'border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md hover:scale-[1.01]'
                }
              `}
            >
              <input {...getInputProps()} />
              <p className={`
                text-slate-600 font-medium transition duration-300
                ${isDragActive ? 'text-indigo-600 scale-105' : 'group-hover:text-indigo-600'}
              `}>
                {isDragActive ? "Drop file here..." : "Drag & drop an image here, or click to select"}
              </p>
            </div>
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="mt-6 flex items-center space-x-6 bg-slate-100 p-6 rounded-xl shadow-inner">
              <div className="flex-shrink-0">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-48 h-48 object-cover rounded-2xl border-4 border-white shadow-lg" 
                />
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-3">Image Preview</p>
                <button 
                  type="button" 
                  onClick={removeImage}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 group shadow-md"
                >
                  <Trash2 className="w-4 h-4 group-hover:scale-110" />
                  <span>Remove Image</span>
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`
                w-full py-4 rounded-xl text-white font-bold tracking-wide uppercase transition duration-300 transform
                ${isSubmitting 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.98] shadow-xl hover:shadow-2xl'
                }
              `}
            >
              {isSubmitting ? "Processing..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;