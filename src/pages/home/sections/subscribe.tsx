import React from 'react'
import { SlEnvolope } from "react-icons/sl";



const Subscribe:React.FC = () => {
  return (
    <div className='w-full bg-primary flex items-center justify-center py-[70px] px-[30px]'>
     
     <div className='text-white text-center flex flex-col items-center gap-4'>

        <div className='rounded-full bg-white/50 w-[55px] h-[55px] flex items-center justify-center text-[22px]'>
          <SlEnvolope />
        </div>

        <h1 className='sm:text-[43px] text-[30px] '>
            Join Our Fashion Circle
        </h1>
        <h2 className='sm:text-[16px] text-[14px] '>
            Subscribe to receive exclusive offers, style tips, and early access to new <br /> collections
        </h2>

         <div className='flex gap-5 justify-center w-full'>
            <input type="text" className='rounded-full px-4 sm:text-[14px] text-[12px]  placeholder:text-[#3e1b038d] sm:w-[40%] w-[60%]' placeholder='Enter Your Email'/>
            <button className='bg-white sm:text-[16px] text-[12px]  cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 text-primary sm:pt-[10px] pt-[8px] sm:pb-[14px] pb-[10px] sm:px-[25px] px-[20px] rounded-full'>
              Subscribe
            </button>
         </div>

        <p className='text-[12px] text-white/80'>
            We respect your privacy. Unsubscribe at any time.
        </p>

     </div>

    </div>
  )
}

export default Subscribe