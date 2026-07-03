import React, { useState, useEffect, useRef } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { IoHeart } from "react-icons/io5";
import { IoShareSocialOutline } from "react-icons/io5";
import { FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import { IoCheckmarkCircle } from "react-icons/io5";
import { TbTruckDelivery, TbRefresh, TbShieldCheck } from "react-icons/tb";
import ProductReview from './Component/productReview';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/cartContext';
import { useWishlist } from '../context/wishlistContext';
import { getProductById } from '../../services/productService';

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, setBuyNowProduct } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { id } = useParams();
  
  // ✅ State for product from backend
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        mainImage: product.mainImage
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
      addToWishlist(product);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B76E79] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='text-center py-20'>
        <h1 className='text-2xl text-red-500'>{error || 'Product not found!'}</h1>
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
              
              {/* Main Image Container */}
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
                
                {/* Swipe Indicator */}
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

                {/* Image counter on mobile */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full sm:hidden">
                  {allImages.indexOf(selectedImage) + 1} / {allImages.length}
                </div>
                
                {/* Discount Badge */}
                {product.discount && product.discount > 0 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
                    -{product.discount}% OFF
                  </span>
                )}
                
                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  className="absolute cursor-pointer top-4 right-4 bg-white/50 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 z-10"
                >
                  {isLiked ? (
                    <IoHeart className="text-primary text-xl" />
                  ) : (
                    <FaRegHeart className="text-black text-xl" />
                  )}
                </button>
                

                {/* Mobile Thumbnails */}
                <div className="absolute sm:top-4 sm:right-16 top-1/2 -translate-y-1/2 right-6 flex flex-col gap-2 z-10 sm:hidden">
                  {allImages.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`w-12 h-12 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedImage === img
                          ? 'border-[#B76E79] shadow-md'
                          : 'border-white/80 hover:border-[#B76E79]/50'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Thumbnails */}
              <div className="hidden sm:flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImage === img
                        ? 'border-[#B76E79] shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ===== RIGHT SIDE - PRODUCT INFO ===== */}
            <div className="sm:space-y-6 space-y-1 p-4">
              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {renderStars(product.Rating || 5)}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.Rating || 5}.0)
                </span>
                <span className="text-sm text-gray-400">|</span>
                <span className="text-sm text-gray-500">
                  {product.review?.length || 0} Reviews
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-[#B76E79]">
                  Rs. {product.price}
                </span>
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

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {product.details}
              </p>

              {/* Quantity Selector - Hidden on mobile */}
              <div className="hidden sm:flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange('decrement')}
                    className="px-4 py-2 hover:bg-gray-50 transition cursor-pointer text-gray-600 hover:text-primary"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-12 text-center font-semibold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange('increment')}
                    className="px-4 py-2 hover:bg-gray-50 transition cursor-pointer text-gray-600 hover:text-primary"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* Action Buttons - Hidden on mobile */}
              <div className="hidden sm:flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#B76E79] cursor-pointer text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-[#B76E79]/90 transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <FiShoppingCart className="text-lg" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r cursor-pointer from-green-400 to-green-500 text-white py-3.5 px-6 rounded-xl font-semibold hover:from-green-500 hover:to-green-600 transition-all hover:shadow-lg"
                >
                  Buy Now
                </button>
              </div>

              {/* Delivery & Service Info */}
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

              {/* Share & Actions */}
              <div className="flex items-center gap-4 pt-2">
                <button className="flex items-center gap-2 text-gray-500 hover:text-[#B76E79] transition text-sm cursor-pointer">
                  <IoShareSocialOutline className="text-lg" />
                  Share
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
                  Reviews ({product.review?.length || 0})
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
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>Customer Reviews</span>
              <span className="text-sm font-normal text-gray-400">
                ({product.review?.length || 0} reviews)
              </span>
            </h3>

            {product.review && product.review.length > 0 ? (
              <div className="space-y-4">
                {product.review.map((item: any) => (
                  <ProductReview
                    key={item.id}
                    customerName={item.customerName}
                    message={item.message}
                    mainImage={item.mainImage}
                    moreImages={item.moreImages}
                    Rating={item.Rating}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>
      </div>

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
            <span className="w-8 text-center font-semibold text-gray-800 text-sm">
              {quantity}
            </span>
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
            {isLiked ? (
              <IoHeart className="text-primary text-xl" />
            ) : (
              <FaRegHeart className="text-gray-700 text-xl" />
            )}
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