import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // Use useNavigate instead of useHistory
import { FaSave, FaImage } from "react-icons/fa";

const EditProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const { id } = useParams(); // Product ID from URL
  const navigate = useNavigate(); // useNavigate hook

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Fetch product details by ID
  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/product/${id}`);
      setProduct(response.data);
      setImagePreview(response.data.image ? `http://localhost:5000/uploads/${response.data.image}` : null);
    } catch (err) {
      setError("Error fetching product.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProduct((prevProduct) => ({
      ...prevProduct,
      image: file,
    }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    formData.append("category", product.category);
    if (product.image) {
      formData.append("image", product.image);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/product/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSuccess("Product updated successfully!");
      setTimeout(() => {
        navigate("/products"); // Use navigate to redirect after success
      }, 2000);
    } catch (err) {
      setError("Error updating product.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6 flex flex-col items-center relative">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-wide">
        Edit Product
      </h1>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form
        className="bg-white shadow-xl rounded-2xl p-6 flex flex-col gap-6 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-gray-700">Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Stock</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Product Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-3 mt-2 border rounded-md"
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Product Preview"
                className="w-40 h-40 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 mt-6 flex items-center gap-2"
        >
          <FaSave /> Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
