import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const categories = [
    "Mobiles", "Laptops", "Watches", "Earphones", "Monitors",
    "PowerBanks", "Gaming", "Storages"
  ];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError("Error fetching product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Handle form submission (Update product)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, product);
      alert("Product updated successfully!");
      navigate("/admin/products"); // Redirect to product list
    } catch (error) {
      alert("Error updating product!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Price ($)</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows="3"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Image URL</label>
            <input
              type="text"
              name="image"
              value={product.image}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Update Product
            </button>
            <button onClick={() => navigate("/admin/products")} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditProduct;
