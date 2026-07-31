import React from 'react'
import { FaArrowRight } from "react-icons/fa";
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';





const SummerCollection:React.FC = () => {

  const { ref: ref1, isVisible: isVisible1 } = useIntersectionObserver({ threshold: 0.2 });
  const { ref: ref2, isVisible: isVisible2 } = useIntersectionObserver({ threshold: 0.2 });
  const { ref: ref3, isVisible: isVisible3 } = useIntersectionObserver({ threshold: 0.2 });


  return (
    <div className='bg-gray-600 md:h-[500px] h-[600px] w-full relative'> 
         
      <img src="./images/hero-image.jpg"
           className='absolute z-10 w-full h-full'/>   
      
      <div className='flex items-center w-full h-full bg-black/80 absolute z-20 px-[30px]'>
      
      <div className='w-full max-w-[1100px] mx-auto'>

        <div className='lg:w-[500px] text-white text-center lg:text-left lg:mx-0 mx-auto'>

        <div ref={ref1}  className={`lg:mx-0 mx-auto py-[6px] text-[12px] bg-[#E8B4B8] px-[16px] text-black rounded-full flex items-center gap-2 w-[27%]
                           ${isVisible1 ? "animate-fade-in-left delay-200" : "opacity-0 scale-95"}`}>
            Limited Time Offer 
        </div>    
        
        <h1 ref={ref2}  className={`font-[600] text-[50px] leading-14 mt-[20px]
                       ${isVisible2 ? "animate-fade-in-left delay-300" : "opacity-0 scale-95"}`}>
            Summer Collection <br />
            Up to <span className='font-[500]'>40%</span> Off
        </h1>
        <p ref={ref3}  className={`text-[18px] mb-[30px] mt-[20px] leading-6 
                       ${isVisible3 ? "animate-fade-in-left delay-400" : "opacity-0 scale-95"}`}>
            Discover the season's must-have pieces with <br />
            exclusive savings on our premium collection
        </p>

        <button onClick={() => window.location.href="/collection"}
                className={`lg:mx-0 mx-auto mt-[19px] py-[12px] text-[14px] bg-white px-[26px] text-primary rounded-full flex items-center gap-2 
                                  cursor-pointer hover:scale-[1.05] transition duration-500 group
                                  ${isVisible3 ? "animate-fade-in-left" : "opacity-0 scale-95"}`}>
                Shop now
                <FaArrowRight className='mt-[3px] font-thin group-hover:ml-[5px] transition-all duration-500'/> 
        </button>

        </div>

      </div>

      </div>


    </div>
  )
}

export default SummerCollection