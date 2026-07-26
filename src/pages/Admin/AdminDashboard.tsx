import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAdminStats } from '../../services/adminService';
import { getSubscribers } from '../../services/subscriberService';  
import { 
  FaBoxOpen, 
  FaShoppingBag, 
  FaUsers, 
  FaMoneyBillWave,
  FaSignOutAlt,
  FaPlus,
  FaChartLine,
  FaArrowRight,
  FaHome,
} from 'react-icons/fa';
import { FiShoppingCart, FiPackage} from 'react-icons/fi';
import { useAuth } from '../../Auth/authContext';
import RecentOrders from './components/RecentOrders';

const AdminDashboard: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [subscriberCount, setSubscriberCount] = useState(0);
  const navigate = useNavigate();

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

        const subscriberData = await getSubscribers();
        setSubscriberCount(subscriberData.count || 0);

      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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

  if (!isLoggedIn) return null;

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
        <RecentOrders />

        {/* ===== FOOTER ===== */}
        <div className="mt-8 text-center text-xs text-gray-400 border-t border-gray-100 pt-6">
          <p>© 2024 AS YOU WISH Admin Panel. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;