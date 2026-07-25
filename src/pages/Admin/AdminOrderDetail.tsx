// src/pages/Admin/AdminOrderDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, FaBox, FaTruck, FaCheckCircle, FaClock, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';

const AdminOrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      setProcessing(true);
      await api.put(`/orders/${id}/status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}!`);
      fetchOrder();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <FaCheckCircle className="text-green-500 text-2xl" />;
      case 'shipped': return <FaTruck className="text-blue-500 text-2xl" />;
      case 'processing': return <FaSpinner className="text-yellow-500 text-2xl animate-spin" />;
      case 'pending': return <FaClock className="text-gray-500 text-2xl" />;
      default: return <FaClock className="text-gray-500 text-2xl" />;
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B76E79] border-t-transparent" /></div>;

  if (!order) return <div className="text-center py-20 text-red-500">Order not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-[65px]">
      <div className="container mx-auto px-4 max-w-4xl py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-[#B76E79] mb-6 cursor-pointer">
          <FaArrowLeft /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#B76E79] to-pink-500 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Order {order.orderId || '#' + order._id.slice(-6)}</h1>
                <p className="text-white/80 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                {getStatusIcon(order.orderStatus)}
                <span className="text-lg font-medium">{order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Customer Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold flex items-center gap-2 text-gray-700"><FaUser className="text-[#B76E79]" /> Customer</h3>
                <p className="text-gray-600 mt-2">{order.shippingAddress?.name || order.user?.name || 'Unknown'}</p>
                <p className="text-gray-500 text-sm flex items-center gap-2"><FaEnvelope className="text-xs" /> {order.shippingAddress?.email || order.user?.email || 'N/A'}</p>
                <p className="text-gray-500 text-sm flex items-center gap-2"><FaPhone className="text-xs" /> {order.shippingAddress?.phone || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold flex items-center gap-2 text-gray-700"><FaMapMarkerAlt className="text-[#B76E79]" /> Shipping Address</h3>
                <p className="text-gray-600 mt-2">{order.shippingAddress?.address || 'N/A'}</p>
                <p className="text-gray-500 text-sm">{order.shippingAddress?.city || ''}, {order.shippingAddress?.zipCode || ''}</p>
              </div>
            </div>

            {/* Products */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-semibold flex items-center gap-2 text-gray-700"><FaBox className="text-[#B76E79]" /> Products</h3>
              <div className="mt-2 space-y-2">
                {order.products?.map((p: any, i: number) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <div>
                      <p className="font-medium">{p.title}</p>
                      <p className="text-xs text-gray-500">Qty: {p.quantity}</p>
                    </div>
                    <p className="font-semibold text-[#B76E79]">Rs. {p.price * p.quantity}</p>
                  </div>
                ))}
                <div className="flex justify-between font-bold pt-2">
                  <span>Total</span>
                  <span className="text-[#B76E79]">Rs. {order.totalAmount || order.total}</span>
                </div>
              </div>
            </div>

            {/* Next Step */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                <>
                  {order.orderStatus === 'pending' && (
                    <button onClick={() => updateStatus('processing')} disabled={processing} className="bg-yellow-500 text-white px-6 py-2 rounded-xl hover:bg-yellow-600">Process Order</button>
                  )}
                  {order.orderStatus === 'processing' && (
                    <button onClick={() => updateStatus('shipped')} disabled={processing} className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600">Ship Order</button>
                  )}
                  {order.orderStatus === 'shipped' && (
                    <button onClick={() => updateStatus('delivered')} disabled={processing} className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 cursor-pointer">Mark Delivered</button>
                  )}
                  <button onClick={() => updateStatus('cancelled')} disabled={processing} className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 cursor-pointer">Cancel Order</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail