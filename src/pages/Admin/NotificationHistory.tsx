// src/pages/Admin/NotificationHistory.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaChevronDown, FaChevronUp, FaUser, FaShoppingBag, FaClock, FaRupeeSign } from 'react-icons/fa';

interface ProductType {
  title: string;
  price: number;
  quantity: number;
  mainImage: string;
}

interface NotificationType {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  data: {
    orderId?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    shippingAddress?: {
      address: string;
      city: string;
      zipCode: string;
    };
    total?: number;
    items?: number;
    products?: ProductType[];
    paymentMethod?: string;
    orderStatus?: string;
  };
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const NotificationHistory: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('24hours');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/notifications?filter=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/admin/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B76E79] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[65px]">
      <div className="container mx-auto px-4 max-w-4xl py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Notification History</h1>
            <p className="text-gray-500 text-sm">{notifications.length} notifications</p>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            {[
              { value: '24hours', label: 'Last 24 Hours' },
              { value: '7days', label: 'Last 7 Days' },
              { value: '30days', label: 'Last 30 Days' },
              { value: '3months', label: 'Last 3 Months' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-1.5 rounded-full text-sm transition cursor-pointer ${
                  filter === option.value
                    ? 'bg-[#B76E79] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400">
              <p>No notifications found</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden transition ${
                  !notification.read ? 'border-l-4 border-l-[#B76E79]' : 'border-gray-100'
                }`}
              >
                {/* ✅ Notification Header (Always Visible) */}
                <div
                  onClick={() => handleToggleExpand(notification._id)}
                  className="p-4 cursor-pointer hover:bg-gray-50 transition flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-medium text-gray-800">
                        {notification.data?.customerName || 'Customer'}
                      </span>
                      <span className="text-xs text-gray-400">
                        Order #{notification.data?.orderId || 'N/A'}
                      </span>
                      <span className="text-xs bg-[#B76E79]/10 text-[#B76E79] px-2 py-0.5 rounded-full">
                        {notification.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaClock className="text-[10px]" />
                        {formatDate(notification.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaRupeeSign className="text-[10px]" />
                        {notification.data?.total || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaShoppingBag className="text-[10px]" />
                        {notification.data?.items || 0} items
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {!notification.read && (
                      <span className="w-2 h-2 bg-[#B76E79] rounded-full animate-pulse" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification._id);
                      }}
                      className="text-red-400 hover:text-red-600 transition p-1 cursor-pointer"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                    {expandedId === notification._id ? (
                      <FaChevronUp className="text-gray-400" />
                    ) : (
                      <FaChevronDown className="text-gray-400" />
                    )}
                  </div>
                </div>

                {/* ✅ Expanded Details (Toggle) */}
                {expandedId === notification._id && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      {/* Customer Info */}
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <FaUser className="text-[#B76E79]" />
                          Customer Details
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-500">Name:</span> {notification.data?.customerName || 'N/A'}</p>
                          <p><span className="text-gray-500">Email:</span> {notification.data?.customerEmail || 'N/A'}</p>
                          <p><span className="text-gray-500">Phone:</span> {notification.data?.customerPhone || 'N/A'}</p>
                          <p><span className="text-gray-500">Address:</span> {notification.data?.shippingAddress?.address || 'N/A'}</p>
                          <p><span className="text-gray-500">City:</span> {notification.data?.shippingAddress?.city || 'N/A'}</p>
                          <p><span className="text-gray-500">ZIP:</span> {notification.data?.shippingAddress?.zipCode || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Order Info */}
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <FaShoppingBag className="text-[#B76E79]" />
                          Order Details
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-500">Order ID:</span> #{notification.data?.orderId || 'N/A'}</p>
                          <p><span className="text-gray-500">Total:</span> <span className="font-bold text-[#B76E79]">Rs. {notification.data?.total || 0}</span></p>
                          <p><span className="text-gray-500">Items:</span> {notification.data?.items || 0}</p>
                          <p><span className="text-gray-500">Payment:</span> {notification.data?.paymentMethod || 'N/A'}</p>
                          <p><span className="text-gray-500">Status:</span> {notification.data?.orderStatus || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Products List */}
                      {notification.data?.products && notification.data.products.length > 0 && (
                        <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Products</h4>
                          <div className="space-y-2">
                            {notification.data.products.map((product, idx) => (
                              <div key={idx} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={product.mainImage || '/images/placeholder.jpg'}
                                    alt={product.title}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                  <span className="text-sm">{product.title}</span>
                                </div>
                                <span className="text-sm">Rs. {product.price} x {product.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationHistory;