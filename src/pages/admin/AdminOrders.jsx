import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChevronDown, ChevronUp, Clock, CheckCircle, Package, Truck, User, Mail, Phone, MapPin } from 'lucide-react';
import { API_URL } from '../../config';

const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) throw new Error('Failed to update status');
      
      // Update locally
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'Processing': 'bg-purple-100 text-purple-800',
      'Shipped': 'bg-indigo-100 text-indigo-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-md">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Management</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders found.</div>
        ) : (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Items</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className={`border-b hover:bg-gray-50 cursor-pointer ${expandedId === order.id ? 'bg-blue-50' : ''}`} onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                    <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.mobile}</div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {order.OrderItems?.length || 0} items
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-3 py-1 border-none focus:ring-2 cursor-pointer ${getStatusColor(order.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600">
                        {expandedId === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </td>
                  </tr>
                  
                  {expandedId === order.id && (
                    <tr className="bg-gray-50 border-b">
                      <td colSpan="6" className="p-0">
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Customer Details */}
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Customer Details</h3>
                            <div className="space-y-3">
                              <div className="flex items-start">
                                <User className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                                <span className="text-gray-900">{order.customerName}</span>
                              </div>
                              <div className="flex items-start">
                                <Phone className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                                <span className="text-gray-900">{order.mobile}</span>
                              </div>
                              <div className="flex items-start">
                                <Mail className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                                <span className="text-gray-900">{order.email || 'N/A'}</span>
                              </div>
                              <div className="flex items-start">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                                <span className="text-gray-900 whitespace-pre-line">{order.address}</span>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Products ({order.OrderItems?.length})</h3>
                            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                              {order.OrderItems?.map((item) => (
                                <div key={item.id} className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                                  <img 
                                    src={item.Product?.images?.[0] || 'https://via.placeholder.com/50'} 
                                    alt={item.Product?.name} 
                                    className="w-12 h-12 object-cover rounded-md mr-4"
                                  />
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900 text-sm">{item.Product?.name || 'Unknown Product'}</div>
                                    <div className="text-xs text-gray-500 mt-1">Qty: <span className="font-semibold text-gray-700">{item.quantity}</span></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Also inject React to avoid import errors
import React from 'react';
export default AdminOrders;
