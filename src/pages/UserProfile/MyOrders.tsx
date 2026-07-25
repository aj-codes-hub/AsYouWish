// src/pages/MyOrders/MyOrders.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShoppingBag, 
  FaCheckCircle, 
  FaTruck, 
  FaSpinner, 
  FaClock,
  FaEye,
  FaRupeeSign,
  FaCalendarAlt,
  FaBoxOpen,
} from 'react-icons/fa';
import { useAuth } from '../../Auth/authContext';
import { toast } from 'react-toastify';

interface OrderProduct {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  mainImage: string;
}

interface OrderType {
  _id: string;
  orderId: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
  products: OrderProduct[];
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
  paymentMethod: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'delivered'>('all');
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [isLoggedIn, navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter orders based on tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return order.status !== 'delivered' && order.status !== 'cancelled';
    if (activeTab === 'delivered') return order.status === 'delivered';
    return true;
  });

  // ✅ Get status badge
  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; icon: React.ReactNode; label: string } } = {
      delivered: { 
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: <FaCheckCircle className="text-green-500 mr-1.5" size={14} />,
        label: 'Delivered ✅'
      },
      shipped: { 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: <FaTruck className="text-blue-500 mr-1.5" size={14} />,
        label: 'Shipped 🚚'
      },
      processing: { 
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: <FaSpinner className="text-yellow-500 mr-1.5 animate-spin" size={14} />,
        label: 'Processing 🔄'
      },
      pending: { 
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: <FaClock className="text-gray-500 mr-1.5" size={14} />,
        label: 'Pending ⏳'
      },
      cancelled: { 
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: <FaClock className="text-red-500 mr-1.5" size={14} />,
        label: 'Cancelled ❌'
      },
    };

    const statusInfo = statusMap[status] || statusMap.pending;

    return (
      <span className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
        {statusInfo.icon}
        {statusInfo.label}
      </span>
    );
  };

  // ✅ Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // ✅ Get delivery status message
  const getDeliveryMessage = (order: OrderType) => {
    if (order.status === 'delivered') {
      const deliveredDate = new Date(order.createdAt);
      deliveredDate.setDate(deliveredDate.getDate() + 5); // Assuming 5 days delivery
      return `Delivered on ${formatDate(deliveredDate.toISOString())}`;
    }
    if (order.status === 'shipped') {
      return 'Your order is on the way! 🚚';
    }
    if (order.status === 'processing') {
      return 'Your order is being processed 🔄';
    }
    if (order.status === 'pending') {
      return 'Order confirmed, waiting for processing ⏳';
    }
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[65px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B76E79] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[65px]">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-[#B76E79] text-white px-6 py-2 rounded-xl hover:bg-[#B76E79]/90 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-[65px] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <FaBoxOpen className="text-7xl text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
          <p className="text-gray-400 mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here!
          </p>
          <Link 
            to="/collection" 
            className="bg-[#B76E79] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#B76E79]/90 transition inline-block"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-[65px] py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaShoppingBag className="text-[#B76E79]" />
            My Orders
          </h1>
          <p className="text-gray-500 mt-1">{orders.length} orders placed</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-2">
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'active', label: 'Active Orders' },
            { key: 'delivered', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'all' | 'active' | 'delivered')}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-[#B76E79] text-white shadow-lg shadow-[#B76E79]/30'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
              {tab.key === 'all' && (
                <span className="ml-2 bg-white/20 text-white rounded-full px-2 py-0.5 text-xs">
                  {orders.length}
                </span>
              )}
              {tab.key === 'active' && (
                <span className="ml-2 bg-white/20 text-white rounded-full px-2 py-0.5 text-xs">
                  {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
                </span>
              )}
              {tab.key === 'delivered' && (
                <span className="ml-2 bg-white/20 text-white rounded-full px-2 py-0.5 text-xs">
                  {orders.filter(o => o.status === 'delivered').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-400">No orders in this category</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Order Header */}
                <div className="bg-gray-50/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-800 text-sm">
                      Order #{order.orderId || order._id.slice(-6)}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <FaCalendarAlt size={12} />
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#B76E79] flex items-center gap-1">
                      <FaRupeeSign size={12} />
                      {order.total}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  {/* Products */}
                  <div className="space-y-3 mb-4">
                    {order.products?.slice(0, 2).map((product, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img 
                          src={product.mainImage} 
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{product.title}</p>
                          <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-[#B76E79]">
                          Rs. {product.price * product.quantity}
                        </p>
                      </div>
                    ))}
                    {order.products && order.products.length > 2 && (
                      <p className="text-xs text-gray-400 ml-20">
                        +{order.products.length - 2} more items
                      </p>
                    )}
                  </div>

                  {/* Delivery Message */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {getStatusBadge(order.status)}
                      <span className="text-xs text-gray-400">
                        {getDeliveryMessage(order)}
                      </span>
                    </div>
                    <Link 
                      to={`/order/${order._id}`}
                      className="flex items-center gap-1 text-[#B76E79] hover:text-[#B76E79]/80 text-sm font-medium transition"
                    >
                      <FaEye className="text-sm" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;