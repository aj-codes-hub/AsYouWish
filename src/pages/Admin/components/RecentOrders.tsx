// src/pages/Admin/components/RecentOrders.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShoppingBag, 
  FaEye, 
  FaCheckCircle, 
  FaTruck, 
  FaSpinner, 
  FaClock,
  FaArrowRight,
  FaUser,
  FaTimesCircle,
  FaArrowCircleRight
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface OrderType {
  _id: string;
  orderId: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
  shippingAddress?: any;
  user?: any;
  isNew?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const RecentOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      const formattedOrders = data.map((order: any) => ({
        _id: order._id,
        orderId: order.orderId || '#' + order._id.slice(-6),
        customerName: order.shippingAddress?.name || order.user?.name || 'Unknown',
        total: order.totalAmount || order.total || 0,
        status: order.orderStatus || 'pending',
        createdAt: order.createdAt,
        isNew: new Date(order.createdAt) > fiveMinutesAgo,
        shippingAddress: order.shippingAddress,
        user: order.user,
        products: order.products,
      }));

      setOrders(formattedOrders.slice(0, 5));
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setProcessingOrderId(orderId);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setOrders(prev => 
        prev.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus, isNew: false } 
            : order
        )
      );

      toast.success(`Order status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}!`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    } finally {
      setProcessingOrderId(null);
    }
  };

  // ✅ Get next status
  const getNextStatus = (currentStatus: string) => {
    const flow = ['pending', 'processing', 'shipped', 'delivered'];
    const nextIndex = flow.indexOf(currentStatus) + 1;
    if (nextIndex < flow.length) {
      return flow[nextIndex];
    }
    return null;
  };

  // ✅ Status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500 text-sm mr-1.5" />;
      case 'shipped':
        return <FaTruck className="text-blue-500 text-sm mr-1.5" />;
      case 'processing':
        return <FaSpinner className="text-yellow-500 text-sm mr-1.5 animate-spin" />;
      case 'pending':
        return <FaClock className="text-gray-500 text-sm mr-1.5" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500 text-sm mr-1.5" />;
      default:
        return <FaClock className="text-gray-500 text-sm mr-1.5" />;
    }
  };

  // ✅ Status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // ✅ Status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const isOrderLate = (order: OrderType) => {
    if (order.status !== 'shipped') return false;
    const shippedDate = new Date(order.createdAt);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - shippedDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 5;
  };

  const getLateMessage = (order: OrderType) => {
    if (!isOrderLate(order)) return null;
    const shippedDate = new Date(order.createdAt);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - shippedDate.getTime()) / (1000 * 60 * 60 * 24));
    return `⚠️ ${diffDays} days ago - Late delivery`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#B76E79] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-[#B76E79] hover:underline cursor-pointer text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No orders yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#B76E79]/10 rounded-xl flex items-center justify-center text-[#B76E79]">
            <FaShoppingBag className="text-sm sm:text-base" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-800">Recent Orders</h2>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
              Latest {orders.length} transactions
            </p>
          </div>
        </div>
        <Link 
          to="/admin/orders" 
          className="flex items-center gap-1 text-[#B76E79] hover:text-[#B76E79]/80 text-sm font-medium transition-colors"
        >
          View All
          <FaArrowRight className="text-xs" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-gray-50/80 text-gray-500">
            <tr>
              <th className="px-3 sm:px-4 py-3 text-left font-semibold">Order</th>
              <th className="px-3 sm:px-4 py-3 text-left font-semibold hidden sm:table-cell">Date</th>
              <th className="px-3 sm:px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-3 sm:px-4 py-3 text-left font-semibold hidden sm:table-cell">Total</th>
              <th className="px-3 sm:px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-3 sm:px-4 py-3 text-left font-semibold">Action</th>
              <th className="px-3 sm:px-4 py-3 text-center font-semibold">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => {
              const nextStatus = getNextStatus(order.status);
              const isLate = isOrderLate(order);
              const lateMessage = getLateMessage(order);
              const isProcessing = processingOrderId === order._id;
              const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

              return (
                <tr 
                  key={order._id} 
                  className={`hover:bg-[#B76E79]/5 transition-colors duration-150 ${order.isNew ? 'bg-[#B76E79]/10 border-l-4 border-l-[#B76E79]' : ''}`}
                >
                  <td className="px-3 sm:px-4 py-3 font-medium text-gray-800 text-xs sm:text-sm">
                    {order.orderId}
                    {order.isNew && (
                      <span className="ml-2 text-[10px] bg-[#B76E79] text-white px-2 py-0.5 rounded-full animate-pulse">
                        New
                      </span>
                    )}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">
                    {new Date(order.createdAt).toLocaleDateString()}
                    {isLate && (
                      <div className="text-[10px] text-red-500 font-medium mt-0.5">
                        {lateMessage}
                      </div>
                    )}
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xs font-medium flex-shrink-0">
                        <FaUser className="text-[10px]" />
                      </div>
                      <span className="text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">
                        {order.customerName}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 font-semibold text-[#B76E79] hidden sm:table-cell">
                    Rs. {order.total}
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    {/* ✅ STATUS WITH ICON */}
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      disabled={isProcessing}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B76E79] ${getStatusColor(order.status)}`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {getStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    {order.status !== 'cancelled' && order.status !== 'delivered' && nextStatus && (
                      <button
                        onClick={() => updateOrderStatus(order._id, nextStatus)}
                        disabled={isProcessing}
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#B76E79]/10 text-[#B76E79] hover:bg-[#B76E79] hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaArrowCircleRight />
                        )}
                        {isProcessing ? 'Updating...' : `→ ${getStatusLabel(nextStatus)}`}
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <span className="text-xs text-green-600 font-medium">✅ Completed</span>
                    )}
                    {order.status === 'cancelled' && (
                      <span className="text-xs text-red-500 font-medium">❌ Cancelled</span>
                    )}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-center">
                    <button 
                      className="text-[#B76E79] hover:text-[#B76E79]/80 p-1.5 hover:bg-[#B76E79]/10 rounded-lg transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                    >
                      <FaEye className="text-sm sm:text-base" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden divide-y divide-gray-100">
        {orders.slice(0, 3).map((order) => {
          const isLate = isOrderLate(order);
          const lateMessage = getLateMessage(order);
          const nextStatus = getNextStatus(order.status);
          
          return (
            <div 
              key={order._id} 
              className={`p-4 hover:bg-[#B76E79]/5 transition-colors ${order.isNew ? 'bg-[#B76E79]/5 border-l-4 border-l-[#B76E79]' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800 text-sm flex items-center gap-2">
                  {order.orderId}
                  {order.isNew && (
                    <span className="text-[10px] bg-[#B76E79] text-white px-2 py-0.5 rounded-full animate-pulse">
                      New
                    </span>
                  )}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              {isLate && (
                <div className="text-[10px] text-red-500 font-medium mb-1">
                  {lateMessage}
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-[#B76E79] font-semibold">
                    Rs. {order.total}
                  </p>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      disabled={processingOrderId === order._id}
                      className={`text-xs px-2 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#B76E79] ${getStatusColor(order.status)}`}
                    >
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <option key={status} value={status}>
                          {getStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                    {order.status !== 'cancelled' && order.status !== 'delivered' && nextStatus && (
                      <button
                        onClick={() => updateOrderStatus(order._id, nextStatus)}
                        disabled={processingOrderId === order._id}
                        className="text-xs text-[#B76E79] hover:underline cursor-pointer"
                      >
                        → {getStatusLabel(nextStatus)}
                      </button>
                    )}
                  </div>
                </div>
                <button 
                  className="text-[#B76E79] p-1.5"
                  onClick={() => navigate(`/admin/orders/${order._id}`)}
                >
                  <FaEye className="text-sm" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentOrders;