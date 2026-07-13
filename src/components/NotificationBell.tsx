// src/components/NotificationBell.tsx
import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheck } from 'react-icons/fa';
import { IoNotificationsOutline } from "react-icons/io5";
import { useAuth } from '../Auth/authContext';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface NotificationType {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  data: any;
  createdAt: string;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevUnreadCount = useRef(0);

  // ✅ Audio — Properly initialized
  const [audio] = useState(() => {
    const audioElement = new Audio('/sounds/notification.mp3');
    audioElement.volume = 0.5;
    audioElement.load();
    return audioElement;
  });

  // ✅ Fetch notifications
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/notifications`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        // ✅ Debug logs
        console.log('🔔 Unread count:', data.unreadCount);
        console.log('🔔 Notifications:', data.notifications);
        
        const newUnreadCount = data.unreadCount || 0;
        
        setNotifications(data.notifications || []);
        setUnreadCount(newUnreadCount);
        
        // ✅ Play sound only if new unread notifications arrive
        if (newUnreadCount > prevUnreadCount.current) {
          audio.play().catch(() => console.log('Audio play failed'));
        }
        prevUnreadCount.current = newUnreadCount;
        
      } catch (error) {
        console.error('❌ Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn, audio]);

  // ✅ Click outside + Escape key to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // ✅ Mark as read
  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark as read');
      }

      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
    } catch (error) {
      console.error('❌ Error marking as read:', error);
    }
  };

  // ✅ Mark all as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark all as read');
      }

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      
    } catch (error) {
      console.error('❌ Error marking all as read:', error);
    }
  };

  const handleNotificationClick = (notification: NotificationType) => {
    navigate(`/admin/notifications/${notification._id}`);
    setIsOpen(false);
  };

  if (!isLoggedIn) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full hover:bg-[#B76E79] transition cursor-pointer ${
          isOpen ? "bg-[#B76E79]" : ""
        }`}
      >
        {isOpen ? (
          <FaBell className={`text-xl text-white ${unreadCount > 0 ? 'animate-wiggle' : ''}`} />
        ) : (
          <IoNotificationsOutline className="text-xl text-white" />
        )}
        
        {unreadCount > 0 && (
          <span className="absolute -top-[1.5px] right-[1.5px] bg-[#bc4c5d] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse-badge">
             {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-[450px] overflow-hidden animate-slide-down">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Notifications</h3>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-[#B76E79] hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              <Link
                to="/admin/notifications/history"
                className="text-xs text-gray-500 hover:text-[#B76E79] cursor-pointer"
              >
                View All →
              </Link>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[350px]">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#B76E79] border-t-transparent" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition ${
                    !notification.read ? 'bg-[#B76E79]/5 border-l-4 border-l-[#B76E79]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification._id);
                        }}
                        className="ml-2 text-xs text-[#B76E79] hover:underline flex-shrink-0 cursor-pointer"
                      >
                        <FaCheck />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;