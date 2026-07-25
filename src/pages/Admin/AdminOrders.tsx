// src/pages/Admin/AdminOrders.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaEye, 
  FaSpinner,
  FaUser,
  FaArrowCircleRight,
  FaShoppingBag
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

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

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('7days');
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      const data = response.data;
      
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

      const now = new Date();
      let filtered = formattedOrders;
      if (filter === '24hours') {
        filtered = formattedOrders.filter((o: OrderType) => 
          new Date(o.createdAt) > new Date(now as any - 24 * 60 * 60 * 1000)
        );
      } else if (filter === '7days') {
        filtered = formattedOrders.filter((o: OrderType) => 
          new Date(o.createdAt) > new Date(now as any - 7 * 24 * 60 * 60 * 1000)
        );
      } else if (filter === '30days') {
        filtered = formattedOrders.filter((o: OrderType) => 
          new Date(o.createdAt) > new Date(now as any - 30 * 24 * 60 * 60 * 1000)
        );
      }
      
      setOrders(filtered);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setProcessingOrderId(orderId);
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}!`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setProcessingOrderId(null);
    }
  };

  const getNextStatus = (currentStatus: string) => {
    const flow = ['pending', 'processing', 'shipped', 'delivered'];
    const nextIndex = flow.indexOf(currentStatus) + 1;
    if (nextIndex < flow.length) {
      return flow[nextIndex];
    }
    return null;
  };

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
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#B76E79] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-[65px]">
      <div className="container mx-auto px-4 max-w-7xl py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="text-gray-600 hover:text-[#B76E79] transition cursor-pointer">
              <FaArrowLeft />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
              <p className="text-sm text-gray-500">{orders.length} orders found</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            {['24hours', '7days', '30days', 'all'].map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer ${
                  filter === opt ? 'bg-[#B76E79] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt === '24hours' ? 'Last 24 Hours' :
                 opt === '7days' ? 'Last 7 Days' :
                 opt === '30days' ? 'Last 30 Days' : 'All Orders'}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
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
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600">No orders found</h3>
            <p className="text-gray-400 text-sm mt-1">Try changing the filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;