import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaFrown } from 'react-icons/fa';

const NotFoundPage:React.FC = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8F5] to-white px-4 pt-[65px]">
      <div className="text-center max-w-md w-full">
        
        {/* 404 with Animation */}
        <div className="relative mb-6">
          <div className="text-8xl sm:text-9xl font-bold text-[#B76E79] opacity-10 absolute inset-0 flex items-center justify-center">
            404
          </div>
          <div className="relative z-10">
            <FaFrown className="text-6xl text-gray-300 mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-gray-800">Page Not Found</h1>
          </div>
        </div>

        <p className="text-gray-500 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link 
          to="/"
          className="inline-flex items-center gap-2 bg-[#B76E79] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#B76E79]/90 transition hover:shadow-lg hover:shadow-[#B76E79]/30"
        >
          <FaHome />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;