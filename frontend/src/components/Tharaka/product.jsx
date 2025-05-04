import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star } from 'lucide-react';
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomedIn, setZoomedIn] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewData] = useState({ name: '', rating: 5, comment: '' });
  const [deliveryLocation, setDeliveryLocation] = useState('LK');
  const [showroomOpen, setShowroomOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/items/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
    : 0;

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItem = { product, quantity: parseInt(quantity) };

    const index = existingCart.findIndex(item => item.product._id === product._id);
    if (index !== -1) {
      existingCart[index].quantity += cartItem.quantity;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    navigate('/cart');
  };

  const handleAddToCompare = () => {
    const compareList = JSON.parse(localStorage.getItem('compareList')) || [];
    const isSameCategory = compareList.length === 0 || compareList[0].category === product.category;

    if (!isSameCategory) {
      alert('You can only compare products in the same category.');
      return;
    }

    const exists = compareList.find(item => item._id === product._id);
    if (!exists) {
      compareList.push(product);
      localStorage.setItem('compareList', JSON.stringify(compareList));
      window.dispatchEvent(new Event('storage')); // So the bar updates immediately
    } else {
      alert('Product already in compare list.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/reviews/${id}`, reviewData);
      setReviewData({ name: '', rating: 5, comment: '' });
      const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to post review", err);
    }
  };

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

  const [showShare, setShowShare] = useState(false);
  const shareUrl = `http://localhost:3000/product/${id}`;
  const shareTitle = product ? product.title : '';

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (!product) return <div className="text-center py-20 text-red-500">Product not found</div>;

  return (
    <div className="bg-white min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div
            className="bg-white border rounded-xl overflow-hidden shadow-sm p-4 cursor-zoom-in"
            onClick={() => setZoomedIn(true)}
          >
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.title}
              className="w-full object-contain h-[400px]"
            />
          </div>
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <img
                key={i}
                src={`http://localhost:5000${product.image}`}
                alt="Thumbnail"
                className="w-20 h-20 border p-1 object-contain rounded-lg hover:ring-2 hover:ring-black"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h2>
          <p className="text-gray-500 mb-2">
            Brand: <span className="font-medium">{product.brand}</span>
          </p>
          {product.salePrice ? (
  <div className="mb-4">
    <div className="text-3xl font-bold text-red-600 mb-1">
      ${product.salePrice.toFixed(2)} <span className="text-sm text-gray-400">excl. VAT</span>
    </div>
    <div className="text-sm text-gray-500 line-through mb-1">${product.price.toFixed(2)}</div>
    <div className="flex items-center gap-2 mb-2">
      <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
        Save ${ (product.price - product.salePrice).toFixed(2) }
      </span>
      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
        -{ Math.round(((product.price - product.salePrice) / product.price) * 100) }%
      </span>
    </div>
    <div className="text-sm text-gray-700">
      or <span className="font-semibold text-blue-600">
        ${(product.salePrice / 36).toFixed(2)}
      </span> per month for 36 months
    </div>
  </div>
) : (
  <div className="mb-4">
    <div className="text-3xl font-bold text-gray-900 mb-1">
      ${product.price.toFixed(2)} <span className="text-sm text-gray-400">excl. VAT</span>
    </div>
  </div>
)}


          <div className="flex items-center gap-2 text-yellow-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                fill={i < Math.round(averageRating) ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-5 h-5"
              />
            ))}
            <span className="text-gray-600 text-sm">
              ({averageRating.toFixed(1)}{reviews.length} reviews)
            </span>
          </div>

          <div className="flex flex-wrap">{getDescriptionAsBadges(product.description)}</div>
        </div>

        {/* Purchase/Action Panel */}
        <div className="border rounded-xl shadow-sm p-6 h-fit bg-gray-50">
          {/* Delivery Location & Expected Delivery */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="delivery-location">
              Deliver to:
            </label>
            <select
              id="delivery-location"
              className="border rounded-md px-3 py-2 w-full mb-2"
              value={deliveryLocation}
              onChange={e => setDeliveryLocation(e.target.value)}
            >
              <option value="LK">Sri Lanka</option>
              <option value="IN">India</option>
              <option value="US">United States</option>
            </select>
            <div className="text-green-600 text-sm font-medium">
              Expected Thursday, 15-May-2025
            </div>
            <div className="text-xs text-gray-400 mt-1">Not available for collection</div>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="flex items-center gap-2 mb-4">
            <select
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border rounded-md px-3 py-2 w-24"
            >
              {[...Array(5)].map((_, i) => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <button
              onClick={handleAddToCart}
              className="bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 w-full"
            >
              🛒 Add to Cart
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <button
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md border text-sm w-full"
                onClick={() => setShowShare((v) => !v)}
                type="button"
              >
                🔗 Share
              </button>
              {showShare && (
                <div className="absolute z-10 left-0 mt-2 bg-white border rounded shadow-md p-2 flex flex-col gap-2">
                  <WhatsappShareButton url={shareUrl} title={shareTitle}>
                    <div className="flex items-center gap-2">
                      <WhatsappIcon size={28} round /> WhatsApp
                    </div>
                  </WhatsappShareButton>
                  <FacebookShareButton url={shareUrl} quote={shareTitle}>
                    <div className="flex items-center gap-2">
                      <FacebookIcon size={28} round /> Facebook
                    </div>
                  </FacebookShareButton>
                  <TwitterShareButton url={shareUrl} title={shareTitle}>
                    <div className="flex items-center gap-2">
                      <TwitterIcon size={28} round /> Twitter
                    </div>
                  </TwitterShareButton>
                  <EmailShareButton url={shareUrl} subject={shareTitle}>
                    <div className="flex items-center gap-2">
                      <EmailIcon size={28} round /> Email
                    </div>
                  </EmailShareButton>
                </div>
              )}
            </div>
            <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md border text-sm">
              ❤ Favorite
            </button>
            <button
              onClick={handleAddToCompare}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              📊 Compare
            </button>
          </div>

          {/* Service Icons */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 my-4">
            <div className="flex items-center gap-2">
              <span role="img" aria-label="secure">🔒</span> Secure Shopping
            </div>
            <div className="flex items-center gap-2">
              <span role="img" aria-label="returns">🔄</span> Convenient Returns
            </div>
            <div className="flex items-center gap-2">
              <span role="img" aria-label="warranty">✅</span> Genuine & Warrantied
            </div>
            <div className="flex items-center gap-2">
              <span role="img" aria-label="fast">⚡</span> Fast Delivery
            </div>
          </div>

          {/* Showroom Availability */}
          <div className="mb-4">
            <button
              className="text-blue-600 underline text-sm"
              onClick={() => setShowroomOpen(v => !v)}
              type="button"
            >
              {showroomOpen ? 'Hide' : 'View'} Showrooms Availability
            </button>
            {showroomOpen && (
              <div className="mt-2 bg-blue-50 border border-blue-200 rounded p-2 text-xs text-gray-700">
                This product is not available in showrooms.
              </div>
            )}
          </div>

          {/* SKU & Warranty */}
          <div className="text-sm text-gray-500">SKU: 638286</div>
          <div className="text-sm text-gray-500">Warranty: 24 months</div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomedIn && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center">
          <img
            src={`http://localhost:5000${product.image}`}
            alt={product.title}
            className="max-h-[90%] max-w-[90%] object-contain"
          />
          <button
            onClick={() => setZoomedIn(false)}
            className="absolute top-5 right-5 text-white text-3xl"
          >
            &times;
          </button>
        </div>
      )}

      {/* Customer Reviews */}
      <div className="max-w-4xl mx-auto mt-12 border-t pt-8">
        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
        <form onSubmit={handleReviewSubmit} className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={reviewData.name}
            onChange={(e) => setReviewData({ ...reviewData, name: e.target.value })}
            className="border rounded-md px-3 py-2 w-full"
            required
          />
          <select
            value={reviewData.rating}
            onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
            className="border rounded-md px-3 py-2 w-full"
          >
            {[5, 4, 3, 2, 1].map((val) => (
              <option key={val} value={val}>{val} Star{val > 1 && 's'}</option>
            ))}
          </select>
          <textarea
            placeholder="Your review"
            value={reviewData.comment}
            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
            className="border rounded-md px-3 py-2 w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Submit Review
          </button>
        </form>

        <div className="space-y-4">
          {reviews.map((r, i) => (
            <div key={i} className="border rounded-md p-4 shadow-sm">
              <p className="font-medium text-gray-800">{r.name}</p>
              <div className="flex gap-1 text-yellow-400 mb-1">
                {[...Array(r.rating)].map((_, j) => (
                  <Star key={`${i}-${j}`} fill="currentColor" strokeWidth={0} className="w-4 h-4" />
                ))}
              </div>
              <p className="text-gray-600">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
