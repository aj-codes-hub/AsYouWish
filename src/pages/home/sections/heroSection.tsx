import React from 'react'
import { FaArrowRight } from "react-icons/fa";
import { smoothScrollTo } from '../../../Utils/scrollUtils'
import { IoBagHandleOutline } from "react-icons/io5";
import { FiClock } from "react-icons/fi";
 



const HeroSection:React.FC = () => {

  return (
    <div className='sm:h-[600px] h-[620px] w-full fixed sm:relative z-[-20] sm:z-[1] top-0 overflow-hidden'> 
         
      <img src="./images/just.jpg"
           className='absolute z-10 w-full -translate-y-1/2 top-1/2 sm:scale-[1] scale-[1.3]'/>   
      
      <div className='flex justify-center items-center w-full h-full text-white/80 bg-black/60 absolute z-20 px-[30px] '>

      <div className='text-center sm:max-w-[550px] sm:bg-white/2 bg-black/10 backdrop-blur-[1.5px] p-[15.4px] w-full max-w-[340px]'>
       
       <h1 className='font-[500] sm:text-[51px] text-[41px] font-bold animate-fade-in-up delay-100'> 
         Elevate Your Style
       </h1>
       <h1 className='font-[500] sm:text-[61px] text-[41px] flex flex-col-reverse sm:flex-row items-center gap-3 animate-fade-in-up delay-200'> 
        
          <button className='lg:mx-0 mx-auto py-[5px] sm:text-[12px] text-[8px]  bg-[#E8B4B8] rounded-br-full rounded-tl-full  px-[14px] text-black flex items-center gap-2 '>
            Limited Time Offer <FiClock />
        </button>  
       
        Up to 40% Off
       </h1>
       <p className='sm:text-[20px] text-[16px] sm:mt-0 mt-[10px] animate-fade-in-up delay-300'>
          Discover timeless elegance with our curated collection of premium women's fashion
       </p>
       
       <div className='flex sm:gap-5 gap-3 items-center justify-center animate-fade-in-up delay-400'>
       <button  onClick={() => smoothScrollTo('FeatureCollection', 45, 1000)}
               className='mt-[20px] py-[12px] sm:text-[14px] text-[11px] bg-primary sm:px-[18px] px-[14px] text-white rounded-full flex items-center  gap-2 
                          cursor-pointer hover:scale-[1.05] transition duration-500 group'>
        Featured Collection
        <FaArrowRight className='mt-[3px] font-thin group-hover:ml-[5px] transition-all duration-500'/> 
       </button>
       
       <button  onClick={() => smoothScrollTo('NewArrivals', 45, 1000)}
               className='mt-[20px] py-[12px] sm:text-[14px] text-[11px] border sm:px-[18px] px-[14px] text-white rounded-full flex items-center gap-2 
                          cursor-pointer hover:scale-[1.05] transition duration-500 group'>
        New Arrivals
        <IoBagHandleOutline className='group-hover:ml-[5px] transition-all duration-500 text-[18px]'/> 
       </button>
       </div>
   
      </div>

      </div>


    </div>
  )
}

export default HeroSection