import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/items/${id}`);
        setItem(response.data);
      } catch (err) {
        setError('Error fetching item details');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const goBack = () => navigate(-1);

  // Fixed delete function implementation
  const deleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setIsDeleting(true);
      try {
        await axios.delete(`http://localhost:5000/api/items/${itemId}`);
        navigate('/admin/products', { state: { message: 'Item deleted successfully' } });
      } catch (err) {
        setError('Error deleting item');
        setIsDeleting(false);
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      <p className="ml-3 text-gray-700 font-semibold">Loading item details...</p>
    </div>
  );
  
  if (error) return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50">
      <button onClick={goBack} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg mb-6 transition duration-300 ease-in-out flex items-center">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Go Back
      </button>
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <button 
        onClick={goBack} 
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg mb-6 transition duration-300 ease-in-out flex items-center shadow-md"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Products
      </button>
      
      {item && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
          <div className="md:flex">
            <div className="md:w-1/3 p-6 bg-gray-50 flex justify-center items-center">
              <img
                src={item.image ? `http://localhost:5000${item.image}` : 'https://via.placeholder.com/300'}
                alt={item.title}
                className="w-full h-64 object-contain rounded-lg shadow-sm transition-transform duration-300 hover:scale-105"
              />
            </div>
            
            <div className="md:w-2/3 p-6">
              <h2 className="text-3xl font-bold mb-3 text-gray-800">{item.title}</h2>
              
              <div className="flex items-center mb-4">
                <span className="text-2xl font-semibold text-teal-600">${item.price.toFixed(2)}</span>
                {item.totalStock < 10 && (
                  <span className="ml-4 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                    Low Stock: {item.totalStock} left
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">{item.description}</p>
              
              <div className="border-t border-gray-100 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">Category:</span>
                    <span className="px-3 py-1 bg-teal-50 rounded-full text-sm font-medium text-teal-800">{item.category}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">Brand:</span>
                    <span className="font-medium">{item.brand}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">Stock:</span>
                    <span className={`font-medium ${item.totalStock > 20 ? 'text-green-600' : item.totalStock > 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {item.totalStock} units
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <button 
                  onClick={() => navigate(`/admin/editproduct/${item._id}`)} 
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-lg shadow transition duration-300 ease-in-out flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit Item
                </button>

                <button 
                  onClick={() => deleteItem(item._id)} 
                  disabled={isDeleting}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-6 rounded-lg shadow transition duration-300 ease-in-out flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Delete Item
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;