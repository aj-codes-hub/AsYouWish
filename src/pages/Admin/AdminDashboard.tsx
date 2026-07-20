import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAdminStats } from '../../services/adminService';
import { getSubscribers } from '../../services/subscriberService';  
import { 
  FaBoxOpen, 
  FaShoppingBag, 
  FaUsers, 
  FaMoneyBillWave,
  FaEye,
  FaSignOutAlt,
  FaPlus,
  FaChartLine,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaSpinner,
  FaArrowRight,
  FaHome,
} from 'react-icons/fa';
import { FiShoppingCart, FiPackage} from 'react-icons/fi';
import { useAuth } from '../../Auth/authContext';


const AdminDashboard: React.FC = () => {
  
   const { user, isLoggedIn, logout } = useAuth();
   const [subscriberCount, setSubscriberCount] = useState(0);
  const navigate = useNavigate();

  // ✅ State for stats from backend
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // ✅ Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats({
          totalProducts: data.totalProducts || 0,
          totalOrders: data.totalOrders || 0,
          totalUsers: data.totalUsers || 0,
          totalRevenue: data.totalRevenue || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Stats cards
  const statsCards = [
    {
      title: 'Total Products',
      value: loading ? '...' : stats.totalProducts,
      icon: <FaBoxOpen className="text-xl" />,
      color: 'from-[#B76E79] to-pink-500',
      bgColor: 'bg-[#B76E79]/10',
      textColor: 'text-[#B76E79]',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: loading ? '...' : stats.totalOrders,
      icon: <FaShoppingBag className="text-xl" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      link: '/admin/orders',
    },
    {
      title: 'Total Users',
      value: loading ? '...' : stats.totalUsers,
      icon: <FaUsers className="text-xl" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      link: '/admin/users',
    },
    {
      title: 'Revenue',
      value: loading ? '...' : `Rs. ${stats.totalRevenue.toLocaleString()}`,
      icon: <FaMoneyBillWave className="text-xl" />,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      link: '#',
    },
  ];

  // Quick actions
  const quickActions = [
    { 
      title: 'Add Product', 
      icon: <FaPlus className="text-xl" />, 
      link: '/admin/products/add',
      color: 'bg-[#B76E79]',
      textColor: 'text-white',
    },
    { 
      title: 'Manage Products', 
      icon: <FiPackage className="text-xl" />, 
      link: '/admin/products',
      color: 'bg-blue-500',
      textColor: 'text-white',
    },
    { 
      title: 'View Orders', 
      icon: <FiShoppingCart className="text-xl" />, 
      link: '/admin/orders',
      color: 'bg-green-500',
      textColor: 'text-white',
    },
    { 
      title: 'Dashboard', 
      icon: <FaHome className="text-xl" />, 
      link: '/admin/dashboard',
      color: 'bg-purple-500',
      textColor: 'text-white',
    },
  ];

  // Sample orders (will be replaced with real data)
  const orders = [
    { id: '#1001', date: '2024-06-20', customer: 'Sarah Ahmed', total: 2999, status: 'delivered' },
    { id: '#1002', date: '2024-06-19', customer: 'Fatima Khan', total: 4599, status: 'processing' },
    { id: '#1003', date: '2024-06-18', customer: 'Zara Hussain', total: 1999, status: 'shipped' },
    { id: '#1004', date: '2024-06-17', customer: 'Ayesha Ali', total: 6999, status: 'pending' },
    { id: '#1005', date: '2024-06-16', customer: 'Sana Malik', total: 3499, status: 'delivered' },
  ];

  if (!isLoggedIn) return null;

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusMap: { [key: string]: { color: string; icon: React.ReactNode } } = {
      delivered: { 
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: <FaCheckCircle className="text-green-500 mr-1" size={12} />
      },
      shipped: { 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: <FaTruck className="text-blue-500 mr-1" size={12} />
      },
      processing: { 
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: <FaSpinner className="text-yellow-500 mr-1 animate-spin" size={12} />
      },
      pending: { 
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: <FaClock className="text-gray-500 mr-1" size={12} />
      },
    };

    const statusInfo = statusMap[status] || statusMap.pending;

    return (
      <span className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
        {statusInfo.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-[65px] max-w-[1150px] mx-auto">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-6 sm:py-8">
        
        {/* ===== HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <span className="bg-gradient-to-r from-[#B76E79] to-pink-500 text-white p-2 rounded-xl">
                <FaChartLine className="text-xl" />
              </span>
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Welcome back, <span className="font-semibold text-gray-700">{user?.name}</span> 👋
            </p>
          </div>

        <Link 
          to="/admin/subscribers" 
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition text-gray-600 hover:text-gray-800"
        >
          <FaUsers className="text-sm" />
          <span>Subscribers</span>
          <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
            {subscriberCount}
          </span>
        </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100">
              <div className="w-8 h-8 bg-[#B76E79]/10 rounded-full flex items-center justify-center text-[#B76E79] text-sm font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
            </div>
            <button 
              onClick={() => logout()}
              className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-red-100 text-red-600 px-4 py-2 rounded-xl hover:from-red-100 hover:to-red-200 transition-all duration-300 hover:scale-105 cursor-pointer shadow-sm hover:shadow-md"
            >
              <FaSignOutAlt className="text-sm" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* ===== STATS CARDS ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.textColor} group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-gray-400 group-hover:text-[#B76E79] transition-colors">
                  <span>View details</span>
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className={`h-1 bg-gradient-to-r ${stat.color} w-0 group-hover:w-full transition-all duration-700`} />
            </Link>
          ))}
        </div>

        {/* ===== QUICK ACTIONS ===== */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#B76E79] rounded-full"></span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`${action.color} ${action.textColor} p-4 sm:p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center group cursor-pointer`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="text-2xl sm:text-3xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                    {action.icon}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-center group-hover:tracking-wider transition-all duration-300">
                    {action.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ===== RECENT ORDERS ===== */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#B76E79]/10 rounded-xl flex items-center justify-center text-[#B76E79]">
                <FaShoppingBag className="text-sm sm:text-base" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-800">Recent Orders</h2>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Latest transactions from customers</p>
              </div>
            </div>
            <Link 
              to="/admin/orders" 
              className="flex items-center gap-1 text-[#B76E79] hover:text-[#B76E79]/80 text-sm font-medium transition-colors"
            >
              View All Orders
              <FaArrowRight className="text-xs" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-gray-50/80 text-gray-500">
                <tr>
                  <th className="px-3 sm:px-4 py-3 text-left font-semibold">Order ID</th>
                  <th className="px-3 sm:px-4 py-3 text-left font-semibold hidden sm:table-cell">Date</th>
                  <th className="px-3 sm:px-4 py-3 text-left font-semibold">Customer</th>
                  <th className="px-3 sm:px-4 py-3 text-left font-semibold hidden sm:table-cell">Total</th>
                  <th className="px-3 sm:px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-3 sm:px-4 py-3 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order, index) => (
                  <tr key={index} className="hover:bg-[#B76E79]/5 transition-colors duration-150">
                    <td className="px-3 sm:px-4 py-3 font-medium text-gray-800 text-xs sm:text-sm">
                      {order.id}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">
                      {order.date}
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xs font-medium flex-shrink-0">
                          {order.customer.charAt(0)}
                        </div>
                        <span className="text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">
                          {order.customer}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 font-semibold text-[#B76E79] hidden sm:table-cell">
                      Rs. {order.total}
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-center">
                      <button className="text-[#B76E79] hover:text-[#B76E79]/80 p-1.5 hover:bg-[#B76E79]/10 rounded-lg transition-colors cursor-pointer">
                        <FaEye className="text-sm sm:text-base" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: Show only first 3 orders */}
          <div className="sm:hidden divide-y divide-gray-100">
            {orders.slice(0, 3).map((order, index) => (
              <div key={index} className="p-4 hover:bg-[#B76E79]/5 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800 text-sm">{order.id}</span>
                  <span className="text-xs text-gray-500">{order.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{order.customer}</p>
                    <p className="text-xs text-[#B76E79] font-semibold">Rs. {order.total}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={order.status} />
                    <button className="text-[#B76E79] p-1.5">
                      <FaEye className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="mt-8 text-center text-xs text-gray-400 border-t border-gray-100 pt-6">
          <p>© 2024 AS YOU WISH Admin Panel. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;