import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const categories = [
  "Mobiles", "Laptops", "Watches", "Earphones", "Monitors",
  "PowerBanks", "Gaming", "Storages"
];

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/items/${id}`);
        setItem(response.data);
      } catch (err) {
        setError("Error fetching product details");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/items/${id}`, item);
      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      alert("Error updating product!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Edit Product</h2>
      
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={item.title}
              onChange={handleChange}
              className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 rounded-lg shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Price ($)</label>
            <input
              type="number"
              name="price"
              value={item.price}
              onChange={handleChange}
              className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 rounded-lg shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Category</label>
            <select
              name="category"
              value={item.category}
              onChange={handleChange}
              className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 rounded-lg shadow-sm"
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

          <div>
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={item.description}
              onChange={handleChange}
              className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 rounded-lg shadow-sm"
              rows="4"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Image URL</label>
            <input
              type="text"
              name="image"
              value={item.image}
              onChange={handleChange}
              className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 rounded-lg shadow-sm"
              required
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
            >
              Update Product
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="bg-gray-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditItem;
