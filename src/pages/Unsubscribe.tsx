// src/pages/Unsubscribe.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Unsubscribe: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnsubscribe = async () => {
      if (!email) {
        setStatus('error');
        setMessage('No email provided');
        return;
      }

      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/subscribers/unsubscribe?email=${encodeURIComponent(email)}`);
        
        // ✅ Check if response is ok
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to unsubscribe');
        }

        setStatus('success');
        setMessage('You have been unsubscribed successfully');
        
      } catch (error: any) {
        console.error('Unsubscribe error:', error);
        setStatus('error');
        setMessage(error.message || 'Something went wrong');
      }
    };

    handleUnsubscribe();
  }, [email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-[65px] px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B76E79] border-t-transparent mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Processing...</h2>
            <p className="text-gray-500 mt-2">Please wait</p>
          </>
        )}

        {status === 'success' && (
          <>
            <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Unsubscribed Successfully!</h2>
            <p className="text-gray-500 mt-2">{message}</p>
            <p className="text-gray-400 text-sm mt-1">We're sorry to see you go!</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 bg-[#B76E79] text-white px-6 py-2 rounded-xl hover:bg-[#B76E79]/90 transition cursor-pointer"
            >
              Back to Home
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <FaTimesCircle className="text-5xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Something Went Wrong</h2>
            <p className="text-gray-500 mt-2">{message}</p>
            {email && (
              <p className="text-gray-400 text-sm mt-1">Email: {email}</p>
            )}
            <button
              onClick={() => navigate('/')}
              className="mt-6 bg-[#B76E79] text-white px-6 py-2 rounded-xl hover:bg-[#B76E79]/90 transition cursor-pointer"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;