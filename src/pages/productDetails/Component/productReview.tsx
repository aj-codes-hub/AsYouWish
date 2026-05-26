import React from 'react'
import { FaStar } from "react-icons/fa";
import { FaAngleLeft , FaAngleRight } from "react-icons/fa6";



const ProductReview:React.FC = () => {
  return (
    <div className='ml-[20px] relative'>
      
        <hr className='opacity-[30%] mb-[20px] text-gray-400' />

        <h1 className='text-[18px] mb-[5px]'>Customer name</h1>
        <div className='flex md:gap-2 gap-1 text-yellow-500 md:text-[16px] text-[12px]'>
           <FaStar />
           <FaStar />
           <FaStar />
           <FaStar />
           <FaStar />
           <p className='text-black'>5/5</p>
        </div>
       <p className='border my-[10px] text-[15px] text-gray-600 w-[70%]'>
        customer says Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas inventore, id officia dolorem reprehenderit incidunt nobis, eum quasi, quos explicabo culpa. Facere quidem alias placeat atque dignissimos aliquam nisi et.
        </p>

        
        <div className='border-2 absolute left-[72%] top-10 border-red-500 h-[170px] w-[170px]'>

        </div>
          
        <div className='flex border gap-10'> 

        <div className='flex mx-auto items-center justify-center gap-4'>
          <FaAngleLeft size={20}/>
             <div className='border-2 border-blue-500 h-[50px] w-[57px]'></div>
             <div className='border-2 border-blue-500 h-[50px] w-[57px]'></div>
             <div className='border-2 border-blue-500 h-[50px] w-[57px]'></div>
          <FaAngleRight size={20}/>
        </div>

        </div>

    </div>
  )
}

export default ProductReview