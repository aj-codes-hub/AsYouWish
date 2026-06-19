import React, { useState } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import { IoCheckmarkCircle } from "react-icons/io5";
import { TbTruckDelivery, TbRefresh, TbShieldCheck } from "react-icons/tb";
import ProductReview from './Component/productReview';
import { Product } from '../../data/productCard/product'
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/cartContext';
import { useWishlist } from '../context/wishlistContext';

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, setBuyNowProduct } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { id } = useParams();
  const SingleProduct = Product.find(item => item.id === Number(id));

  // State for quantity
  const [quantity, setQuantity] = useState(1);

  // State for selected image
  const [selectedImage, setSelectedImage] = useState(SingleProduct?.mainImage || '');

  // Check if product is in wishlist
  const isLiked = SingleProduct ? isInWishlist(SingleProduct.id) : false;

  if (!SingleProduct) {
    return (
      <div className='text-center py-20'>
        <h1 className='text-2xl text-red-500'>Product not found!</h1>
      </div>
    );
  }

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
    setBuyNowProduct({
      id: SingleProduct.id,
      title: SingleProduct.title,
      price: SingleProduct.price,
      quantity: quantity,
      mainImage: SingleProduct.mainImage
    });
    navigate('/checkout');
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(SingleProduct);
    }
  };

  // Handle Wishlist toggle
  const handleWishlistToggle = () => {
    if (isLiked) {
      removeFromWishlist(SingleProduct.id);
    } else {
      addToWishlist(SingleProduct);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-14 sm:py-12">

        {/* Main Product Section */}
        <div className="bg-white sm:rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:p-4 sm:p-6 lg:p-8">
            
            {/* ===== LEFT SIDE - PRODUCT IMAGES ===== */}
            <div className="sm:space-y-4 space-y-0">
              
              {/* Main Image Container - Relative for thumbnails overlay */}
              <div className="relative bg-gray-100 sm:rounded-xl overflow-hidden aspect-square">
                
                {/* Main Image */}
                <img
                  src={selectedImage}
                  alt={SingleProduct.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                />
                
                {/* Discount Badge */}
                {SingleProduct.discount && SingleProduct.discount > 0 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
                    -{SingleProduct.discount}% OFF
                  </span>
                )}
                
                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  className="absolute cursor-pointer top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 z-10"
                >
                  {isLiked ? (
                    <FaHeart className="text-red-500 text-xl" />
                  ) : (
                    <FaRegHeart className="text-gray-700 text-xl" />
                  )}
                </button>

                {/* ===== MOBILE: THUMBNAILS ON TOP-RIGHT ===== */}
                <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:top-4 sm:right-6 flex flex-col gap-2 z-10 sm:hidden">
                  {/* Main image thumbnail */}
                  <div
                    onClick={() => setSelectedImage(SingleProduct.mainImage)}
                    className={`sm:w-14 sm:h-14 w-10 h-10 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImage === SingleProduct.mainImage
                        ? 'border-[#B76E79] shadow-md'
                        : 'border-white/80 hover:border-[#B76E79]/50'
                    }`}
                  >
                    <img
                      src={SingleProduct.mainImage}
                      alt="Main"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Other thumbnails */}
                  {SingleProduct.moreImages?.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`sm:w-14 sm:h-14 w-10 h-10 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedImage === image
                          ? 'border-[#B76E79] shadow-md'
                          : 'border-white/80 hover:border-[#B76E79]/50'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ===== DESKTOP: THUMBNAILS AT BOTTOM ===== */}
              <div className="hidden sm:flex gap-3 overflow-x-auto pb-2">
                <div
                  onClick={() => setSelectedImage(SingleProduct.mainImage)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImage === SingleProduct.mainImage
                      ? 'border-[#B76E79] shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={SingleProduct.mainImage}
                    alt="Main"
                    className="w-full h-full object-cover"
                  />
                </div>
                {SingleProduct.moreImages?.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImage === image
                        ? 'border-[#B76E79] shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ===== RIGHT SIDE - PRODUCT INFO ===== */}
            <div className="sm:space-y-6 space-y-2 px-4">
              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                {SingleProduct.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {renderStars(SingleProduct.Rating || 5)}
                </div>
                <span className="text-sm text-gray-500">
                  ({SingleProduct.Rating || 5}.0)
                </span>
                <span className="text-sm text-gray-400">|</span>
                <span className="text-sm text-gray-500">
                  {SingleProduct.review?.length || 0} Reviews
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-[#B76E79]">
                  Rs. {SingleProduct.price}
                </span>
                {SingleProduct.discount && SingleProduct.discount > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      Rs. {Math.round(SingleProduct.price / (1 - SingleProduct.discount / 100))}
                    </span>
                    <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                      {SingleProduct.discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {SingleProduct.details}
              </p>

              {/* Quantity Selector - Hidden on mobile (only in fixed bar) */}
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

              {/* Action Buttons - Hidden on mobile (only in fixed bar) */}
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
              <div className="flex overflow-x-auto ">
                <button className="px-6 py-4 text-[#B76E79] font-semibold border-b-2 border-[#B76E79] cursor-pointer">
                  Product Details
                </button>
                <button className="px-6 py-4 text-gray-500 font-medium hover:text-gray-700 transition whitespace-nowrap cursor-pointer">
                  Specifications
                </button>
                <button className="px-6 py-4 text-gray-500 font-medium hover:text-gray-700 transition whitespace-nowrap cursor-pointer">
                  Reviews ({SingleProduct.review?.length || 0})
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
                ({SingleProduct.review?.length || 0} reviews)
              </span>
            </h3>

            {SingleProduct.review && SingleProduct.review.length > 0 ? (
              <div className="space-y-4">
                {SingleProduct.review.map((item) => (
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
      <div className="lg:hidden sticky-bottom-40 bottom-[65px] fixed sm:bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-100 z-50 px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Quantity on mobile */}
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

          {/* Wishlist on mobile */}
          <button
            onClick={handleWishlistToggle}
            className="p-3 bg-gray-100 rounded-xl flex-shrink-0 cursor-pointer"
          >
            {isLiked ? (
              <FaHeart className="text-red-500 text-xl" />
            ) : (
              <FaRegHeart className="text-gray-700 text-xl" />
            )}
          </button>

          {/* Action Buttons - ONLY IN FIXED BAR */}
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