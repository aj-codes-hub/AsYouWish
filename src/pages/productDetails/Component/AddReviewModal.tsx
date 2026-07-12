// src/pages/productDetails/Component/AddReviewModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FaStar, FaTimes, FaUpload, FaImage } from 'react-icons/fa';
import { useAuth } from '../../../Auth/authContext';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: {
    customerName: string;
    message: string;
    Rating: number;
    moreImages?: string[];
  }) => void;
  productId: string;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productId,
}) => {
  const { user, isLoggedIn } = useAuth();
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [moreImages, setMoreImages] = useState<string[]>(['', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const moreImageInputRef = useRef<HTMLInputElement>(null);

  // ✅ Auto-fill name if logged in
  useEffect(() => {
    if (isLoggedIn && user?.name) {
      setCustomerName(user.name);
    }
  }, [isLoggedIn, user]);

  if (!isOpen) return null;

  // ✅ Image compression
  const compressImage = (file: File, maxWidth: number = 300, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // ✅ More images upload
  const handleMoreImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const newMoreImages = [...moreImages];

    for (let i = 0; i < fileArray.length && i < 3; i++) {
      try {
        const compressed = await compressImage(fileArray[i]);
        const emptyIndex = newMoreImages.findIndex(img => img === '');
        if (emptyIndex !== -1) {
          newMoreImages[emptyIndex] = compressed;
        } else if (newMoreImages.length < 3) {
          newMoreImages.push(compressed);
        }
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }

    setMoreImages(newMoreImages);
  };

  // ✅ Remove more image
  const removeMoreImage = (index: number) => {
    const newImages = [...moreImages];
    newImages[index] = '';
    setMoreImages(newImages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!customerName.trim() || !message.trim()) {
      setError('Please fill all required fields');
      setIsLoading(false);
      return;
    }

    onSubmit({
      customerName,
      message,
      Rating: rating,
      moreImages: moreImages.filter(img => img.trim() !== ''),
    });

    setMessage('');
    setRating(5);
    setMoreImages(['', '', '']);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-scale-up">
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-3 border-b">
          <h3 className="text-xl font-bold text-gray-800">Write a Review</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ✅ Name - Auto-filled if logged in */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name {!isLoggedIn && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:border-[#B76E79] transition ${
                !isLoggedIn ? 'border-gray-200' : 'border-[#B76E79]/30 bg-gray-50'
              }`}
              placeholder="Enter your name"
              required={!isLoggedIn}
              disabled={!!isLoggedIn}
            />
            {isLoggedIn && (
              <p className="text-xs text-gray-400 mt-1">Logged in as {user?.name}</p>
            )}
          </div>

          {/* ✅ Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl cursor-pointer transition-transform hover:scale-110"
                >
                  <FaStar
                    className={
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                </button>
              ))}
              <span className="text-sm text-gray-500 ml-2">{rating}.0</span>
            </div>
          </div>

          {/* ✅ Review Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition resize-none"
              placeholder="Write your review here..."
              required
            />
          </div>

          {/* ✅ Only More Images Upload (No Main Image) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (Max 3, Optional)</label>
            <div className="flex items-center gap-3 mb-2">
              <input
                type="file"
                ref={moreImageInputRef}
                accept="image/*"
                multiple
                onChange={handleMoreImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => moreImageInputRef.current?.click()}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition cursor-pointer text-sm"
              >
                <FaUpload /> Upload Images
              </button>
              <span className="text-xs text-gray-400">(Hold Ctrl to select multiple)</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {moreImages.map((img, index) => (
                <div key={index} className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                  {img ? (
                    <>
                      <img src={img} alt={`Review ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeMoreImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 text-xs"
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <FaImage className="text-2xl" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#B76E79] text-white py-3 rounded-xl font-semibold hover:bg-[#B76E79]/90 transition disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;