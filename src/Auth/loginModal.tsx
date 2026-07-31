import React, { useState } from 'react';
import Input from '../components/input';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useAuth } from './authContext';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { loginWithGoogle } from '../services/socialAuthService';
import { RxCrossCircled } from "react-icons/rx";

interface LoginProps {
    hideLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
    showSignUpModal: React.Dispatch<React.SetStateAction<boolean>>;
    isOpenLoginModal: boolean;
} 

const LoginModal: React.FC<LoginProps> = ({ hideLoginModal, isOpenLoginModal, showSignUpModal }) => {
   
  const { login: loginContext, loginWithSocialData } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [signWithFacebook, setSignWithFacebook] = useState(false);

  const handleOpenSignupModel = () => {
    hideLoginModal(false);
    showSignUpModal(true);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await login({ email, password });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      loginContext(email, password);
      
      hideLoginModal(false);
      
      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
      
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FIXED Google Login Handler
 const handleGoogleLogin = async () => {
  try {
    setIsLoading(true);
    setError('');

    const data = await loginWithGoogle();

    if (!data || !data.token) {
      throw new Error('No token received from server');
    }

    // ✅ Context ko update karo — yahi missing step tha
    loginWithSocialData(data);

    hideLoginModal(false);

    // ✅ navigate() use karo — full reload (window.location.href) ki zaroorat nahi
    // kyunki context state ab already updated hai
    if (data.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/profile');
    }

  } catch (error: any) {
    console.error('❌ Google login error:', error);
    setError(error.message || 'Google login failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


     const faceBookSignAlert = () => {
         setSignWithFacebook(true);
     }
         if(signWithFacebook){
            return(
                <div className='h-screen w-full bg-black/40 z-[999] backdrop-blur-[1px] fixed top-[0%] left-[0%] transition-all duration-500'
                      onClick={() => setSignWithFacebook(false)}>
                     <div className='bg-gradient-to-tl from-[#B76E79] to-[#752f3a] absolute -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 
                                     rounded-[10px] p-[15px] text-[#ffffffcf] text-center border-[#752f3a] border-2 sm:w-[400px] sm:h-[240px] w-[280px] h-[240px] transition duration-300'>
                        
                        <div onClick={() => setSignWithFacebook(false)}
                             className='text-[30px] absolute right-[-38px] top-[-20px] cursor-pointer'>
                            <RxCrossCircled />
                        </div>
                        
                        <h1 className='text-[26px] mb-[6px]'>😕 <br/> we are sorry . </h1>
                           <p>
                            Continue with Facebook is temporarily unavailable,
                           Please use your Google account or Email address to sign in.
                           </p>
                     </div>
                </div>
            )
         };

  return (
    <div className={`fixed top-0 ${isOpenLoginModal ? "min-h-screen w-screen z-[9999]" : "hidden"}`}>
      <div onClick={() => hideLoginModal(false)}
        className='bg-black/30 absolute w-full h-full'>
      </div>

      <div className={`bg-white absolute left-1/2 sm:-translate-y-1/2 -translate-x-1/2 py-[25px] px-[20px] 
                        sm:rounded-2xl sm:w-[360px] sm:max-w-[360px] sm:w-[95%] w-full top-0 sm:top-1/2 login-entry`}>
        
        <div onClick={() => hideLoginModal(false)}
          className='absolute top-[0px] right-[0px] cursor-pointer text-black p-[15px]'>
          <RxCross1 />
        </div>

        <h2 className='text-center text-[22px] font-semibold uppercase text-black'>Welcome</h2>
        <h2 className='text-center text-[13px] text-[#565554] font-semibold tracking-wider'>
          Sign in to your account
        </h2>

        <form onSubmit={handleLogin}>
          <div className='sm:mt-[20px] mt-[50px] flex flex-col sm:gap-3 gap-5'>
            <Input 
              type='email' 
              value={email}
              name='email'
              onChange={setEmail}
              placeholder='Email'
              required={true}
            />

            <Input 
              type='password' 
              name='password'
              value={password}
              onChange={setPassword}
              placeholder='Password'
              required={true}
            />       
          </div>

          {error && (
            <div className='bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mt-2'>
              {error}
            </div>
          )}
           
          <div className='flex sm:my-[12px] my-[16px]'>
            <input type="checkbox" className='cursor-pointer'/>
            <p className='ml-[5px] text-[14px]'>Remember Me</p>
            <a href="#" className='ml-auto text-black/70 font-bold text-[12px] border-b py-[1px]'>
              Forget Password?
            </a>
          </div>         

          <button 
            type='submit' 
            disabled={isLoading}
            className='sm:mt-[8px] mt-[12px] bg-primary w-full cursor-pointer rounded-full text-white font-semibold text-[14px] h-[40px] disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Logging in...' : 'LOGIN'}
          </button>

          <div className='flex justify-between items-center sm:my-[14px] my-[18px]'>
            <div className='border-b w-[32%] border-black/30'/> 
            <h2 className='text-[13px] text-black/70 font-bold'>OR LOGIN WITH</h2>
            <div className='border-b w-[32%] border-black/30'/>
          </div>

          <div className='w-full flex items-center gap-4 justify-center text-[24px] my-[12px]'>
            <FcGoogle 
              onClick={handleGoogleLogin} 
              className='cursor-pointer hover:scale-110 transition' 
            />
            <FaFacebook onClick={faceBookSignAlert}
                        className='text-[#0064E0] cursor-pointer hover:scale-110 transition'/>
          </div>

          <p className='text-center text-[12px] mt-[20px]'>
            Don't have account? 
            <span>
              <a onClick={handleOpenSignupModel}
                className='text-black font-semibold ml-[6px] border-b py-[1px] cursor-pointer hover:text-primary transition'>
                Sign up
              </a>
            </span>
          </p>
        </form>

      </div>
    </div>
  );
};

export default LoginModal;