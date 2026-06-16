import React, { useState } from 'react'
import Input from '../components/input'
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";


interface SignupModalProps {
       hideSignUpModal: React.Dispatch<React.SetStateAction<boolean>>;
       showLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
       isOpenSignUPModal: boolean;
} 


const SignupModal:React.FC<SignupModalProps> = ({hideSignUpModal,isOpenSignUPModal,showLoginModal}) => {
 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

const handleOpenSignInModel = () => {
      hideSignUpModal(false);
      showLoginModal(true);
}


  
  return (
    <div className={`fixed min-h-screen w-screen z-[9999] top-0 ${isOpenSignUPModal ? "" : "hidden"}`}>
    <div  onClick={() => hideSignUpModal(false)}
          className='bg-black/30 absolute w-full h-full'>
    </div>


     <div className='bg-white absolute sm:top-1/2 top-0 left-1/2 sm:-translate-y-1/2 -translate-x-1/2 py-[25px] 
                       sm:rounded-2xl sm:w-[360px] sm:max-w-[360px] sm:w-[95%] w-full signup-entry'>
     <div  onClick={() => hideSignUpModal(false)}
           className='absolute top-[0px] right-[0px] cursor-pointer text-black p-[15px]'>
      <RxCross1 />
     </div>

        <h2 className='text-center text-[22px] font-semibold uppercase text-black'>
             Welcome 
        </h2>
        <h2  className='text-center text-[13px] text-[#565554] font-semibold tracking-wider'>
            Create your account
        </h2>
        
        
        <form action="">
        <div className='px-[20px] overflow-hidden overflow-y-scroll xl:hover:overflow-y-scroll xl:overflow-y-hidden  custom-scrollbar h-[390px]'>

          <div className='mt-[20px] flex flex-col gap-3'>
          <Input type='text' 
                 value={firstName}
                 name='name'
                 onChange={setFirstName}
                 placeholder='First Name'
                 required={true}
                 />
          <Input type='text' 
                 value={lastName}
                 name='name'
                 onChange={setLastName}
                 placeholder='Last Name'
                 required={true}
                 />       

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

           <Input type='password' 
                  name='Confirm password'
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder='Confirm Password'
                  required={true}
            /> 

            <Input type='text' 
                   name='Phone'
                   value={phone}
                   onChange={setPhone}
                   placeholder='Phone'
            />      
                 
         
          </div>
           
        <div className='flex my-[12px]'>
            <input type="checkbox" className='cursor-pointer'/>
            <p className='ml-[5px] text-[12px] font-semibold text-black'>Sign Up for Newsletter</p>
        </div>         

         <button type='submit' 
                 className='mt-[8px] bg-primary w-full cursor-pointer rounded-full text-white font-semibold text-[14px] h-[40px]'>
            SIGN UP
         </button>

         <p className='my-[10px] text-black/70 text-[10px] text-center'>
          By clicking "Sign Up" you agree to the "AS YOU WISH" terms
          and conditions. To see how we may use your information,
          take a look at our privacy policy.
         </p>

         <div className='flex justify-between items-center my-[14px]'>
    
          <div className='border-b w-[32%] border-black/30'/>
          <h2 className='text-[13px] text-black/70 font-bold'>
            OR SIGN-UP WITH
          </h2>
          <div className='border-b w-[32%] border-black/30'/>
          
         </div>

         <div className='w-full flex items-center gap-4 justify-center text-[24px] my-[12px]'>
          <FcGoogle  className='cursor-pointer'/>
          <FaFacebook className='text-[#0064E0] cursor-pointer'/>
         </div>

         </div>

          <p className='text-center text-[12px] mt-[20px]'>
            Already have as account? 
            <span>
                <a onClick={handleOpenSignInModel}
                   className='text-black font-semibold ml-[6px] border-b py-[1px] cursor-pointer'>
                    sign in
                 </a>
            </span>
          </p>

        </form>

     </div>

    </div>
  )
}

export default SignupModal