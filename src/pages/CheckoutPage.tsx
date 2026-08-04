// src/pages/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './context/cartContext';
import { useAuth } from '../Auth/authContext';
import { createOrder } from '../services/orderService';
import { 
  FaUser, 
  FaMapMarkerAlt, 
  FaBuilding,
  FaHome,
  FaMapPin,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaCreditCard,
  FaMoneyBillWave,
  FaMobileAlt,
  FaCheckCircle,
  FaPlus,
  FaTimes
} from 'react-icons/fa';
import { FiShoppingCart, FiClock } from 'react-icons/fi';

interface AddressType {
  id: number;
  label: string;
  address: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { 
    cart, 
    totalPrice, 
    buyNowProduct, 
    clearBuyNow, 
    clearCart,
    totalItems
  } = useCart();

  // Get saved addresses from localStorage
  const [savedAddresses, setSavedAddresses] = useState<AddressType[]>(() => {
    const addresses = localStorage.getItem('userAddresses');
    return addresses ? JSON.parse(addresses) : [];
  });

  // Save addresses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userAddresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'cod',
  });

  // Selected address type: 'saved' or 'new'
  const [addressType, setAddressType] = useState<'saved' | 'new'>(
    savedAddresses.length > 0 ? 'saved' : 'new'
  );
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    savedAddresses.find(addr => addr.isDefault)?.id || null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  
  // State for new address form in checkout
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddressData, setNewAddressData] = useState({
    label: 'Home',
    address: '',
    city: '',
    zipCode: '',
  });

  const isBuyNow = buyNowProduct !== null;
  const checkoutProducts = isBuyNow ? [buyNowProduct] : cart;
  const checkoutTotal = isBuyNow 
    ? buyNowProduct.price * buyNowProduct.quantity 
    : totalPrice;

  // Redirect if no products
  useEffect(() => {
    if (checkoutProducts.length === 0 || !checkoutProducts[0]) {
      navigate('/order-success');
    }
  }, [checkoutProducts, navigate]);

  // ✅ FIX: Auto-fill form when user is logged in
  useEffect(() => {
    if (user && isLoggedIn) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user, isLoggedIn]);

  // Auto-fill address when saved address is selected
  useEffect(() => {
    if (addressType === 'saved' && selectedAddressId) {
      const selected = savedAddresses.find(addr => addr.id === selectedAddressId);
      if (selected) {
        setFormData(prev => ({
          ...prev,
          address: selected.address,
          city: selected.city,
          zipCode: selected.zipCode,
        }));
      }
    }
  }, [selectedAddressId, addressType, savedAddresses]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewAddressData({
      ...newAddressData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressTypeChange = (type: 'saved' | 'new') => {
    setAddressType(type);
    if (type === 'new') {
      setFormData(prev => ({
        ...prev,
        address: '',
        city: '',
        zipCode: '',
      }));
      setShowNewAddressForm(true);
    } else if (type === 'saved' && selectedAddressId) {
      const selected = savedAddresses.find(addr => addr.id === selectedAddressId);
      if (selected) {
        setFormData(prev => ({
          ...prev,
          address: selected.address,
          city: selected.city,
          zipCode: selected.zipCode,
        }));
      }
      setShowNewAddressForm(false);
    }
  };

  // Function to save address from checkout
  const handleSaveNewAddress = () => {
    if (!newAddressData.address || !newAddressData.city) {
      alert('Please fill address and city!');
      return;
    }

    const newAddress: AddressType = {
      id: Date.now(),
      label: newAddressData.label,
      address: newAddressData.address,
      city: newAddressData.city,
      zipCode: newAddressData.zipCode,
      isDefault: savedAddresses.length === 0,
    };

    setSavedAddresses([...savedAddresses, newAddress]);
    setSelectedAddressId(newAddress.id);
    setFormData(prev => ({
      ...prev,
      address: newAddress.address,
      city: newAddress.city,
      zipCode: newAddress.zipCode,
    }));
    setShowNewAddressForm(false);
    setNewAddressData({ label: 'Home', address: '', city: '', zipCode: '' });
    alert('Address saved successfully!');
  };

  // ✅ MAIN FIX: Handle form submission WITHOUT login check
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ Validate all required fields
    if (!formData.name.trim()) {
      setOrderError('Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      setOrderError('Please enter your email address');
      return;
    }
    if (!formData.email.includes('@')) {
      setOrderError('Please enter a valid email address');
      return;
    }
    if (!formData.phone.trim()) {
      setOrderError('Please enter your phone number');
      return;
    }
    if (!formData.address.trim()) {
      setOrderError('Please enter your shipping address');
      return;
    }
    if (!formData.city.trim()) {
      setOrderError('Please enter your city');
      return;
    }

    setIsSubmitting(true);
    setOrderError('');

    try {
      const orderData = {
        products: checkoutProducts.map((item: any) => ({
          productId: item._id || item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity || 1,
          mainImage: item.mainImage,
        })),
        totalAmount: checkoutTotal + 200,
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        paymentMethod: formData.paymentMethod,
        // ✅ Send user info if logged in, else null (guest)
        userId: isLoggedIn && user ? user.id : null,
        isGuest: !isLoggedIn,
      };

      // ✅ Call order service (will handle both logged-in and guest)
      await createOrder(orderData);
      
      // Trigger order update event
      window.dispatchEvent(new Event('order-updated'));

      // Clear cart/buy now
      if (isBuyNow) {
        clearBuyNow();
      } else {
        clearCart();
      }
      
      // ✅ Navigate to success page
      navigate('/order-success');
    } catch (error: any) {
      console.error('Order error:', error);
      setOrderError(error.message || 'Order failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const getLabelIcon = (label: string) => {
    switch (label) {
      case 'Home': return <FaHome className="text-[#B76E79]" />;
      case 'Office': return <FaBuilding className="text-[#B76E79]" />;
      default: return <FaMapPin className="text-[#B76E79]" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-6xl mt-[65px]">
        <div className="flex flex-col-reverse lg:flex-row gap-8">
          
          {/* ===== LEFT SIDE - FORM ===== */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">   

              {/* ===== CUSTOMER INFO ===== */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 bg-[#B76E79]/10 rounded-lg flex items-center justify-center">
                    <FaUser className="text-[#B76E79] text-sm" />
                  </span>
                  Customer Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/20 transition"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/20 transition"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/20 transition"
                      placeholder="03XX-XXXXXXX"
                    />
                  </div>
                </div>
              </div>

              {/* ===== ADDRESS SECTION ===== */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 bg-[#B76E79]/10 rounded-lg flex items-center justify-center">
                    <FaMapMarkerAlt className="text-[#B76E79] text-sm" />
                  </span>
                  Shipping Address
                </h3>

                {/* ✅ Show saved addresses ONLY if logged in AND have saved addresses */}
                {isLoggedIn && savedAddresses.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleAddressTypeChange('saved')}
                        className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer hover:scale-105 ${
                          addressType === 'saved'
                            ? 'bg-[#B76E79] text-white shadow-lg shadow-[#B76E79]/30'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <FaHome className="inline mr-2" />
                        Saved Address
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddressTypeChange('new')}
                        className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer hover:scale-105 ${
                          addressType === 'new'
                            ? 'bg-[#B76E79] text-white shadow-lg shadow-[#B76E79]/30'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <FaPlus className="inline mr-2" />
                        New Address
                      </button>
                    </div>

                    {/* Saved Addresses List */}
                    {addressType === 'saved' && (
                      <div className="space-y-2">
                        {savedAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                              selectedAddressId === addr.id
                                ? 'border-[#B76E79] bg-[#B76E79]/5 shadow-md'
                                : 'border-gray-200 hover:border-[#B76E79]/50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {getLabelIcon(addr.label)}
                              <span className="font-semibold text-gray-800">{addr.label}</span>
                              {addr.isDefault && (
                                <span className="text-xs bg-[#B76E79]/10 text-[#B76E79] px-2 py-0.5 rounded-full font-medium">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{addr.address}</p>
                            <p className="text-gray-400 text-sm">{addr.city}, {addr.zipCode}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* NEW ADDRESS FORM (for logged in users) */}
                    {addressType === 'new' && showNewAddressForm && (
                      <div className="mt-4 p-4 border-2 border-[#B76E79]/30 rounded-xl bg-[#B76E79]/5">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-gray-800">Add New Address</h4>
                          <button
                            type="button"
                            onClick={() => {
                              setShowNewAddressForm(false);
                              setAddressType('saved');
                            }}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                          >
                            <FaTimes />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address Label</label>
                            <select
                              name="label"
                              value={newAddressData.label}
                              onChange={handleNewAddressChange}
                              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] cursor-pointer"
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
                              value={newAddressData.address}
                              onChange={handleNewAddressChange}
                              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] cursor-pointer"
                              placeholder="House #, Street, Area"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                              <input
                                type="text"
                                name="city"
                                value={newAddressData.city}
                                onChange={handleNewAddressChange}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] cursor-pointer"
                                placeholder="City"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                              <input
                                type="text"
                                name="zipCode"
                                value={newAddressData.zipCode}
                                onChange={handleNewAddressChange}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] cursor-pointer"
                                placeholder="75000"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleSaveNewAddress}
                            className="w-full bg-[#B76E79] text-white py-2.5 rounded-xl font-medium hover:bg-[#B76E79]/90 transition cursor-pointer"
                          >
                            Save Address
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}

                {/* ✅ Always show address form for:
                    1. Guest users (not logged in)
                    2. Logged in but no saved addresses
                    3. When "New Address" is selected
                */}
                {(!isLoggedIn || savedAddresses.length === 0 || addressType === 'new') && (
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/20 transition"
                          placeholder="House #, Street, Area"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/20 transition"
                          placeholder="Enter your city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/20 transition"
                          placeholder="75000"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ===== PAYMENT METHOD ===== */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 bg-[#B76E79]/10 rounded-lg flex items-center justify-center">
                    <FaCreditCard className="text-[#B76E79] text-sm" />
                  </span>
                  Payment Method
                </h3>

                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                    formData.paymentMethod === 'cod'
                      ? 'border-[#B76E79] bg-[#B76E79]/5'
                      : 'border-gray-200 hover:border-[#B76E79]/50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="w-5 h-5 accent-[#B76E79] cursor-pointer"
                    />
                    <FaMoneyBillWave className="text-2xl text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Cash on Delivery</p>
                      <p className="text-sm text-gray-400">Pay when you receive your order</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                    formData.paymentMethod === 'credit_card'
                      ? 'border-[#B76E79] bg-[#B76E79]/5'
                      : 'border-gray-200 hover:border-[#B76E79]/50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={handleChange}
                      className="w-5 h-5 accent-[#B76E79] cursor-pointer"
                    />
                    <FaCreditCard className="text-2xl text-blue-500" />
                    <div>
                      <p className="font-semibold text-gray-800">Credit Card</p>
                      <p className="text-sm text-gray-400">Visa, Mastercard, American Express</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                    formData.paymentMethod === 'jazzcash'
                      ? 'border-[#B76E79] bg-[#B76E79]/5'
                      : 'border-gray-200 hover:border-[#B76E79]/50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="jazzcash"
                      checked={formData.paymentMethod === 'jazzcash'}
                      onChange={handleChange}
                      className="w-5 h-5 accent-[#B76E79] cursor-pointer"
                    />
                    <FaMobileAlt className="text-2xl text-orange-500" />
                    <div>
                      <p className="font-semibold text-gray-800">JazzCash / EasyPaisa</p>
                      <p className="text-sm text-gray-400">Pay through mobile wallet</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {orderError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                  {orderError}
                </div>
              )}

              {/* ===== PLACE ORDER BUTTON ===== */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#B76E79] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#B76E79]/90 transition-all hover:shadow-lg hover:shadow-[#B76E79]/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FaCheckCircle />
                    Place Order
                  </span>
                )}
              </button>

              {/* Security Badges */}
              <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <FaShieldAlt className="text-green-500" /> Secure Checkout
                </span>
                <span className="flex items-center gap-1">
                  <FaTruck className="text-[#B76E79]" /> Free Shipping
                </span>
                <span className="flex items-center gap-1">
                  <FaUndo className="text-blue-500" /> Easy Returns
                </span>
              </div>
            </form>
          </div>

          {/* ===== RIGHT SIDE - ORDER SUMMARY ===== */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-[100px]">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiShoppingCart className="text-[#B76E79]" />
                Order Summary
              </h2>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {checkoutProducts.map((item: any) => (
                  <div key={item.id || item._id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                    <img 
                      src={item.mainImage} 
                      alt={item.title}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                      {!isBuyNow && (
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      )}
                    </div>
                    <p className="text-sm font-bold text-[#B76E79]">
                      Rs. {item.price * (item.quantity || 1)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
                {!isBuyNow && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">Rs. {totalPrice}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">Rs. 200</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Estimated Tax</span>
                  <span className="font-medium">Rs. 0</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span className="text-[#B76E79]">Rs. {checkoutTotal + 200}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-xl flex items-center gap-2 text-sm text-green-700">
                <FaTruck className="text-green-500" />
                <span>Free delivery on orders above Rs. 2000</span>
              </div>

              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <FiClock /> 10 day's delivery
                </span>
                <span className="flex items-center gap-1">
                  <FaShieldAlt /> 100% secure
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;