// src/pages/home/sections/clientSays.tsx
import React, { useState, useEffect } from 'react';
import { FaQuoteLeft, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { getProducts } from '../../../services/productService';

interface ReviewType {
  id?: string;
  _id?: string;
  customerName: string;
  message: string;
  Rating: number;
  date?: string;
  mainImage?: string;
  city?: string;
  country?: string;
  productTitle?: string;
}

interface ProductType {
  _id?: string;
  id?: number;
  title: string;
  review?: ReviewType[];
}

const ClientSays: React.FC = () => {
  const [testimonials, setTestimonials] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const products = await getProducts();
        
        const allReviews = products
          .flatMap((p: ProductType) => 
            (p.review || []).map((r: ReviewType) => ({
              ...r,
              productTitle: p.title,
              country: r.country || 'Pakistan',
              city: r.city || getCityFromName(r.customerName),
            }))
          )
          .filter((r: ReviewType) => r.message && r.message.trim() !== '')
          .sort((a: ReviewType, b: ReviewType) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateB - dateA;
          });
        
        // ✅ MAXIMUM 3 REVIEWS SHOW KARO
        setTestimonials(allReviews.slice(0, 3));
        
      } catch (err: any) {
        setError(err.message || 'Failed to load reviews');
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // ✅ Get initials from name
  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // ✅ Get city from name (mock)
  const getCityFromName = (name: string) => {
    const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad'];
    console.log(name);
    return cities[Math.floor(Math.random() * cities.length)];
  };

  // ✅ Generate stars (small)
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-[10px] sm:text-xs" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 text-[10px] sm:text-xs" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400 text-[10px] sm:text-xs" />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="w-full bg-[#FFF8F5] py-[50px] flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B76E79] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-[#FFF8F5] py-[50px]">
        <div className="max-w-[1100px] mx-auto text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="w-full bg-[#FFF8F5] py-[50px]">
        <div className="max-w-[1100px] mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            What Our Customers Say
          </h1>
          <p className="text-gray-400">No reviews yet. Be the first to review!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFF8F5] py-[50px] sm:py-[60px]">
      <div className="max-w-[1100px] mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-sans text-2xl sm:text-[40px] text-gray-800 leading-8">
            What Our Customers Say
          </h1>
          <p className="text-gray-400 text-xs sm:text-lg ">Real reviews from real customers</p>
          <div className="w-16 h-0.5 bg-[#B76E79] mx-auto mt-2 rounded-full"></div>
        </div>

        {/* ✅ 3 Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {testimonials.map((item, index) => (
            <div
              key={item.id || item._id || index}
              className="bg-white rounded-xl shadow-md p-5 sm:p-6 border border-gray-100 hover:shadow-xl transition-all hover:scale-[1.03] duration-150 flex flex-col cursor-pointer"
            >
              {/* Quote Icon */}
              <FaQuoteLeft className="text-[#B76E79] text-xl sm:text-2xl mb-3 opacity-50" />
              
              {/* Message */}
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed flex-1 line-clamp-4">
                "{item.message}"
              </p>

              {/* Profile Row */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                {/* Profile Initials */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#B76E79]/10 flex items-center justify-center text-[#B76E79] font-semibold text-xs sm:text-sm flex-shrink-0">
                  {getInitials(item.customerName)}
                </div>
                
                {/* Name & City */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                    {item.customerName || 'Anonymous'}
                  </h4>
                  <p className="text-gray-400 text-[10px] sm:text-xs truncate">
                    {item.city || 'Pakistan'}, {item.country || 'Pakistan'}
                  </p>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {renderStars(item.Rating || 5)}
                  <span className="text-[8px] sm:text-[9px] text-gray-400 ml-0.5">
                    ({item.Rating || 5}.0)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ClientSays;