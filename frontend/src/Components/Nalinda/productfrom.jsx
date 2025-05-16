import React, { useState } from "react";
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
  AlertTriangle,
  PenLine,
  BarChart4,
  Sparkles
} from "lucide-react";

const brands = ["Apple", "Samsung", "Sony", "Hp", "Lenovo", "Huawei", "Oppo", "OnePlus", "Xiaomi"];
const categories = [
  "Mobiles", "Laptops", "Watches", "Earphones", "Monitors",
  "PowerBanks", "Gaming", "Storages"
];

// Category and brand colors with lighter pastel tones
const categoryColors = {
  "Mobiles": "#FFD6D6",
  "Laptops": "#D5F5F2",
  "Watches": "#FFF1D6",
  "Earphones": "#E9D5F5",
  "Monitors": "#D5E8F5",
  "PowerBanks": "#FFF8D6",
  "Gaming": "#FFD6E0",
  "Storages": "#D5DEF5"
};

const brandColors = {
  "Apple": "#E9E9E9",
  "Samsung": "#D6E0FF",
  "Sony": "#D9D9D9",
  "Hp": "#D6EFFF",
  "Lenovo": "#FFD6D6",
  "Huawei": "#FFD6D6",
  "Oppo": "#D6FFE0",
  "OnePlus": "#FFD6D6",
  "Xiaomi": "#FFE9D6"
};

const ItemForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    salePrice: "",
    totalStock: "",
    description: "",
    brand: "",
    category: "",
    image: null
  });
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [formStatus, setFormStatus] = useState(null); // "success", "error", or null
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: null}));
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = e.dataTransfer?.files || e.target.files;
    if (!files || files.length === 0) return;
    
    if (files.length > 1) {
      alert("You can upload only one image");
      return;
    }
    
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    
    setPreview(URL.createObjectURL(file));
    setFormData(prev => ({...prev, image: file}));
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFormData(prev => ({...prev, image: null}));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title || formData.title.length < 3) {
      newErrors.title = "Product title must be at least 3 characters";
    }
    
    if (!formData.brand) {
      newErrors.brand = "Brand selection is required";
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    
    if (formData.salePrice === "" || formData.salePrice < 0) {
      newErrors.salePrice = "Sale price cannot be negative";
    } else if (formData.salePrice > formData.price) {
      newErrors.salePrice = "Sale price must be less than or equal to regular price";
    }
    
    if (formData.totalStock === "" || formData.totalStock < 0 || !Number.isInteger(Number(formData.totalStock))) {
      newErrors.totalStock = "Stock must be a non-negative whole number";
    }
    
    if (!formData.category) {
      newErrors.category = "Category selection is required";
    }
    
    if (!formData.description || formData.description.length < 20) {
      newErrors.description = "Description should be at least 20 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setFormStatus(null);
    
    // Simulate API call
    try {
      // In a real app, you would send the formData to your API
      console.log("Form Data:", formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setFormData({
        title: "",
        price: "",
        salePrice: "",
        totalStock: "",
        description: "",
        brand: "",
        category: "",
        image: null
      });
      
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setSuccessMessage("Product added successfully! 🎉");
      setFormStatus("success");
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
        setFormStatus(null);
      }, 5000);
    } catch (error) {
      console.error("Error adding product:", error);
      setFormStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDirty = () => {
    return formData.title || 
           formData.price || 
           formData.salePrice || 
           formData.totalStock || 
           formData.description || 
           formData.brand || 
           formData.category || 
           formData.image;
  };

  const isFormValid = () => {
    return formData.title && 
           formData.price && 
           formData.salePrice !== "" && 
           formData.totalStock !== "" && 
           formData.description && 
           formData.brand && 
           formData.category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 flex items-center justify-center p-6 sm:p-8 lg:p-10">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-3xl overflow-hidden border border-gray-100">
        {/* Header with modern design */}
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-r from-blue-400 to-violet-400 p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm shadow-inner">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Create New Product</h2>
                <p className="text-white/80 mt-1">Add your product details to the catalog</p>
              </div>
            </div>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm"></div>
          <div className="absolute top-5 right-32 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm"></div>
        </div>
        
        {/* Form with improved spacing and layout */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          {/* Success/Error Messages with improved styling */}
          {formStatus === "success" && (
            <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded-lg flex items-center animate-fade-in">
              <CheckCircle className="w-5 h-5 mr-3 text-emerald-500 flex-shrink-0" />
              <p>{successMessage}</p>
            </div>
          )}
          
          {formStatus === "error" && (
            <div className="bg-rose-50 border-l-4 border-rose-400 p-4 rounded-lg flex items-center animate-fade-in">
              <AlertTriangle className="w-5 h-5 mr-3 text-rose-500 flex-shrink-0" />
              <p>Failed to add product. Please try again.</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center">
                <Tag className="w-4 h-4 mr-2 text-blue-500" />
                Product Title <span className="text-rose-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input 
                  id="title" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter product title"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all hover:border-blue-200 bg-white"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <PenLine className="w-4 h-4 text-gray-300" />
                </div>
              </div>
              {errors.title && (
                <div className="flex items-center text-rose-500 text-xs mt-1 ml-1">
                  <Info className="w-3 h-3 mr-1 flex-shrink-0" /> {errors.title}
                </div>
              )}
            </div>

            {/* Brand Dropdown with simplified selection */}
            <div className="space-y-2">
              <label htmlFor="brand" className="text-sm font-medium text-gray-700 flex items-center">
                <BarChart4 className="w-4 h-4 mr-2 text-blue-500" />
                Brand <span className="text-rose-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select 
                  id="brand" 
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all hover:border-blue-200 bg-white appearance-none"
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                  {formData.brand && (
                    <div 
                      className="w-4 h-4 mr-2 rounded-full" 
                      style={{ backgroundColor: brandColors[formData.brand] || '#F3F4F6' }}
                    ></div>
                  )}
                  <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M7 7l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              {errors.brand && (
                <div className="flex items-center text-rose-500 text-xs mt-1 ml-1">
                  <Info className="w-3 h-3 mr-1 flex-shrink-0" /> {errors.brand}
                </div>
              )}
            </div>
          </div>

          {/* Price and Stock row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Regular Price */}
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium text-gray-700 flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                Regular Price <span className="text-rose-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input 
                  id="price" 
                  name="price"
                  type="number" 
                  min="0.01" 
                  step="0.01" 
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 transition-all hover:border-emerald-200 bg-white"
                />
              </div>
              {errors.price && (
                <div className="flex items-center text-rose-500 text-xs mt-1 ml-1">
                  <Info className="w-3 h-3 mr-1 flex-shrink-0" /> {errors.price}
                </div>
              )}
            </div>

            {/* Sale Price */}
            <div className="space-y-2">
              <label htmlFor="salePrice" className="text-sm font-medium text-gray-700 flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                Sale Price <span className="text-rose-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input 
                  id="salePrice" 
                  name="salePrice"
                  type="number" 
                  min="0" 
                  step="0.01" 
                  placeholder="0.00"
                  value={formData.salePrice}
                  onChange={handleChange} 
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 transition-all hover:border-emerald-200 bg-white"
                />
              </div>
              {errors.salePrice && (
                <div className="flex items-center text-rose-500 text-xs mt-1 ml-1">
                  <Info className="w-3 h-3 mr-1 flex-shrink-0" /> {errors.salePrice}
                </div>
              )}
            </div>

            {/* Total Stock */}
            <div className="space-y-2">
              <label htmlFor="totalStock" className="text-sm font-medium text-gray-700 flex items-center">
                <Box className="w-4 h-4 mr-2 text-violet-500" />
                Total Stock <span className="text-rose-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input 
                  id="totalStock" 
                  name="totalStock"
                  type="number" 
                  min="0" 
                  step="1" 
                  placeholder="0"
                  value={formData.totalStock}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 transition-all hover:border-violet-200 bg-white"
                />
              </div>
              {errors.totalStock && (
                <div className="flex items-center text-rose-500 text-xs mt-1 ml-1">
                  <Info className="w-3 h-3 mr-1 flex-shrink-0" /> {errors.totalStock}
                </div>
              )}
            </div>
          </div>

          {/* Category and Description row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Dropdown */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-gray-700 flex items-center">
                <Layers className="w-4 h-4 mr-2 text-blue-500" />
                Category <span className="text-rose-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select 
                  id="category" 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all hover:border-blue-200 bg-white appearance-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                  {formData.category && (
                    <div 
                      className="w-4 h-4 mr-2 rounded-full" 
                      style={{ backgroundColor: categoryColors[formData.category] || '#F3F4F6' }}
                    ></div>
                  )}
                  <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M7 7l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              {errors.category && (
                <div className="flex items-center text-rose-500 text-xs mt-1 ml-1">
                  <Info className="w-3 h-3 mr-1 flex-shrink-0" /> {errors.category}
                </div>
              )}
            </div>

            {/* Description with improved textarea */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center">
                <Info className="w-4 h-4 mr-2 text-blue-500" />
                Description <span className="text-rose-500 ml-1">*</span>
              </label>
              <textarea 
                id="description" 
                name="description"
                rows="4" 
                placeholder="Enter detailed product description..." 
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all hover:border-blue-200 bg-white resize-none"
              ></textarea>
              {errors.description && (
                <div className="flex items-center text-rose-500 text-xs mt-1 ml-1">
                  <Info className="w-3 h-3 mr-1 flex-shrink-0" /> {errors.description}
                </div>
              )}
            </div>
          </div>

          {/* Image Upload with modern design */}
          <div className="bg-gray-50 p-6 rounded-2xl">
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Image className="w-4 h-4 mr-2 text-blue-500" />
              Product Image
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Dropzone */}
              <div 
                className={`
                  border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 relative overflow-hidden
                  ${isDragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }
                `}
                style={{ minHeight: "200px" }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragActive(false);
                }}
                onDrop={onDrop}
                onClick={() => {
                  // Create a hidden file input element
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => onDrop(e);
                  input.click();
                }}
              >
                <div className="flex flex-col items-center justify-center h-full relative z-10">
                  <div className={`
                    p-3 rounded-full mb-4 transition-colors duration-200
                    ${isDragActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}
                  `}>
                    <Upload className="w-8 h-8" />
                  </div>
                  <p className={`
                    text-sm font-medium transition-colors duration-200
                    ${isDragActive ? 'text-blue-600' : 'text-gray-600'}
                  `}>
                    {isDragActive ? "Drop image here" : "Drag & drop an image here, or click to browse"}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">JPG, PNG or GIF (Max. 1 file)</p>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gray-100 rounded-full opacity-20"></div>
                <div className="absolute top-6 -left-8 w-16 h-16 bg-gray-100 rounded-full opacity-20"></div>
              </div>

              {/* Image Preview with cleaner animation */}
              <div className="flex justify-center">
                {preview ? (
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full max-w-xs transition-all duration-300 transform scale-100 opacity-100">
                    <div className="relative mb-3">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-48 object-contain rounded-lg bg-gray-50" 
                      />
                      <button 
                        type="button" 
                        onClick={removeImage}
                        className="absolute -top-3 -right-3 bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-colors duration-200 shadow-sm"
                        title="Remove Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 text-center font-medium">Image Preview</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full w-full text-center text-gray-400">
                    <p className="text-sm">No image selected</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button with modern styling */}
          <div className="mt-8">
            <button 
              type="submit" 
              disabled={isSubmitting || !isFormDirty() || !isFormValid()}
              className={`
                w-full py-3.5 px-6 rounded-full text-white font-medium transition-all duration-200 flex items-center justify-center shadow-lg
                ${isSubmitting || !isFormDirty() || !isFormValid()
                  ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 shadow-blue-100/50'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  <span>Create Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;