import React, { useState, useEffect, useRef } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { IoHeart } from "react-icons/io5";
import { IoShareSocialOutline } from "react-icons/io5";
import { FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import { IoCheckmarkCircle } from "react-icons/io5";
import { TbTruckDelivery, TbRefresh, TbShieldCheck } from "react-icons/tb";
import { FaFacebook, FaTwitter, FaWhatsapp, FaLink, FaCopy, FaCheckCircle } from "react-icons/fa";
import ProductReview from './Component/productReview';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/cartContext';
import { useWishlist } from '../context/wishlistContext';
import { getProductById } from '../../services/productService';
import AddReviewModal from './Component/AddReviewModal';
import LoginModal from '../../Auth/loginModal';
import SignupModal from '../../Auth/signupModal';

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, setBuyNowProduct } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { id } = useParams();
  
  // ✅ State for product from backend
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignUpModal, setOpenSignUpModal] = useState(false);

  // ✅ Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // ✅ FIX 1: Initialize reviews as empty array
  const [reviews, setReviews] = useState<any[]>([]);

  // State for quantity
  const [quantity, setQuantity] = useState(1);

  // State for selected image
  const [selectedImage, setSelectedImage] = useState('');

  // Check if product is in wishlist
  const isLiked = product ? isInWishlist(product._id || product.id) : false;

  // ✅ Swipe state
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // ✅ Fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id!);
        setProduct(data);
        setSelectedImage(data.mainImage);
        setReviews((data as any).review || []);
      } catch (err: any) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Handle quantity change
  const handleQuantityChange = (type: 'increment' | 'decrement') => {
    if (type === 'increment') {
      setQuantity(prev => prev + 1);
    } else {
      setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    }
  };

  // Handle Buy Now
  const handleBuyNow = () => {
    if (product) {
      setBuyNowProduct({
        id: product._id || product.id,
        title: product.title,
        price: product.price,
        quantity: quantity,
        mainImage: product.mainImage,
      });
      navigate('/checkout');
    }
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      const productId = product._id || product.id;
      if (isInWishlist(productId)) {
        removeFromWishlist(productId);
      } else {
        addToWishlist({
          id: product._id || product.id,
          _id: product._id || product.id,
          title: product.title,
          price: product.price,
          mainImage: product.mainImage,
          discount: product.discount || 0,
          DiscountPrice: product.discount
            ? Math.round(product.price - (product.price * product.discount / 100))
            : product.price,
          moreImages: product.moreImages || [],
        });
      }
    }
  };

  // Generate star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }
    return stars;
  };

  // Get all images array (main + moreImages)
  const getAllImages = () => {
    if (!product) return [];
    const images = [product.mainImage];
    if (product.moreImages) {
      images.push(...product.moreImages);
    }
    return images;
  };

  const allImages = getAllImages();

  // Handle image change on swipe
  const handleImageChange = (direction: 'left' | 'right') => {
    const currentIndex = allImages.indexOf(selectedImage);
    if (direction === 'left') {
      const nextIndex = (currentIndex + 1) % allImages.length;
      setSelectedImage(allImages[nextIndex]);
    } else {
      const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
      setSelectedImage(allImages[prevIndex]);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const diff = touchStartX - touchEndX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handleImageChange('left');
      } else {
        handleImageChange('right');
      }
    }

    setTouchStartX(0);
    setTouchEndX(0);
  };

  // ✅ FIX 3: Handle Add Review
  const handleAddReview = async (reviewData: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to submit a review');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const updatedReviews = await response.json();

      setProduct((prev: any) => ({
        ...prev,
        review: updatedReviews,
      }));
      setReviews(updatedReviews);

      alert('Review submitted successfully!');
      setIsReviewModalOpen(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  // ✅ SHARE FUNCTIONS
  const getShareUrl = () => {
    return window.location.href;
  };

  const getShareText = () => {
    return `Check out ${product?.title} - Only Rs. ${product?.price} on AS YOU WISH!`;
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank', 'width=600,height=400');
    setIsShareModalOpen(false);
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank', 'width=600,height=400');
    setIsShareModalOpen(false);
  };

  const shareOnWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(getShareText() + ' ' + getShareUrl())}`;
    window.open(url, '_blank');
    setIsShareModalOpen(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
      setIsShareModalOpen(false);
    } catch (err) {
      alert('Failed to copy link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B76E79] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl text-red-500">{error || 'Product not found!'}</h1>
        <button onClick={() => navigate(-1)} className="mt-4 bg-[#B76E79] text-white px-4 py-2 rounded">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12 sm:py-12">
        {/* Main Product Section */}
        <div className="bg-white sm:rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-4 sm:p-6 lg:p-8">
            {/* ===== LEFT SIDE - PRODUCT IMAGES ===== */}
            <div className="sm:space-y-4 space-y-0">
              <div
                ref={imageContainerRef}
                className="relative bg-gray-100 sm:rounded-xl overflow-hidden aspect-square"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                />
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none sm:hidden">
                  <div className="pointer-events-auto bg-black/30 text-white p-1 rounded-full opacity-60">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                  <div className="pointer-events-auto bg-black/30 text-white p-1 rounded-full opacity-60">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full sm:hidden">
                  {allImages.indexOf(selectedImage) + 1} / {allImages.length}
                </div>
                {product.discount && product.discount > 0 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
                    -{product.discount}% OFF
                  </span>
                )}
                <button
                  onClick={handleWishlistToggle}
                  className="absolute cursor-pointer top-4 right-4 bg-white/50 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 z-10"
                >
                  {isLiked ? <IoHeart className="text-primary text-xl" /> : <FaRegHeart className="text-black text-xl" />}
                </button>
                <div className="absolute sm:top-4 sm:right-16 top-1/2 -translate-y-1/2 right-6 flex flex-col gap-2 z-10 sm:hidden">
                  {allImages.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`w-12 h-12 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedImage === img ? 'border-[#B76E79] shadow-md' : 'border-white/80 hover:border-[#B76E79]/50'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden sm:flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImage === img ? 'border-[#B76E79] shadow-md' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* ===== RIGHT SIDE - PRODUCT INFO ===== */}
            <div className="sm:space-y-6 space-y-1 p-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">{product.title}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating || 0)}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.rating ? product.rating.toFixed(1) : '0'}.0)
                </span>
                <span className="text-sm text-gray-400">|</span>
                <span className="text-sm text-gray-500">
                  {product.review?.length || 0} Reviews
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-[#B76E79]">Rs. {product.price}</span>
                {product.discount && product.discount > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      Rs. {Math.round(product.price * product.discount / 100)}
                    </span>
                    <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-gray-600 leading-relaxed">{product.details}</p>
              <div className="hidden sm:flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange('decrement')}
                    className="px-4 py-2 hover:bg-gray-50 transition cursor-pointer text-gray-600 hover:text-primary"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-12 text-center font-semibold text-gray-800">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange('increment')}
                    className="px-4 py-2 hover:bg-gray-50 transition cursor-pointer text-gray-600 hover:text-primary"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
              <div className="hidden sm:flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#B76E79] cursor-pointer text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-[#B76E79]/90 transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <FiShoppingCart className="text-lg" /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r cursor-pointer from-green-400 to-green-500 text-white py-3.5 px-6 rounded-xl font-semibold hover:from-green-500 hover:to-green-600 transition-all hover:shadow-lg"
                >
                  Buy Now
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <TbTruckDelivery className="text-2xl text-[#B76E79] mx-auto mb-1" />
                  <p className="text-xs text-gray-600 font-medium">Free Delivery</p>
                  <p className="text-[10px] text-gray-400">On orders above Rs. 2000</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <TbRefresh className="text-2xl text-[#B76E79] mx-auto mb-1" />
                  <p className="text-xs text-gray-600 font-medium">Easy Returns</p>
                  <p className="text-[10px] text-gray-400">30 days return policy</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <TbShieldCheck className="text-2xl text-[#B76E79] mx-auto mb-1" />
                  <p className="text-xs text-gray-600 font-medium">Secure Payment</p>
                  <p className="text-[10px] text-gray-400">100% secure checkout</p>
                </div>
              </div>
              
              {/* ✅ SHARE BUTTON - UPDATED */}
              <div className="flex items-center gap-4 pt-2">
                <button 
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center gap-2 text-gray-500 hover:text-[#B76E79] transition text-sm cursor-pointer"
                >
                  <IoShareSocialOutline className="text-lg" /> Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details & Reviews Section */}
        <div className="mt-8 space-y-8">
          {/* Product Details Tabs */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-100">
              <div className="flex overflow-x-auto">
                <button className="px-6 py-4 text-[#B76E79] font-semibold border-b-2 border-[#B76E79] cursor-pointer">
                  Product Details
                </button>
                <button className="px-6 py-4 text-gray-500 font-medium hover:text-gray-700 transition whitespace-nowrap cursor-pointer">
                  Specifications
                </button>
                <button className="px-6 py-4 text-gray-500 font-medium hover:text-gray-700 transition whitespace-nowrap cursor-pointer">
                  Reviews ({reviews.length || 0})
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Product Details</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3 text-gray-600">
                  <IoCheckmarkCircle className="text-[#B76E79] text-lg mt-0.5 flex-shrink-0" />
                  Premium quality fabric, soft and comfortable
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <IoCheckmarkCircle className="text-[#B76E79] text-lg mt-0.5 flex-shrink-0" />
                  Available in multiple sizes and colors
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <IoCheckmarkCircle className="text-[#B76E79] text-lg mt-0.5 flex-shrink-0" />
                  Free shipping on orders above Rs. 2000
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <IoCheckmarkCircle className="text-[#B76E79] text-lg mt-0.5 flex-shrink-0" />
                  30-day return policy for hassle-free returns
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <IoCheckmarkCircle className="text-[#B76E79] text-lg mt-0.5 flex-shrink-0" />
                  Cash on delivery available nationwide
                </li>
              </ul>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span>Customer Reviews</span>
                <span className="text-sm font-normal text-gray-400">
                  ({reviews.length || 0} reviews)
                </span>
              </h3>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-[#B76E79] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#B76E79]/90 transition cursor-pointer"
              >
                Write a Review
              </button>
            </div>

            {reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((item: any) => (
                  <ProductReview
                    key={item.id || item._id}
                    customerName={item.customerName}
                    message={item.message}
                    Rating={item.Rating}
                    date={item.date}
                    mainImage={item.mainImage}
                    moreImages={item.moreImages}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>

          <AddReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            onSubmit={handleAddReview}
            productId={product._id}
            onOpenLogin={() => setOpenLoginModal(true)} 
          />
        </div>
      </div>

      {/* ✅ SHARE MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Share this product</h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              {/* Facebook */}
              <button
                onClick={shareOnFacebook}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center text-white text-xl group-hover:scale-105 transition">
                  <FaFacebook />
                </div>
                <span className="text-xs text-gray-500">Facebook</span>
              </button>

              {/* Twitter */}
              <button
                onClick={shareOnTwitter}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-[#000000] rounded-full flex items-center justify-center text-white text-xl group-hover:scale-105 transition">
                  <FaTwitter />
                </div>
                <span className="text-xs text-gray-500">Twitter</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={shareOnWhatsApp}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white text-xl group-hover:scale-105 transition">
                  <FaWhatsapp />
                </div>
                <span className="text-xs text-gray-500">WhatsApp</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={copyToClipboard}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer group"
              >
                <div className={`w-12 h-12 ${copySuccess ? 'bg-green-500' : 'bg-gray-600'} rounded-full flex items-center justify-center text-white text-xl group-hover:scale-105 transition`}>
                  {copySuccess ? <FaCheckCircle /> : <FaCopy />}
                </div>
                <span className="text-xs text-gray-500">Copy Link</span>
              </button>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                <FaLink className="text-gray-400 text-sm" />
                <span className="text-xs text-gray-500 truncate flex-1">
                  {getShareUrl()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <LoginModal hideLoginModal={setOpenLoginModal} isOpenLoginModal={openLoginModal} showSignUpModal={setOpenSignUpModal} />
      <SignupModal hideSignUpModal={setOpenSignUpModal} isOpenSignUPModal={openSignUpModal} showLoginModal={setOpenLoginModal} />

      {/* ===== MOBILE FIXED BOTTOM BAR ===== */}
      <div className="lg:hidden fixed bottom-[60px] sm:bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-100 z-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            <button
              onClick={() => handleQuantityChange('decrement')}
              className="px-3 py-2 hover:bg-gray-50 transition text-gray-600 cursor-pointer"
            >
              <FiMinus className="text-sm" />
            </button>
            <span className="w-8 text-center font-semibold text-gray-800 text-sm">{quantity}</span>
            <button
              onClick={() => handleQuantityChange('increment')}
              className="px-3 py-2 hover:bg-gray-50 transition text-gray-600 cursor-pointer"
            >
              <FiPlus className="text-sm" />
            </button>
          </div>

          <button
            onClick={handleWishlistToggle}
            className="p-3 bg-gray-100 rounded-xl flex-shrink-0 cursor-pointer"
          >
            {isLiked ? <IoHeart className="text-primary text-xl" /> : <FaRegHeart className="text-gray-700 text-xl" />}
          </button>

          <button
            onClick={handleAddToCart}
            className="cursor-pointer flex-1 bg-[#B76E79] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#B76E79]/90 transition"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="cursor-pointer flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white py-3 rounded-xl font-semibold text-sm hover:from-green-500 hover:to-green-600 transition"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Spacer for mobile bottom bar */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
};

export default ProductDetail;