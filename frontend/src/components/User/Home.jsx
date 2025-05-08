import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

// Brand images (Ensure these paths are correct)
import appleImg from '../../assets/apple.png';
import samsungImg from '../../assets/samsung.png';
import sonyImg from '../../assets/sony.png';
import hpImg from '../../assets/hp.png';
import lenovoImg from '../../assets/lenovo.png';
import huaweiImg from '../../assets/huawei.png';
import oppoImg from '../../assets/oppo.png';
import oneplusImg from '../../assets/one-plus.png';
import xiaomiImg from '../../assets/xiaomi.png';

const brandImages = {
  apple: appleImg,
  samsung: samsungImg,
  sony: sonyImg,
  hp: hpImg,
  lenovo: lenovoImg,
  huawei: huaweiImg,
  oppo: oppoImg,
  oneplus: oneplusImg,
  xiaomi: xiaomiImg,
};

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const selectedBrand = query.get("brand");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/items');
        const filtered = selectedBrand
          ? res.data.filter((item) => item.brand.toLowerCase() === selectedBrand.toLowerCase())
          : res.data;
        setItems(filtered);
        console.log('Home: Fetched items:', filtered);
      } catch (err) {
        console.error('Home: Failed to fetch items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedBrand]);

  const brandImage = selectedBrand ? brandImages[selectedBrand.toLowerCase()] : null;

  const getDescriptionAsBadges = (description) => {
    return description
      ? description
          .split('\n')
          .filter((line) => line.trim() !== '')
          .map((line, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full mr-2 mt-2 inline-block"
            >
              {line}
            </span>
          ))
      : [];
  };

  const handleProductClick = (item) => {
    console.log('Home: Product clicked - ID:', item._id);
    navigate(`/product/${item._id}`);
    console.log('Home: Navigation triggered to /product/' + item._id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10 flex justify-center items-center gap-4">
        {brandImage && (
          <img
            src={brandImage}
            alt={selectedBrand}
            className="w-10 h-10 object-contain"
          />
        )}
        {selectedBrand ? `${selectedBrand} Products` : '🛍️ All Products'}
      </h1>

      {loading ? (
        <div className="text-center text-lg text-gray-600">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-red-500 text-lg">No items found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div
              key={item._id}
              onClick={() => handleProductClick(item)}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform hover:scale-105 duration-300 cursor-pointer group overflow-hidden"
            >
              {/* Image */}
              <div className="w-full h-48 bg-white overflow-hidden">
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.title}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                  {item.title}
                </h2>
                <p className="text-xs text-gray-500 mb-2">Brand: {item.brand}</p>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-base font-bold ${item.salePrice ? 'text-gray-400 line-through' : 'text-blue-700'}`}>
                    ${item.price.toLocaleString()}
                  </span>
                  {item.salePrice && (
                    <span className="text-lg font-extrabold text-red-600">
                      ${item.salePrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap">
                  {getDescriptionAsBadges(item.description)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-5">Recommendations</h2>
        <div className="flex flex-wrap justify-center gap-4">
          
        </div>
      </div>
    </div>
  );
};

export default Home;