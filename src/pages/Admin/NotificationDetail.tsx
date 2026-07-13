// src/pages/Admin/NotificationDetail.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaBell, 
  FaCheckCircle, 
  FaClock, 
  FaShoppingBag,
  FaUser,
  FaBox,
} from 'react-icons/fa';

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
    paymentMethod?: string;   // ✅ ADDED
    orderStatus?: string;     // ✅ ADDED
  };
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const NotificationDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/notifications/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Notification not found');
        }

        const data = await response.json();
        setNotification(data);

        // ✅ Mark as read when viewed
        if (!data.read) {
          await fetch(`${API_URL}/admin/notifications/${id}/read`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        }

      } catch (err: any) {
        setError(err.message || 'Failed to load notification');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNotification();
    }
  }, [id]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <FaShoppingBag className="text-2xl text-[#B76E79]" />;
      case 'inventory':
        return <FaBell className="text-2xl text-yellow-500" />;
      case 'alert':
        return <FaBell className="text-2xl text-red-500" />;
      default:
        return <FaBell className="text-2xl text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-[#B76E79]/10 text-[#B76E79] border-[#B76E79]/20';
      case 'inventory':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'alert':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-blue-50 text-blue-600 border-blue-200';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cod':
        return 'Cash on Delivery';
      case 'credit_card':
        return 'Credit Card';
      case 'jazzcash':
        return 'JazzCash / EasyPaisa';
      default:
        return method || 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B76E79] border-t-transparent" />
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error || 'Notification not found'}</p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="mt-4 bg-[#B76E79] text-white px-6 py-2 rounded-xl hover:bg-[#B76E79]/90 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[65px]">
      <div className="container mx-auto px-4 max-w-3xl py-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#B76E79] transition mb-6 cursor-pointer"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        {/* Notification Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          
          {/* Header */}
          <div className={`p-6 border-b ${getTypeColor(notification.type)} flex items-center justify-between`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                {getTypeIcon(notification.type)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{notification.title}</h1>
                <span className={`text-xs px-3 py-1 rounded-full border ${getTypeColor(notification.type)} inline-block mt-1`}>
                  {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {notification.read ? (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <FaCheckCircle className="text-green-500" />
                  Read
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-yellow-600">
                  <FaClock className="text-yellow-500" />
                  Unread
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            
            {/* Message */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
              <p className="text-gray-800 leading-relaxed">{notification.message}</p>
            </div>

            {/* ✅ Full Order Details */}
            {notification.data && notification.data.orderId && (
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaShoppingBag className="text-[#B76E79]" />
                  Order Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Order Info */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    <h4 className="font-medium text-gray-700 mb-2">Order Information</h4>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order ID</span>
                      <span className="font-medium text-gray-800">#{notification.data.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total</span>
                      <span className="font-bold text-[#B76E79]">Rs. {notification.data.total || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Items</span>
                      <span className="font-medium text-gray-800">{notification.data.items || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment</span>
                     <span className="font-medium text-gray-800">{getPaymentMethodLabel(notification.data?.paymentMethod || '')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        notification.data.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                        notification.data.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        notification.data.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {notification.data.orderStatus || 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaUser className="text-[#B76E79]" />
                      Customer Information
                    </h4>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name</span>
                      <span className="font-medium text-gray-800">{notification.data.customerName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email</span>
                      <span className="font-medium text-gray-800">{notification.data.customerEmail || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone</span>
                      <span className="font-medium text-gray-800">{notification.data.customerPhone || 'N/A'}</span>
                    </div>
                    {notification.data.shippingAddress && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Address</span>
                        <span className="font-medium text-gray-800 text-right">
                          {notification.data.shippingAddress.address}<br />
                          {notification.data.shippingAddress.city}, {notification.data.shippingAddress.zipCode}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Products List */}
                {notification.data.products && notification.data.products.length > 0 && (
                  <div className="mt-4 bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <FaBox className="text-[#B76E79]" />
                      Products ({notification.data.products.length})
                    </h4>
                    <div className="space-y-2">
                      {notification.data.products.map((product, idx) => (
                        <div key={idx} className="flex items-center justify-between border-b border-gray-200 pb-2 last:border-0">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.mainImage || '/images/placeholder.jpg'}
                              alt={product.title}
                              className="w-10 h-10 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                              }}
                            />
                            <span className="text-sm">{product.title}</span>
                          </div>
                          <span className="text-sm font-medium">
                            Rs. {product.price} x {product.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Timestamp */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Received: {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* ✅ Actions — Only Back and Navigate to Dashboard */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-[#B76E79] text-white py-2.5 rounded-xl font-medium hover:bg-[#B76E79]/90 transition cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex-1 border border-[#B76E79] text-[#B76E79] py-2.5 rounded-xl font-medium hover:bg-[#B76E79]/10 transition cursor-pointer"
            >
              Navigate to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;