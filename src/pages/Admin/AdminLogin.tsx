import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { 
  FaUserShield, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
  FaCrown
} from 'react-icons/fa';


const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const success = adminLogin(email, password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen fixed w-screen flex items-center justify-center  z-[9999] px-4" 
         style={{ background: 'linear-gradient(135deg, #B80031 0%, #EA01DC 25%, #FFC18C 50%, #B76E79 75%, #B80031 100%)'}}>
      
      {/* ===== BACKGROUND DECORATION ===== */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#B76E79]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B76E79]/5 rounded-full blur-3xl" />
      
      {/* Decorative dots */}
      <div className="absolute top-20 right-20 grid grid-cols-3 gap-2 opacity-10">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-2 h-2 bg-[#B76E79] rounded-full" />
        ))}
      </div>
      <div className="absolute bottom-20 left-20 grid grid-cols-3 gap-2 opacity-10">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-2 h-2 bg-[#B76E79] rounded-full" />
        ))}
      </div>

      {/* ===== MAIN CARD ===== */}
      <div className="relative w-full max-w-md">
        
        {/* Card with shadow */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-[#B76E79]/10 border border-[#B76E79]/10 px-6 py-5 md:scale-[0.9]">
          
          {/* ===== HEADER ===== */}
          <div className="text-center mb-8">

          <div className='cursor-pointer md:h-[75px] md:w-[270px] h-[60px] mx-auto w-[200px] relative'
                    onClick={() => window.location.pathname='/'}>
                  <img src='/images/Logo.png' alt='LOGO'
                       className='w-full h-full'/>
          </div>

            <p className="text-[#B76E79] text-md md:text-lg font-medium tracking-wider uppercase mt-0.5">
              Admin Panel
            </p>

            {/* Divider */}
            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="w-20 h-px bg-[#B76E79]/30" />
              <FaCrown className="text-[#B76E79]/40 text-xs" />
              <div className="w-20 h-px bg-[#B76E79]/30" />
            </div>

            <p className="text-gray-400 text-sm mt-3">
              Sign in to manage your store
            </p>
          </div>

          {/* ===== FORM ===== */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <FaShieldAlt className="text-red-500" />
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#B76E79] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#FFF8F5] border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] text-gray-800 placeholder-gray-400 transition-all duration-300 focus:shadow-lg focus:shadow-[#B76E79]/10"
                  placeholder="admin@asyouwish.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#B76E79] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-[#FFF8F5] border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] text-gray-800 placeholder-gray-400 transition-all duration-300 focus:shadow-lg focus:shadow-[#B76E79]/10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-[#B76E79] cursor-pointer" />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-[#B76E79] hover:text-[#B76E79]/80 transition-colors font-medium">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative w-full group cursor-pointer overflow-hidden rounded-xl mt-2"
            >
              <div className={`absolute inset-0 bg-[#B76E79] transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`} />
              <div className="absolute inset-0 bg-[#B76E79] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              
              <div className="relative flex items-center justify-center gap-3 py-3.5 px-6 text-white font-semibold text-sm">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <FaUserShield className="text-lg" />
                    <span>Sign In</span>
                    <FaArrowRight className={`text-sm transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                  </>
                )}
              </div>
            </button>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <FaShieldAlt className="text-[#B76E79] text-sm" />
                <span>Secure Connection</span>
              </div>
              <div className="w-px h-3 bg-gray-200" />
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span>System Online</span>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-100/90 tracking-widest">
          <span>● AS YOU WISH — Admin Portal ●</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;