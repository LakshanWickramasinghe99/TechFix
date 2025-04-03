import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ItemDetails = () => {
  const { id } = useParams();  // Get the item ID from the URL parameter
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const goBack = () => navigate(-1);  // Navigate back to the previous page

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-3 text-gray-700 font-semibold">Loading item details...</p>
    </div>
  );
  
  if (error) return (
    <div className="max-w-4xl mx-auto p-8">
      <button onClick={goBack} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mb-6 transition duration-300 ease-in-out flex items-center">
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
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mb-6 transition duration-300 ease-in-out flex items-center shadow-md"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Go Back
      </button>
      
      {item && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div className="md:flex">
            <div className="md:w-1/3 p-4 bg-gray-50 flex justify-center items-center">
              <img
                src={item.image ? `http://localhost:5000${item.image}` : 'https://via.placeholder.com/300'}
                alt={item.title}
                className="w-full h-64 object-contain rounded-lg shadow-sm transition-transform duration-300 hover:scale-105"
              />
            </div>
            
            <div className="md:w-2/3 p-6">
              <h2 className="text-3xl font-bold mb-3 text-gray-800">{item.title}</h2>
              
              <div className="flex items-center mb-4">
                <span className="text-2xl font-semibold text-blue-600">${item.price.toFixed(2)}</span>
                {item.totalStock < 10 && (
                  <span className="ml-4 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                    Low Stock: {item.totalStock} left
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">{item.description}</p>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">Category:</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-800">{item.category}</span>
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
              
              <div className="mt-6">
              
              <button 
                        onClick={() => navigate(`/admin/editproduct/${item._id}`)} 
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
                      >
                        EDIT
                      </button>

                      <button 
                        onClick={() => deleteItem(item._id)} 
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out ml-4"
                      >
                        DELETE
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