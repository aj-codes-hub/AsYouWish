// src/pages/Admin/AdminUsers.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUsers, 
  FaChevronDown, 
  FaChevronUp, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaSpinner,
  FaSearch
} from 'react-icons/fa';
import { toast } from 'react-toastify';

interface UserType {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  address?: string;
  city?: string;
  zipCode?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [editData, setEditData] = useState<{ role: string; isActive: boolean }>({
    role: 'user',
    isActive: true,
  });
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle accordion
  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    setEditingId(null);
  };

  // ✅ Start editing
  const startEditing = (user: UserType) => {
    setEditingId(user._id);
    setEditData({ role: user.role, isActive: user.isActive });
  };

  // ✅ Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
  };

  // ✅ Save user changes
  const saveUser = async (id: string) => {
    try {
      setSavingId(id);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      
      // ✅ Update local state
      setUsers(prev => 
        prev.map(user => 
          user._id === id 
            ? { ...user, role: editData.role, isActive: editData.isActive }
            : user
        )
      );
      
      toast.success('User updated successfully!');
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user');
    } finally {
      setSavingId(null);
    }
  };

  // ✅ Format date
  const formatDate = (dateString: string) => {
    const date = new  Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // ✅ Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // ✅ Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-[#B76E79] text-white';
      case 'user':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // ✅ Get status badge
  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? <span className="flex items-center gap-1 text-green-600"><FaCheckCircle className="text-green-500" /> Active</span>
      : <span className="flex items-center gap-1 text-red-600"><FaTimesCircle className="text-red-500" /> Inactive</span>;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-[65px] py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link 
              to="/admin/dashboard" 
              className="text-gray-600 hover:text-[#B76E79] transition cursor-pointer"
            >
              <FaArrowLeft />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaUsers className="text-[#B76E79]" />
                Users
              </h1>
              <p className="text-gray-500 text-sm">{filteredUsers.length} users found</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Total: {users.length}</span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition"
              />
            </div>
            <div className="relative">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2.5 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition appearance-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => {
            const isExpanded = expandedId === user._id;
            const isEditing = editingId === user._id;

            return (
              <div 
                key={user._id} 
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* ✅ User Header - Click to toggle */}
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50/80 transition flex flex-wrap items-center justify-between gap-3"
                  onClick={() => toggleAccordion(user._id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#B76E79]/10 flex items-center justify-center text-[#B76E79] font-bold text-sm flex-shrink-0">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                        <FaEnvelope className="text-[10px]" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                    {getStatusBadge(user.isActive)}
                    {isExpanded ? (
                      <FaChevronUp className="text-gray-400" />
                    ) : (
                      <FaChevronDown className="text-gray-400" />
                    )}
                  </div>
                </div>

                {/* ✅ Expanded Details */}
                {isExpanded && (
                  <div className="p-6 border-t border-gray-100 space-y-4">
                    {/* User Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <FaUser className="text-[#B76E79]" />
                          <span className="text-gray-500">Name:</span>
                          <span className="font-medium text-gray-800">{user.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FaEnvelope className="text-[#B76E79]" />
                          <span className="text-gray-500">Email:</span>
                          <span className="font-medium text-gray-800">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <FaPhone className="text-[#B76E79]" />
                            <span className="text-gray-500">Phone:</span>
                            <span className="font-medium text-gray-800">{user.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <FaCalendarAlt className="text-[#B76E79]" />
                          <span className="text-gray-500">Joined:</span>
                          <span className="font-medium text-gray-800">{formatDate(user.createdAt)}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <FaShieldAlt className="text-[#B76E79]" />
                          <span className="text-gray-500">Role:</span>
                          {isEditing ? (
                            <select
                              value={editData.role}
                              onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                              className="px-3 py-1 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#B76E79] text-sm"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                              {user.role}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FaShieldAlt className="text-[#B76E79]" />
                          <span className="text-gray-500">Status:</span>
                          {isEditing ? (
                            <select
                              value={editData.isActive ? 'active' : 'inactive'}
                              onChange={(e) => setEditData({ ...editData, isActive: e.target.value === 'active' })}
                              className="px-3 py-1 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#B76E79] text-sm"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          ) : (
                            getStatusBadge(user.isActive)
                          )}
                        </div>
                        {user.address && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Address:</span>
                            <span className="font-medium text-gray-800">{user.address}, {user.city}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ✅ Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveUser(user._id)}
                            disabled={savingId === user._id}
                            className="flex items-center gap-2 bg-[#B76E79] text-white px-4 py-2 rounded-xl hover:bg-[#B76E79]/90 transition disabled:opacity-50 cursor-pointer"
                          >
                            {savingId === user._id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaSave />
                            )}
                            {savingId === user._id ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition cursor-pointer"
                          >
                            <FaTimes /> Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEditing(user)}
                          className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100 transition cursor-pointer"
                        >
                          <FaEdit /> Edit User
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600">No users found</h3>
            <p className="text-gray-400 text-sm mt-1">Try changing your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;