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
  Box,
  CheckCircle,
  Image,
  Save,
  AlertTriangle
} from "lucide-react";

const brands = ["Apple", "Samsung", "Sony", "Hp", "Lenovo", "Huawei", "Oppo", "OnePlus", "Xiaomi"];
const categories = [
  "Mobiles", "Laptops", "Watches", "Earphones", "Monitors",
  "PowerBanks", "Gaming", "Storages"
];

// Category and brand colors
const categoryColors = {
  "Mobiles": "#FF6B6B",
  "Laptops": "#4ECDC4",
  "Watches": "#FFD166",
  "Earphones": "#6A0572",
  "Monitors": "#1A535C",
  "PowerBanks": "#F9C80E",
  "Gaming": "#FF4365",
  "Storages": "#3D5A80"
};

const brandColors = {
  "Apple": "#A2AAAD",
  "Samsung": "#1428A0",
  "Sony": "#000000",
  "Hp": "#0096D6",
  "Lenovo": "#E2231A",
  "Huawei": "#FF0000",
  "Oppo": "#1D953F",
  "OnePlus": "#F5010C",
  "Xiaomi": "#FF6900"
};

const ItemForm = () => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting, isValid, isDirty } } = useForm({
    mode: "onChange"
  });
  const [preview, setPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [formStatus, setFormStatus] = useState(null); // "success", "error", or null
  const image = watch("image");
  const selectedCategory = watch("category");
  const selectedBrand = watch("brand");

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
    setFormStatus(null);
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
      await axios.post("http://localhost:5000/api/items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      reset();
      setPreview(null);
      setSuccessMessage("Product added successfully! 🎉");
      setFormStatus("success");
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
        setFormStatus(null);
      }, 5000);
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error);
      setFormStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6 sm:p-8 lg:p-10">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 transform transition-all duration-300">
        {/* Header with simplified gradient */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 animate-gradient-x"></div>
          <div className="relative p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2.5 rounded-lg backdrop-blur-sm">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-wide">Add New Product</h2>
                <p className="text-white/80 text-sm">Fill in the details to create a new product listing</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form with improved spacing and layout */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-6">
          {/* Success/Error Messages with improved styling */}
          {formStatus === "success" && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 rounded flex items-center mb-4 animate-fade-in">
              <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <p className="text-sm">{successMessage}</p>
            </div>
          )}
          
          {formStatus === "error" && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded flex items-center mb-4 animate-fade-in">
              <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
              <p className="text-sm">Failed to add product. Please try again.</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Product Title */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center">
                <Tag className="w-4 h-4 mr-1.5 text-indigo-500" />
                Product Title <span className="text-red-500 ml-1">*</span>
              </label>
              <input 
                id="title" 
                {...register("title", { 
                  required: "Product title is required", 
                  minLength: { value: 3, message: "Title must be at least 3 characters" } 
                })} 
                placeholder="Enter product title"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-indigo-200 bg-white"
              />
              {errors.title && (
                <div className="flex items-center text-red-500 text-xs mt-1 pl-1">
                  <Info className="w-3 h-3 mr-1 flex-shrink-0" /> {errors.title.message}
                </div>
              )}
            </div>

            {/* Brand Dropdown with simplified selection */}
            <div className="space-y-1.5">
              <label htmlFor="brand" className="text-sm font-medium text-gray-700 flex items-center">
                <Layers className="w-4 h-4 mr-1.5 text-indigo-500" />
                Brand <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select 
                  id="brand" 
                  {...register("brand", { required: "Brand selection is required" })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-indigo-200 bg-white appearance-none pr-10"
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  {selectedBrand && (
                    <div 
                      className="w-3 h-3 rounded-full mr-1.5" 
                      style={{ backgroundColor: brandColors[selectedBrand] || '#CBD5E0' }}
                    ></div>
                  )}
                  <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M7 7l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              {errors.brand && (
                <div className="flex items-center text-red-500 text-xs mt-1 pl-1">
                  <Info className="w-3 h-3 mr-1 flex-shrink-0" /> {errors.brand.message}
                </div>
              )}
            </div>
          </div>

          {/* Price and Stock row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Regular Price */}
            <div className="space-y-1.5">
              <label htmlFor="price" className="text-sm font-medium text-gray-700 flex items-center">
                <DollarSign className="w-4 h-4 mr-1.5 text-green-500" />
                Regular Price <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
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
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-200 bg-white"
                />
              </div>
              {errors.price && (
                <div className="flex items-center text-red-500 text-xs mt-1 pl-1">
                  <Info className="w-3 h-3 mr-1 flex-shrink-0" /> {errors.price.message}
                </div>
              )}
            </div>

            {/* Sale Price */}
            <div className="space-y-1.5">
              <label htmlFor="salePrice" className="text-sm font-medium text-gray-700 flex items-center">
                <DollarSign className="w-4 h-4 mr-1.5 text-green-500" />
                Sale Price <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
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
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-200 bg-white"
                />
              </div>
              {errors.salePrice && (
                <div className="flex items-center text-red-500 text-xs mt-1 pl-1">
                  <Info className="w-3 h-3 mr-1 flex-shrink-0" /> {errors.salePrice.message}
                </div>
              )}
            </div>

            {/* Total Stock */}
            <div className="space-y-1.5">
              <label htmlFor="totalStock" className="text-sm font-medium text-gray-700 flex items-center">
                <Box className="w-4 h-4 mr-1.5 text-purple-500" />
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
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-purple-200 bg-white"
              />
              {errors.totalStock && (
                <div className="flex items-center text-red-500 text-xs mt-1 pl-1">
                  <Info className="w-3 h-3 mr-1 flex-shrink-0" /> {errors.totalStock.message}
                </div>
              )}
            </div>
          </div>

          {/* Category and Description row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="category" className="text-sm font-medium text-gray-700 flex items-center">
                <Layers className="w-4 h-4 mr-1.5 text-indigo-500" />
                Category <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select 
                  id="category" 
                  {...register("category", { required: "Category selection is required" })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-indigo-200 bg-white appearance-none pr-10"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  {selectedCategory && (
                    <div 
                      className="w-3 h-3 rounded-full mr-1.5" 
                      style={{ backgroundColor: categoryColors[selectedCategory] || '#CBD5E0' }}
                    ></div>
                  )}
                  <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M7 7l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              {errors.category && (
                <div className="flex items-center text-red-500 text-xs mt-1 pl-1">
                  <Info className="w-3 h-3 mr-1 flex-shrink-0" /> {errors.category.message}
                </div>
              )}
            </div>

            {/* Description with improved textarea */}
            <div className="space-y-1.5">
              <label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center">
                <Info className="w-4 h-4 mr-1.5 text-indigo-500" />
                Description <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea 
                id="description" 
                rows="3" 
                placeholder="Enter detailed product description..." 
                {...register("description", { 
                  required: "Product description is required", 
                  minLength: { value: 20, message: "Description should be at least 20 characters" } 
                })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-indigo-200 bg-white resize-none"
              ></textarea>
              {errors.description && (
                <div className="flex items-center text-red-500 text-xs mt-1 pl-1">
                  <Info className="w-3 h-3 mr-1 flex-shrink-0" /> {errors.description.message}
                </div>
              )}
            </div>
          </div>

          {/* Image Upload with cleaner design */}
          <div className="bg-gray-50 p-5 rounded-xl">
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Image className="w-4 h-4 mr-1.5 text-indigo-500" />
              Product Image
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
              {/* Dropzone */}
              <div 
                {...getRootProps()} 
                className={`
                  border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all duration-200
                  ${isDragActive 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                  }
                `}
                style={{ minHeight: "180px" }}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center h-full">
                  <Upload className={`
                    w-10 h-10 mb-3 transition-colors duration-200
                    ${isDragActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'}
                  `} />
                  <p className={`
                    text-sm font-medium transition-colors duration-200
                    ${isDragActive ? 'text-indigo-600' : 'text-gray-600'}
                  `}>
                    {isDragActive ? "Drop file here..." : "Drag & drop an image here, or click to select"}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">JPG, PNG or GIF (Max. 1 file)</p>
                </div>
              </div>

              {/* Image Preview with cleaner animation */}
              <div className={`transition-all duration-300 ${preview ? 'opacity-100' : 'opacity-0'}`}>
                {preview && (
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="relative mb-2">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-40 object-contain rounded-md bg-gray-50" 
                      />
                      <button 
                        type="button" 
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors duration-200 shadow-sm"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 text-center">Image Preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button with cleaner styling */}
          <div className="mt-6">
            <button 
              type="submit" 
              disabled={isSubmitting || !isDirty || !isValid}
              className={`
                w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 flex items-center justify-center
                ${isSubmitting || !isDirty || !isValid
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  <span>Add Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add this CSS animation to your global styles
const globalStyles = `
@keyframes gradient-x {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(-8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 15s ease infinite;
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out forwards;
}
`;

export default ItemForm;