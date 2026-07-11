// src/pages/productDetails/Component/AddReviewModal.tsx
import React, { useState } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { customerName: string; message: string; Rating: number }) => void;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [customerName, setCustomerName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !message.trim()) {
      alert('Please fill all fields');
      return;
    }
    onSubmit({ customerName, message, Rating: rating });
    setCustomerName('');
    setMessage('');
    setRating(5);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Write a Review</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Rating */}
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

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition resize-none"
              placeholder="Write your review here..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#B76E79] text-white py-3 rounded-xl font-semibold hover:bg-[#B76E79]/90 transition cursor-pointer"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;