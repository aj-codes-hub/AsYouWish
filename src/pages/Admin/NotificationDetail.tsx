// src/pages/Admin/NotificationDetail.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaBell, FaCheckCircle, FaClock, FaUser, FaShoppingBag } from 'react-icons/fa';

interface NotificationType {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  data: any;
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

  // ✅ Get icon based on type
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

  // ✅ Get type color
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B76E79] border-t-transparent"></div>
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
          <div className="p-6 space-y-4">
            {/* Message */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
              <p className="text-gray-800 leading-relaxed">{notification.message}</p>
            </div>

            {/* Details (if any) */}
            {notification.data && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Details</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  {notification.data.orderId && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order ID</span>
                      <span className="font-medium text-gray-800">#{notification.data.orderId}</span>
                    </div>
                  )}
                  {notification.data.customerName && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Customer</span>
                      <span className="font-medium text-gray-800">{notification.data.customerName}</span>
                    </div>
                  )}
                  {notification.data.total && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total</span>
                      <span className="font-medium text-[#B76E79]">Rs. {notification.data.total}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timestamp */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Received: {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-[#B76E79] text-white py-2 rounded-xl font-medium hover:bg-[#B76E79]/90 transition cursor-pointer"
            >
              Back
            </button>
            {notification.data?.orderId && (
              <button
                onClick={() => navigate(`/admin/orders/${notification.data.orderId}`)}
                className="flex-1 border border-[#B76E79] text-[#B76E79] py-2 rounded-xl font-medium hover:bg-[#B76E79]/10 transition cursor-pointer"
              >
                View Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;