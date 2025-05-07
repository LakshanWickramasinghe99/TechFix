import { useEffect, useState } from 'react';
import { UserX, AlertCircle, Check } from 'lucide-react';

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', { 
        credentials: 'include'
      });
      const data = await res.json();
      setUsers(data.users);
    } catch (error) {
      showNotification('Failed to fetch users', 'error');
    }
  };

  const deleteUser = async (id, name) => {
    try {
      await fetch(`http://localhost:5000/api/admin/users/${id}`, { 
        method: 'DELETE',
        credentials: 'include'
      });
      showNotification(`User ${name} deleted successfully! 🗑️ `, 'success');
      fetchUsers();
    } catch (error) {
      showNotification('Failed to delete user', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-blue-50 min-h-screen p-6">
      {notification.show && (
        <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex items-center p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <Check className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          <span className="text-base font-medium">{notification.message}</span>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">User Management Dashboard</h1>
        
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-3 text-left">Photo</th>
                <th className="border border-gray-200 p-3 text-left">Name</th>
                <th className="border border-gray-200 p-3 text-left">Email</th>
                <th className="border border-gray-200 p-3 text-left">Nickname</th>
                <th className="border border-gray-200 p-3 text-left">Gender</th>
                <th className="border border-gray-200 p-3 text-left">Birthyear</th>
                <th className="border border-gray-200 p-3 text-left">Country</th>
                <th className="border border-gray-200 p-3 text-left">Verified</th>
                <th className="border border-gray-200 p-3 text-left">Addresses</th>
                <th className="border border-gray-200 p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-3">
                    {user.photo
                      ? <img src={`http://localhost:5000/uploads/${user.photo}`} alt="User" className="w-12 h-12 rounded-full object-cover" />
                      : <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">N/A</div>}
                  </td>
                  <td className="border border-gray-200 p-3">
                    {user.name}
                  </td>
                  <td className="border border-gray-200 p-3">
                    {user.email}
                  </td>
                  <td className="border border-gray-200 p-3">{user.nickname || '-'}</td>
                  <td className="border border-gray-200 p-3">{user.gender || '-'}</td>
                  <td className="border border-gray-200 p-3">{user.birthyear || '-'}</td>
                  <td className="border border-gray-200 p-3">{user.country || '-'}</td>
                  <td className="border border-gray-200 p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.isAccountVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.isAccountVerified ? 'Yes ✓' : 'No ✗'}
                    </span>
                  </td>
                  <td className="border border-gray-200 p-3 text-left">
                    {user.addresses && user.addresses.length > 0 ? (
                      <div className="max-h-32 overflow-y-auto">
                        {user.addresses.map((addr, i) => (
                          <div key={i} className="mb-2 text-xs">
                            <span className="font-semibold">{addr.type}:</span> {addr.streetNumber} {addr.streetName}, {addr.city}, {addr.province || ''}, {addr.postalCode || ''}, {addr.country}
                          </div>
                        ))}
                      </div>
                    ) : <span className="text-gray-500">No address</span>}
                  </td>
                  <td className="border border-gray-200 p-3 text-center">
                    <button 
                      onClick={() => deleteUser(user._id, user.name)} 
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md flex items-center justify-center mx-auto"
                    >
                      <UserX size={16} className="mr-1" />
                      <span className="text-xs">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUserList;