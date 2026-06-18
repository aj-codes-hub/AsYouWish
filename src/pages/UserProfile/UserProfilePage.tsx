// src/pages/UserProfile/UserProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Auth/authContext';
import { useCart } from '../../pages/context/cartContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
    FaUser, 
    FaEnvelope, 
    FaPhone, 
    FaMapMarkerAlt, 
    FaEdit, 
    FaSave, 
    FaTimes,
    FaShoppingBag,
    FaHeart,
    FaSignOutAlt,
    FaUserCircle,
    FaCalendarAlt,
    FaCheckCircle,
    FaClock,
    FaTruck,
    FaPlus,
    FaTrashAlt,
    FaHome,
    FaBuilding,
    FaMapPin
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ ORDER TYPE
interface OrderType {
    id: string;
    date: string;
    total: number;
    items: number;
    status: string;
    products: any[];
    shippingAddress: string;
    paymentMethod: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
}

// ✅ ADDRESS TYPE
interface AddressType {
    id: number;
    label: string;
    address: string;
    city: string;
    zipCode: string;
    isDefault: boolean;
}

const UserProfilePage = () => {
    const { user, isLoggedIn, logout, updateUser } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();

    // ✅ Edit mode state
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    // ✅ Address state
    const [addresses, setAddresses] = useState<AddressType[]>(() => {
        const savedAddresses = localStorage.getItem('userAddresses');
        return savedAddresses ? JSON.parse(savedAddresses) : [];
    });

    // ✅ Add address modal
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        label: 'Home',
        address: '',
        city: '',
        zipCode: '',
    });

    // ✅ Orders state
    const [orders, setOrders] = useState<OrderType[]>(() => {
        const savedOrders = localStorage.getItem('userOrders');
        return savedOrders ? JSON.parse(savedOrders) : [];
    });

    // ✅ Toast notifications
    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        if (type === 'success') toast.success(message);
        else if (type === 'error') toast.error(message);
        else toast.info(message);
    };

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    // ✅ Save addresses to localStorage
    useEffect(() => {
        localStorage.setItem('userAddresses', JSON.stringify(addresses));
    }, [addresses]);

    if (!isLoggedIn || !user) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewAddress({
            ...newAddress,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveProfile = () => {
        updateUser(formData);
        setIsEditing(false);
        showToast('Profile updated successfully!', 'success');
    };

    const handleCancelEdit = () => {
        setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
        });
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        showToast('Logged out successfully!', 'info');
        navigate('/');
    };

    // ✅ Add Address
    const handleAddAddress = () => {
        if (!newAddress.address || !newAddress.city) {
            showToast('Please fill address and city!', 'error');
            return;
        }

        const address: AddressType = {
            id: Date.now(),
            label: newAddress.label,
            address: newAddress.address,
            city: newAddress.city,
            zipCode: newAddress.zipCode,
            isDefault: addresses.length === 0,
        };

        setAddresses([...addresses, address]);
        setShowAddAddress(false);
        setNewAddress({ label: 'Home', address: '', city: '', zipCode: '' });
        showToast('Address added successfully!', 'success');
    };

    // ✅ Delete Address
    const handleDeleteAddress = (id: number) => {
        const updatedAddresses = addresses.filter(addr => addr.id !== id);
        setAddresses(updatedAddresses);
        showToast('Address removed!', 'info');
    };

    // ✅ Set Default Address
    const handleSetDefault = (id: number) => {
        const updatedAddresses = addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id,
        }));
        setAddresses(updatedAddresses);
        showToast('Default address updated!', 'success');
    };

    const getOrderStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'text-green-500 bg-green-50';
            case 'shipped': return 'text-blue-500 bg-blue-50';
            case 'processing': return 'text-yellow-500 bg-yellow-50';
            case 'cancelled': return 'text-red-500 bg-red-50';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    const getOrderStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered': return <FaCheckCircle className="text-green-500" />;
            case 'shipped': return <FaTruck className="text-blue-500" />;
            case 'processing': return <FaClock className="text-yellow-500" />;
            default: return <FaClock className="text-gray-500" />;
        }
    };

    // ✅ Get label icon
    const getLabelIcon = (label: string) => {
        switch (label) {
            case 'Home': return <FaHome className="text-primary" />;
            case 'Office': return <FaBuilding className="text-blue-500" />;
            default: return <FaMapPin className="text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-[65px] py-10">
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div className="container mx-auto px-4 max-w-6xl">

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* ===== LEFT SIDEBAR ===== */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-[80px] border border-gray-100">
                            
                            {/* User Avatar */}
                            <div className="flex flex-col items-center text-center border-b border-gray-100 pb-6">
                                <div className="w-28 h-28 bg-gradient-to-br from-[#b76e7945] to-[#b76e790a] rounded-full flex items-center justify-center text-primary text-5xl mb-4 border-4 border-[#b76e792b]">
                                    <FaUserCircle />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                                <p className="text-gray-500 text-sm">{user.email}</p>
                                <span className="mt-2 px-4 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                                    ● Active
                                </span>
                            </div>

                            {/* Navigation Links */}
                            <div className="py-6 border-b border-gray-100 space-y-1">
                                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 bg-[#b76e7922] text-primary rounded-xl font-medium transition">
                                    <FaUser className="text-sm" />
                                    <span>My Profile</span>
                                </Link>
                                <Link to="/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition text-gray-600 hover:text-gray-800">
                                    <FaShoppingBag className="text-sm" />
                                    <span>My Orders</span>
                                    <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                                        {orders.length}
                                    </span>
                                </Link>
                                <Link to="/wishlist" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition text-gray-600 hover:text-gray-800">
                                    <FaHeart className="text-sm" />
                                    <span>Wishlist</span>
                                </Link>
                            </div>

                            {/* Logout Button */}
                            <div className="pt-6">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex cursor-pointer  items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-50 to-red-100 text-red-600 rounded-xl hover:from-red-100 hover:to-red-200 transition font-medium"
                                >
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ===== RIGHT CONTENT ===== */}
                    <div className="lg:w-3/4 space-y-6 mt-[16px]">
                      
                        {/* ===== PROFILE INFO ===== */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <FaUser className="text-primary text-sm" />
                                    </div>
                                    Personal Information
                                </h3>
                                
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex cursor-pointer items-center gap-2 text-primary hover:text-[#b76e79d6] font-medium bg-[#b76e7911] px-4 py-2 rounded-lg hover:bg-[#b76e7920] transition"
                                    >
                                        <FaEdit />
                                        <span>Edit</span>
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="flex items-center cursor-pointer gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-[#b76e79e3] transition"
                                        >
                                            <FaSave />
                                            <span>Save</span>
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="flex items-center cursor-pointer gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                                        >
                                            <FaTimes />
                                            <span>Cancel</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <FaUser className="inline mr-2 text-primary" />
                                        Full Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#b76e793c] transition"
                                            placeholder="Enter your name"
                                        />
                                    ) : (
                                        <p className="p-3 bg-gray-50 rounded-xl text-gray-800 font-medium">{user.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <FaEnvelope className="inline mr-2 text-primary" />
                                        Email Address
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#b76e793e] transition"
                                            placeholder="Enter your email"
                                        />
                                    ) : (
                                        <p className="p-3 bg-gray-50 rounded-xl text-gray-600">{user.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <FaPhone className="inline mr-2 text-primary" />
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#b76e7937] transition"
                                            placeholder="03XX-XXXXXXX"
                                        />
                                    ) : (
                                        <p className="p-3 bg-gray-50 rounded-xl text-gray-600">
                                            {user.phone || 'Not provided'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ===== ADDRESSES SECTION ===== */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-[#b76e792c] rounded-lg flex items-center justify-center">
                                        <FaMapMarkerAlt className="text-primary text-sm" />
                                    </div>
                                    Saved Addresses
                                </h3>
                                <button
                                    onClick={() => setShowAddAddress(true)}
                                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-[#b76e79d7] transition cursor-pointer"
                                >
                                    <FaPlus className="text-sm" />
                                    <span>Add Address</span>
                                </button>
                            </div>

                            {addresses.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-xl">
                                    <FaMapMarkerAlt className="text-5xl text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No addresses saved yet</p>
                                    <p className="text-gray-400 text-sm">Add your shipping addresses for faster checkout</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map((addr) => (
                                        <div key={addr.id} className={`border-2 rounded-xl p-4 transition ${addr.isDefault ? 'border-primary bg-[#b76e7914]' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    {getLabelIcon(addr.label)}
                                                    <span className="font-semibold text-gray-800">{addr.label}</span>
                                                    {addr.isDefault && (
                                                        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">Default</span>
                                                    )}
                                                </div>
                                                <div className="flex gap-1">
                                                    {!addr.isDefault && (
                                                        <button
                                                            onClick={() => handleSetDefault(addr.id)}
                                                            className="text-xs text-primary hover:text-primary/80 font-medium cursor-pointer"
                                                        >
                                                            Set Default
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteAddress(addr.id)}
                                                        className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                                                    >
                                                        <FaTrashAlt className="text-sm" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm mt-2">{addr.address}</p>
                                            <p className="text-gray-500 text-sm">{addr.city}, {addr.zipCode}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ===== RECENT ORDERS ===== */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-[#b76e7935] rounded-lg flex items-center justify-center">
                                        <FaShoppingBag className="text-primary text-sm" />
                                    </div>
                                    Recent Orders
                                </h3>
                                {orders.length > 3 && (
                                    <Link to="/orders" className="text-primary hover:underline text-sm font-medium">
                                        View All →
                                    </Link>
                                )}
                            </div>

                            {orders.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl">
                                    <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
                                    <h4 className="text-xl font-medium text-gray-600">No Orders Yet</h4>
                                    <p className="text-gray-400 mt-2">Start shopping to see your orders here</p>
                                    <Link to="/" className="inline-block mt-4 bg-primary text-white px-6 py-2 rounded-xl hover:bg-[#b76e79da] transition">
                                        Start Shopping
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.slice(0, 3).map((order, index) => (
                                        <div key={index} className="border-2 border-gray-100 rounded-xl p-4 hover:border-[#b76e794b] hover:shadow-lg transition-all duration-300">
                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-bold text-gray-800">Order {order.id}</p>
                                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                                        <FaCalendarAlt className="text-xs" />
                                                        {order.date}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getOrderStatusColor(order.status)}`}>
                                                        {getOrderStatusIcon(order.status)}
                                                        <span className="ml-1 capitalize">{order.status}</span>
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-primary text-lg">Rs. {order.total}</p>
                                                    <p className="text-xs text-gray-500">{order.items} items</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ===== STATS CARDS ===== */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-[#b76e7926] to-[#b76e7913] rounded-2xl shadow-lg p-6 text-center border border-primary/10">
                                <p className="text-3xl font-bold text-primary">{orders.length}</p>
                                <p className="text-sm text-gray-600 mt-1">Total Orders</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-2xl shadow-lg p-6 text-center border border-blue-100">
                                <p className="text-3xl font-bold text-blue-500">{totalItems}</p>
                                <p className="text-sm text-gray-600 mt-1">Cart Items</p>
                            </div>
                            <div className="bg-gradient-to-br from-pink-50 to-pink-100/30 rounded-2xl shadow-lg p-6 text-center border border-pink-100">
                                <p className="text-3xl font-bold text-pink-500">{addresses.length}</p>
                                <p className="text-sm text-gray-600 mt-1">Saved Addresses</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100/30 rounded-2xl shadow-lg p-6 text-center border border-green-100">
                                <p className="text-3xl font-bold text-green-500">Active</p>
                                <p className="text-sm text-gray-600 mt-1">Account Status</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== ADD ADDRESS MODAL ===== */}
            {showAddAddress && (
                <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-primary" />
                                Add New Address
                            </h3>
                            <button
                                onClick={() => setShowAddAddress(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                            >
                                <FaTimes className="text-xl" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address Label</label>
                                <select
                                    name="label"
                                    value={newAddress.label}
                                    onChange={handleAddressChange}
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                                >
                                    <option value="Home">🏠 Home</option>
                                    <option value="Office">🏢 Office</option>
                                    <option value="Other">📍 Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={newAddress.address}
                                    onChange={handleAddressChange}
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                                    placeholder="House #, Street, Area"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={newAddress.city}
                                    onChange={handleAddressChange}
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                                    placeholder="Enter your city"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={newAddress.zipCode}
                                    onChange={handleAddressChange}
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                                    placeholder="75000"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleAddAddress}
                                className="flex-1 cursor-pointer bg-primary text-white py-3 rounded-xl font-medium hover:bg-[#b76e79db] transition"
                            >
                                Add Address
                            </button>
                            <button
                                onClick={() => setShowAddAddress(false)}
                                className="flex-1 cursor-pointer bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfilePage;