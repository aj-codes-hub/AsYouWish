import React from 'react'
import { FaInstagram } from "react-icons/fa";
import { FiFacebook } from "react-icons/fi";
import { TbBrandTiktok } from "react-icons/tb";
import { SlEnvolope } from "react-icons/sl";
import { LuPhone } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";



const Footer:React.FC  = () => {
  return (
    <div className='w-full px-[30px] shadow-2xl bg-white'>
        

       <div className='w-full max-w-[1100px] mx-auto flex py-[45px] grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 lg:gap-0 gap-8 justify-between'>
        
        <div className='w-[200px] sm:col-span-1 col-span-2'>
          <h1 className='text-primary font-semibold text-[20px] '>
            As you Wish 
          </h1>
         
         <p className='text-[12px] opacity-90 leading-[16px] mt-[10px]'>  
          Your destination for premium <br /> 
          women's  fashion. Elegance meets <br /> modern style.
         </p>

         <div className='mt-[14px] flex gap-2'>
          
          <div className='bg-[#FFF8F5] rounded-full h-[38px] w-[38px] flex items-center justify-center'> <FaInstagram /> </div>
          <div className='bg-[#FFF8F5] rounded-full h-[38px] w-[38px] flex items-center justify-center'> <FiFacebook /> </div>
          <div className='bg-[#FFF8F5] rounded-full h-[38px] w-[38px] flex items-center justify-center'> <TbBrandTiktok /> </div>

         </div>
      

        </div>

        <div>
          <h1>Quick Links</h1>
          
          <div className='flex flex-col text-[12px] mt-[12px] gap-2'>
            <a href="#">About us</a>
            <a href="#">Contact</a>
            <a href="#">Shoping info</a>
            <a href="#">Returns</a>
          </div>

        </div>

        <div>
          <h1>Customer Care</h1>
          
          <div className='flex flex-col text-[12px] mt-[12px] gap-2'>
            <a href="#">Size Guide</a>
            <a href="#">FAQs</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
          </div>

        </div>

        <div className='w-[200px]'>
          <h1>Get in Touch</h1>
          
          <div className='flex flex-col text-[12px] mt-[12px] gap-2'>
            <a href="#"><SlEnvolope className='inline-block text-primary mr-2 text-[16px]'/>hello@luxefemme.com</a>
            <a href="#"><LuPhone className='inline-block text-primary mr-2 text-[16px]'/>+1 (555) 123-4567</a>
            <a href="#"><IoLocationOutline className='inline-block text-primary mr-2 text-[16px]'/>123 Fashion Ave, New York, NY 10001</a>
          </div>

        </div>




       </div>




     <div className='border-t border-black/30 mx-auto w-[98%] flex items-center justify-center'>
        <p className='sm:py-[20px] py-[14px] sm:text-[12px] text-[8px] tracking-wider'>
          © 2026 Ali jan. All rights reserved. Crafted with elegance.
        </p>
     </div>       

    </div>
  )
}

export default Footer