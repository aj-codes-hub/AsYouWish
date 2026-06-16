import React from 'react'
import { FaArrowRight } from "react-icons/fa";





const HeroSection:React.FC = () => {
  return (
    <div className='sm:h-[600px] h-[620px] w-full fixed sm:relative z-[-20] sm:z-[1] top-0'> 
         
      <img src="./images/hero-image.jpg"
           className='absolute z-10 w-full h-full'/>   
      
      <div className='flex justify-center items-center w-full h-full sm:text-black text-white sm:bg-white/60 bg-white/20 absolute z-20 px-[30px]'>

      <div className='text-center sm:max-w-[500px] sm:bg-white/2 bg-black/10 backdrop-blur-[1.5px] p-4 w-full max-w-[340px]'>
       
       <h1 className='font-[500] text-[61px]'> 
         Elevate Your Style
       </h1>
       <p className='sm:text-[20px] text-[16px]'>
          Discover timeless elegance with our curated collection of premium women's fashion
       </p>

       <button className='mt-[20px] py-[12px] text-[14px] bg-primary px-[18px] text-white rounded-full mx-auto flex items-center gap-2 
                          cursor-pointer hover:scale-[1.05] transition duration-500 group'>
        Shop now
        <FaArrowRight className='mt-[3px] font-thin group-hover:ml-[5px] transition-all duration-500'/> 
       </button>

   
      </div>

      </div>


    </div>
  )
}

export default HeroSection