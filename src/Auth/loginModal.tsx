import React, { useState } from 'react'
import Input from '../components/input'
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";


interface LoginProps {
    hideLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
    showSignUpModal: React.Dispatch<React.SetStateAction<boolean>>;
    isOpenLoginModal: boolean;
} 


const LoginModal:React.FC<LoginProps> = ({hideLoginModal,isOpenLoginModal,showSignUpModal}) => {
   
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
const handleOpenSignupModel = () => {
      hideLoginModal(false);
      showSignUpModal(true);
}

  
  return (
    <div className={`${isOpenLoginModal ? "fixed min-h-screen w-screen z-[9999]" : "hidden"}`}>
    <div onClick={() => hideLoginModal(false)}
        className='bg-black/30 absolute w-full h-full'>
    </div>


     <div className={`bg-white absolute left-1/2 -translate-y-1/2 -translate-x-1/2 py-[25px] px-[20px] 
                       rounded-2xl sm:w-[360px] max-w-[360px] w-[95%] login-entry`}>

                        
     <div  onClick={() => hideLoginModal(false)}
           className='absolute top-[0px] right-[0px] cursor-pointer text-black p-[15px]'>
      <RxCross1 />
     </div>

        <h2 className='text-center text-[22px] font-semibold uppercase text-black'>
             Welcome 
        </h2>
        <h2  className='text-center text-[13px] text-[#565554] font-semibold tracking-wider'>
            Sign in to your account
        </h2>

        <form action="">
          
          <div className='mt-[20px] flex flex-col gap-3'>
          <Input type='email' 
                 value={email}
                 name='email'
                 onChange={setEmail}
                 placeholder='Email'
                 required={true}
                 />

          <Input type='password' 
                 name='password'
                 value={password}
                 onChange={setPassword}
                 placeholder='Password'
                 required={true}
                 />       
                 
         
          </div>
           
        <div className='flex my-[12px]'>
            <input type="checkbox" className='cursor-pointer'/>
            <p className='ml-[5px] text-[14px]'>Remamber Me</p>
            <a href="#"
                className='ml-auto text-black/70 font-bold text-[12px] border-b py-[1px]'>
                Forget Password?
            </a>
        </div>         

         <button type='submit' 
                 className='mt-[8px] bg-primary w-full cursor-pointer rounded-full text-white font-semibold text-[14px] h-[40px]'>
             LOGIN
         </button>

         <div className='flex justify-between items-center my-[14px]'>
    
          <div className='border-b w-[32%] border-black/30'/>
          <h2 className='text-[13px] text-black/70 font-bold'>
            OR LOGIN WITH
          </h2>
          <div className='border-b w-[32%] border-black/30'/>
          
         </div>

         <div className='w-full flex items-center gap-4 justify-center text-[24px] my-[12px]'>
          <FcGoogle  className='cursor-pointer'/>
          <FaFacebook className='text-[#0064E0] cursor-pointer'/>
         </div>


          <p className='text-center text-[12px] mt-[20px]'>
            Don't have account? 
            <span>
                <a onClick={handleOpenSignupModel}
                   className='text-black font-semibold ml-[6px] border-b py-[1px] cursor-pointer'>
                    Sign up
                 </a>
            </span>
          </p>

        </form>

     </div>

    </div>
  )
}

export default LoginModal