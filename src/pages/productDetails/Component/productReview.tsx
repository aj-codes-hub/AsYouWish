// src/pages/productDetails/Component/ProductReview.tsx
import React from 'react';
import { FaStar, FaRegStar, FaUserCircle } from 'react-icons/fa';

interface ProductReviewProps {
  customerName: string;
  message: string;
  Rating: number;
  mainImage?: string;
  moreImages?: string[];
  date?: string;
}

const ProductReview: React.FC<ProductReviewProps> = ({
  customerName,
  message,
  Rating,
  mainImage,
  moreImages,
  date,
}) => {
  // Generate star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 text-sm" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400 text-sm" />);
    }
    return stars;
  };

  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 bg-[#B76E79]/10 rounded-full flex items-center justify-center text-[#B76E79] text-lg font-semibold flex-shrink-0">
          {mainImage ? (
            <img src={mainImage} alt={customerName} className="w-full h-full rounded-full object-cover" />
          ) : (
            <FaUserCircle className="text-2xl" />
          )}
        </div>

        <div className="flex-1">
          {/* Customer Name & Rating */}
          <div className="flex items-center flex-wrap gap-2">
            <h4 className="font-semibold text-gray-800">{customerName}</h4>
            <div className="flex items-center gap-1">
              {renderStars(Rating || 5)}
            </div>
            {date && (
              <span className="text-xs text-gray-400 ml-auto">{date}</span>
            )}
          </div>

          {/* Review Message */}
          <p className="text-gray-600 text-sm mt-1 leading-relaxed">
            {message}
          </p>

          {/* More Images (if any) */}
          {moreImages && moreImages.length > 0 && (
            <div className="flex gap-2 mt-2">
              {moreImages.slice(0, 3).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Review ${idx + 1}`}
                  className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReview;