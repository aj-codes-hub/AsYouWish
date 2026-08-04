import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  FaPen,
  FaSyncAlt,
  FaSun,
  FaMoon,
} from 'react-icons/fa';
import { FiShoppingCart, FiPackage } from 'react-icons/fi';
import { useAuth } from '../../Auth/authContext';
import RecentOrders from './components/RecentOrders';

/* ---------------------------------------------------------
   AS YOU WISH — Admin Dashboard
   Primary brand color: #B76E79 (used in both themes)
   Light theme (default): white surfaces, rose-gold accents
   Dark theme: charcoal base, same rose-gold + gold accents
---------------------------------------------------------- */

const GOALS_KEY = 'ayw_admin_goals_v1';
const THEME_KEY = 'ayw_admin_theme_v1';

type Theme = 'light' | 'dark';

type Goals = {
  products: number;
  orders: number;
  users: number;
  revenue: number;
};

const DEFAULT_GOALS: Goals = {
  products: 500,
  orders: 1000,
  users: 5000,
  revenue: 500000,
};

const loadGoals = (): Goals => {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    if (!raw) return DEFAULT_GOALS;
    return { ...DEFAULT_GOALS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_GOALS;
  }
};

const loadTheme = (): Theme => {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    return raw === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

/* Circular progress ring — pure SVG, no chart library needed */
const ProgressRing: React.FC<{
  percent: number;
  ringColor: string;
  trackColor: string;
  size?: number;
  stroke?: number;
}> = ({ percent, ringColor, trackColor, size = 60, stroke = 5 }) => {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={ringColor}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
    </svg>
  );
};

const AdminDashboard: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [subscriberCount, setSubscriberCount] = useState(0);
  const navigate = useNavigate();

  const [theme, setTheme] = useState<Theme>(loadTheme());
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [goals, setGoals] = useState<Goals>(loadGoals());

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const fetchStats = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
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
      setLastUpdated(new Date());
      setSecondsAgo(0);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Live auto-refresh every 30s
  useEffect(() => {
    const poll = setInterval(() => fetchStats(true), 30000);
    return () => clearInterval(poll);
  }, [fetchStats]);

  // "Updated Xs ago" ticker
  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(tick);
  }, [lastUpdated]);

  const handleEditGoal = (key: keyof Goals, label: string) => {
    const input = window.prompt(`Set monthly goal for ${label}`, String(goals[key]));
    if (input === null) return;
    const num = Number(input.replace(/[, ]/g, ''));
    if (!isNaN(num) && num > 0) {
      const updated = { ...goals, [key]: num };
      setGoals(updated);
      try {
        localStorage.setItem(GOALS_KEY, JSON.stringify(updated));
      } catch {
        /* ignore storage errors */
      }
    }
  };

  const isDark = theme === 'dark';

  /* Theme-derived design tokens. Primary brand color (#B76E79) stays
     constant across both themes; everything else adapts around it. */
  const t = useMemo(
    () => ({
      pageBg: isDark ? 'bg-[#0B0A0D]' : 'bg-[#FAF7F6]',
      auroraA: isDark ? 'bg-[#B76E79]/20' : 'bg-[#B76E79]/10',
      auroraB: isDark ? 'bg-[#D4AF6A]/10' : 'bg-[#D4AF6A]/10',
      heading: isDark ? 'text-[#F3EEEA]' : 'text-[#2A2226]',
      muted: isDark ? 'text-[#8B8790]' : 'text-[#8A7B7E]',
      subtle: isDark ? 'text-[#6B6870]' : 'text-[#A6969A]',
      cardBg: isDark ? 'bg-white/[0.03]' : 'bg-white',
      cardBorder: isDark ? 'border-white/[0.06]' : 'border-[#B76E79]/[0.14]',
      cardHover: isDark ? 'hover:bg-white/[0.05]' : 'hover:bg-[#FFF9F8]',
      chipBg: isDark ? 'bg-white/[0.04]' : 'bg-white',
      chipBorder: isDark ? 'border-white/[0.06]' : 'border-[#B76E79]/[0.16]',
      chipHover: isDark ? 'hover:bg-white/[0.07]' : 'hover:bg-[#FBF1F0]',
      chipText: isDark ? 'text-[#B8B3AD]' : 'text-[#5C4E51]',
      chipTextHover: isDark ? 'hover:text-[#F3EEEA]' : 'hover:text-[#2A2226]',
      valueText: isDark ? 'text-[#F3EEEA]' : 'text-[#2A2226]',
      actionText: isDark ? 'text-[#D8D2CC]' : 'text-[#4A3C3F]',
      actionTextHover: isDark ? 'group-hover:text-[#F3EEEA]' : 'group-hover:text-[#2A2226]',
      ringTrack: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(183,110,121,0.14)',
      badgeBg: isDark ? 'bg-white/[0.06]' : 'bg-[#B76E79]/[0.10]',
      logoutBg: isDark ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/15' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100',
      toggleBg: isDark ? 'bg-white/[0.04] border-white/[0.06] text-[#D4AF6A]' : 'bg-white border-[#B76E79]/[0.16] text-[#B76E79]',
      goalPencil: isDark ? 'text-[#6B6870] hover:text-[#D4AF6A] hover:bg-white/[0.06]' : 'text-[#B8A5A8] hover:text-[#B76E79] hover:bg-[#B76E79]/[0.08]',
    }),
    [isDark]
  );

  const statsCards = [
    {
      key: 'products' as const,
      title: 'Total Products',
      value: stats.totalProducts,
      display: loading ? '…' : stats.totalProducts.toLocaleString(),
      goal: goals.products,
      icon: <FaBoxOpen />,
      ring: '#B76E79',
      rgb: '183,110,121',
      link: '/admin/products',
    },
    {
      key: 'orders' as const,
      title: 'Total Orders',
      value: stats.totalOrders,
      display: loading ? '…' : stats.totalOrders.toLocaleString(),
      goal: goals.orders,
      icon: <FaShoppingBag />,
      ring: '#7DA6C4',
      rgb: '125,166,196',
      link: '/admin/orders',
    },
    {
      key: 'users' as const,
      title: 'Total Users',
      value: stats.totalUsers,
      display: loading ? '…' : stats.totalUsers.toLocaleString(),
      goal: goals.users,
      icon: <FaUsers />,
      ring: '#7FC29B',
      rgb: '127,194,155',
      link: '/admin/users',
    },
    {
      key: 'revenue' as const,
      title: 'Revenue',
      value: stats.totalRevenue,
      display: loading ? '…' : `Rs. ${stats.totalRevenue.toLocaleString()}`,
      goal: goals.revenue,
      icon: <FaMoneyBillWave />,
      ring: '#D4AF6A',
      rgb: '212,175,106',
      link: '#',
    },
  ];

  const quickActions = [
    { title: 'Add Product', icon: <FaPlus />, link: '/admin/products/add', accent: '#B76E79' },
    { title: 'Manage Products', icon: <FiPackage />, link: '/admin/products', accent: '#7DA6C4' },
    { title: 'View Orders', icon: <FiShoppingCart />, link: '/admin/orders', accent: '#7FC29B' },
    { title: 'Dashboard', icon: <FaHome />, link: '/admin/dashboard', accent: '#D4AF6A' },
  ];

  if (!isLoggedIn) return null;

  return (
    <div className={`relative min-h-screen ${t.pageBg} pt-[65px] overflow-hidden transition-colors duration-300`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .ayw-display { font-family: 'Fraunces', serif; }
        .ayw-mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes ayw-pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.55); }
          70% { box-shadow: 0 0 0 8px rgba(74,222,128,0); }
        }
        .ayw-live-dot { animation: ayw-pulse-dot 2s infinite; }
        @keyframes ayw-aurora {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(24px, -18px) scale(1.08); }
        }
        .ayw-aurora { animation: ayw-aurora 14s ease-in-out infinite; }
        @keyframes ayw-spin { to { transform: rotate(360deg); } }
        .ayw-spin { animation: ayw-spin 0.9s linear infinite; }
      `}</style>

      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`ayw-aurora absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full ${t.auroraA} blur-[110px]`} />
        <div
          className={`ayw-aurora absolute top-1/3 -right-24 w-[380px] h-[380px] rounded-full ${t.auroraB} blur-[110px]`}
          style={{ animationDelay: '3s' }}
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 max-w-[1150px] py-6 sm:py-8">
        {/* ===== HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className={`ayw-display text-2xl sm:text-3xl lg:text-4xl font-semibold ${t.heading} flex items-center gap-3 tracking-tight`}>
              <span className="bg-gradient-to-br from-[#B76E79] to-[#8B4A54] text-white p-2.5 rounded-2xl shadow-lg shadow-[#B76E79]/20">
                <FaChartLine className="text-lg" />
              </span>
              Dashboard
            </h1>
            <p className={`text-sm ${t.muted} mt-1.5 flex items-center gap-2 flex-wrap`}>
              Welcome back, <span className={`font-medium ${t.actionText}`}>{user?.name}</span>
              <span className="text-[#B76E79]">•</span>
              <span className="inline-flex items-center gap-1.5 ayw-mono text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ayw-live-dot" />
                <span className="text-emerald-500">LIVE</span>
                <span className={t.subtle}>
                  · updated {secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.floor(secondsAgo / 60)}m ago`}
                </span>
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center border px-3.5 py-2.5 rounded-xl transition-all ${t.toggleBg} hover:scale-105`}
              aria-label="Toggle light or dark theme"
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {isDark ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
            </button>

            <button
              onClick={() => fetchStats(true)}
              className={`flex items-center gap-2 border px-3.5 py-2.5 rounded-xl transition-all ${t.chipBg} ${t.chipBorder} ${t.chipHover} ${t.chipText}`}
              aria-label="Refresh dashboard data"
            >
              <FaSyncAlt className={`text-xs ${refreshing ? 'ayw-spin' : ''}`} />
            </button>

            <Link
              to="/admin/subscribers"
              className={`flex items-center gap-2.5 px-4 py-2.5 border rounded-xl transition-all ${t.chipBg} ${t.chipBorder} ${t.chipHover} ${t.chipText} ${t.chipTextHover}`}
            >
              <FaUsers className="text-sm" />
              <span className="text-sm hidden sm:inline">Subscribers</span>
              <span className={`ayw-mono ${t.badgeBg} text-[#B76E79] text-xs px-2 py-0.5 rounded-full font-medium`}>
                {subscriberCount}
              </span>
            </Link>

            <div className={`flex items-center gap-2 border px-3 py-2 rounded-xl ${t.chipBg} ${t.chipBorder}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-[#B76E79] to-[#8B4A54] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${t.actionText}`}>{user?.name}</span>
            </div>

            <button
              onClick={() => logout()}
              className={`flex items-center gap-2 border px-4 py-2.5 rounded-xl transition-all cursor-pointer ${t.logoutBg}`}
            >
              <FaSignOutAlt className="text-sm" />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </div>
        </div>

        {/* ===== STATS CARDS ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {statsCards.map((stat) => {
            const percent = stat.goal > 0 ? (stat.value / stat.goal) * 100 : 0;
            const glow = isDark
              ? `shadow-[0_0_40px_-12px_rgba(${stat.rgb},0.5)]`
              : `shadow-[0_0_28px_-12px_rgba(${stat.rgb},0.35)]`;
            return (
              <div
                key={stat.key}
                className={`group relative border rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${t.cardBg} ${t.cardBorder} ${t.cardHover} ${glow}`}
              >
                <Link to={stat.link} className="block">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className={`text-xs font-medium mb-1.5 uppercase tracking-wide ${t.muted}`}>
                        {stat.title}
                      </p>
                      <p className={`ayw-mono text-xl sm:text-2xl font-semibold truncate ${t.valueText}`}>
                        {stat.display}
                      </p>
                    </div>
                    <div className="relative shrink-0">
                      <ProgressRing percent={percent} ringColor={stat.ring} trackColor={t.ringTrack} size={56} stroke={5} />
                      <div
                        className="absolute inset-0 flex items-center justify-center text-[18px]"
                        style={{ color: stat.ring }}
                      >
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                  <div className={`mt-3 flex items-center gap-1 text-xs ${t.subtle} group-hover:text-[#B76E79] transition-colors`}>
                    <span>View details</span>
                    <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEditGoal(stat.key, stat.title);
                  }}
                  className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg ${t.goalPencil}`}
                  aria-label={`Edit ${stat.title} goal`}
                  title="Edit monthly goal"
                >
                  <FaPen className="text-[10px]" />
                </button>

                <p className={`ayw-mono mt-2 text-[10px] ${t.subtle}`}>
                  {Math.min(100, Math.round(percent))}% of {stat.key === 'revenue' ? 'Rs. ' : ''}
                  {stat.goal.toLocaleString()} goal
                </p>
              </div>
            );
          })}
        </div>

        {/* ===== QUICK ACTIONS ===== */}
        <div className="mb-8">
          <h2 className={`ayw-display text-base font-semibold mb-4 flex items-center gap-2 ${t.heading}`}>
            <span className="w-1 h-5 bg-[#B76E79] rounded-full"></span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`group relative border p-4 sm:p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 text-center overflow-hidden ${t.cardBg} ${t.cardBorder} ${t.cardHover}`}
              >
                <div
                  className="absolute inset-x-0 bottom-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: action.accent }}
                />
                <div className="flex flex-col items-center gap-2.5">
                  <div
                    className="text-xl w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ color: action.accent, background: `${action.accent}1A` }}
                  >
                    {action.icon}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium transition-colors ${t.actionText} ${t.actionTextHover}`}>
                    {action.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ===== RECENT ORDERS ===== */}
        <div className={`border rounded-2xl p-1 sm:p-2 ${t.cardBg} ${t.cardBorder}`}>
          <RecentOrders />
        </div>

        {/* ===== FOOTER ===== */}
        <div className={`mt-8 text-center text-xs border-t pt-6 ${t.subtle} ${isDark ? 'border-white/[0.06]' : 'border-[#B76E79]/[0.12]'}`}>
          <p>© 2024 AS YOU WISH Admin Panel. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
