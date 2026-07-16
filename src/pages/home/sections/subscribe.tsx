// src/pages/home/sections/subscribe.tsx
import React, { useState } from 'react';
import { SlEnvolope } from "react-icons/sl";
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { subscribe } from '../../../services/subscriberService';

const Subscribe: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      setIsSuccess(false);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await subscribe(email);
      setMessage(response.message || 'Subscribed successfully! 🎉');
      setIsSuccess(true);
      setEmail('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.message || 'Failed to subscribe. Please try again.');
      setIsSuccess(false);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full bg-primary flex items-center justify-center py-[70px] px-[30px]'>
      <div className='text-white text-center flex flex-col items-center gap-4 max-w-3xl w-full'>
        
        {/* Icon */}
        <div className='rounded-full bg-white/50 w-[55px] h-[55px] flex items-center justify-center text-[22px]'>
          <SlEnvolope />
        </div>

        {/* Heading */}
        <h1 className='sm:text-[43px] text-[30px] font-semibold'>
          Join Our Fashion Circle
        </h1>
        
        {/* Description */}
        <h2 className='sm:text-[16px] text-[14px] font-light'>
          Subscribe to receive exclusive offers, style tips, and early access to new <br className='hidden sm:block' /> collections
        </h2>

        {/* Form */}
        <form onSubmit={handleSubscribe} className='flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center w-full max-w-xl'>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='rounded-full px-4 py-2 sm:py-3 sm:text-[14px] text-[12px] placeholder:text-[#3e1b038d] flex-1 outline-none focus:ring-2 focus:ring-white/50'
            placeholder='Enter Your Email'
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className='bg-white sm:text-[16px] text-[12px] cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 text-primary sm:pt-[10px] pt-[8px] sm:pb-[14px] pb-[10px] sm:px-[25px] px-[20px] rounded-full font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap'
          >
            {loading ? (
              <>
                <FaSpinner className='animate-spin' />
                Please wait...
              </>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div className={`text-sm font-medium ${
            isSuccess ? 'text-green-300' : 'text-red-300'
          }`}>
            {isSuccess && <FaCheckCircle className="inline mr-2" />}
            {message}
          </div>
        )}

        {/* Footer Text */}
        <p className='text-[12px] text-white/80'>
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

export default Subscribe;