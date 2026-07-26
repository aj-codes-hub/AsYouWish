import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShoppingBag, 
  FaCheckCircle, 
  FaTruck, 
  FaSpinner, 
  FaClock,
  FaRupeeSign,
  FaCalendarAlt,
  FaBoxOpen,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCreditCard
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
  totalAmount: any;
  user: any;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'delivered'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
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

  // ✅ Toggle accordion
  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
      <div className="container mx-auto px-4 max-w-4xl">
        
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
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-400">No orders in this category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isExpanded = expandedId === order._id;
              
              return (
                <div 
                  key={order._id} 
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* ✅ Order Header - Click to toggle */}
                  <div 
                    className="bg-gray-50/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-gray-100/80 transition"
                    onClick={() => toggleAccordion(order._id)}
                  >
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
                        {order.totalAmount || order.total}
                      </span>
                      {getStatusBadge(order.status)}
                      {isExpanded ? (
                        <FaChevronUp className="text-gray-400" />
                      ) : (
                        <FaChevronDown className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* ✅ Order Body - Expanded Details */}
                  {isExpanded && (
                    <div className="p-6 space-y-4 border-t border-gray-100">
                      {/* Products */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Products</h4>
                        <div className="space-y-3">
                          {order.products?.map((product, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
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
                        </div>
                      </div>

                      {/* Order Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                        {/* Customer Info */}
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            <FaUser className="inline mr-1" /> Customer
                          </h5>
                          <p className="text-sm font-medium text-gray-800">
                            {order.shippingAddress?.name || order.user?.name || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FaEnvelope className="text-[10px]" /> {order.shippingAddress?.email || order.user?.email || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FaPhone className="text-[10px]" /> {order.shippingAddress?.phone || 'N/A'}
                          </p>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            <FaMapMarkerAlt className="inline mr-1" /> Shipping Address
                          </h5>
                          <p className="text-sm text-gray-800">
                            {order.shippingAddress?.address || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-800">
                            {order.shippingAddress?.city}, {order.shippingAddress?.zipCode}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <FaCreditCard className="text-[10px]" /> {order.paymentMethod || 'COD'}
                          </p>
                        </div>
                      </div>

                      {/* Order Total */}
                      <div className="flex justify-end pt-3 border-t border-gray-100">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-xl font-bold text-[#B76E79]">
                            Rs. {order.totalAmount || order.total}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;