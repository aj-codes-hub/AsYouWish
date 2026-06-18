import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccessPage:React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20">
      <div className="text-center">
        <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Order Placed Successfully! 🎉</h1>
        <p className="text-gray-500 mb-6">
          Thank you for your order. We'll contact you soon.
        </p>
        <div className="space-x-4">
          <Link to="/" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">
            Continue Shopping
          </Link>
          <Link to="/orders" className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300">
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage