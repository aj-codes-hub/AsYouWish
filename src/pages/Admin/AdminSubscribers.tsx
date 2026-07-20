// src/pages/Admin/AdminSubscribers.tsx
import React, { useState, useEffect } from 'react';
import { FaUsers, FaEnvelope, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { getSubscribers, unsubscribe } from '../../services/subscriberService';
import { Link } from 'react-router-dom';

const AdminSubscribers: React.FC = () => {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const data = await getSubscribers();
      setSubscribers(data.subscribers || []);
      setCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Unsubscribe Handler
  const handleUnsubscribe = async (email: string) => {
    if (!window.confirm(`Are you sure you want to unsubscribe ${email}?`)) return;
    
    try {
      await unsubscribe(email);
      // ✅ Remove from list
      setSubscribers(prev => prev.filter(s => s.email !== email));
      setCount(prev => prev - 1);
      alert('Unsubscribed successfully!');
    } catch (error) {
      alert('Failed to unsubscribe');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#B76E79] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[65px]">
      <div className="container mx-auto px-4 max-w-5xl py-8">
        
        {/* ✅ Back Button */}
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-2 text-gray-600 hover:text-[#B76E79] transition mb-6 cursor-pointer"
        >
          <FaArrowLeft />
          <span>Back to Dashboard</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaUsers className="text-[#B76E79]" />
              Subscribers
            </h2>
            <span className="bg-[#B76E79]/10 text-[#B76E79] px-3 py-1 rounded-full text-sm font-medium">
              {count} total
            </span>
          </div>

          {subscribers.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No subscribers yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Subscribed At</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subscribers.map((sub) => (
                    <tr key={sub._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />
                        {sub.email}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(sub.subscribedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleUnsubscribe(sub.email)}
                          className="text-red-400 hover:text-red-600 transition cursor-pointer"
                          title="Unsubscribe"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSubscribers;