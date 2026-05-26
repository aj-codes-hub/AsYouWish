import React from 'react'
import { FaAngleLeft , FaAngleRight } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import ProductReview from './Component/productReview';


const ProductDetail:React.FC = () => {
  return (
    <div className='w-full bg-[#FFF8F5]'>
      <div className='max-w-[1100px] w-full border mx-auto pb-[100px]'>

        <div className='w-full border-2 border-green-500 h-[380px] mt-[100px] flex justify-between'>
            <div className='h-full w-[30%]'>
              <div className='border-2 border-red-500 h-[82%] w-[100%]'>

              </div>

              <div className='h-[18%] w-full flex items-center justify-center gap-4'>
                <FaAngleLeft size={20}/>
                 <div className='border-2 border-blue-500 h-[50px] w-[57px]'></div>
                 <div className='border-2 border-blue-500 h-[50px] w-[57px]'></div>
                 <div className='border-2 border-blue-500 h-[50px] w-[57px]'></div>
                 <FaAngleRight size={20}/>
              </div>

            </div>

            <div className='border-2 border-amber-300 w-[69%] p-4'>

                <h1 className='text-[30px]'> 
                   Product name in detail
                </h1>
                
                  <p className='h-[75px] border overflow-hidde.'>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat nisi quam quasi nesciunt incidunt voluptates illo voluptatibus. Ab earum amet, velit incidunt repellat, iure sapiente temporibus unde nulla excepturi sit.
                  </p>

                <div className='w-full flex justify-between items-center border-2 border-red-600 my-[30px]'>
                    <div className='flex md:gap-2 gap-1 text-yellow-500 md:text-[16px] text-[12px]'>
                             <FaStar />
                             <FaStar />
                             <FaStar />
                             <FaStar />
                             <FaStar />
                              <p className='text-black'>5/5</p>
                           </div>
                   <div className='flex gap-3'>
                    <FaRegHeart />
                    
                      <IoShareSocialOutline className='text-[18px]'/>
                   
                   </div>
                </div>

                <hr className='opacity-[30%] my-[20px] text-gray-400'/>

              <h1 className='text-[26px] mt-[15px] leading-6 text-primary'>Rs. 999</h1>
              <p className='flex gap-2 text-[12px]'>
                <span className='line-through font-semibold text-gray-400 '>Rs. 499</span>
                <span>-55%</span>
               </p>

                <hr className='opacity-[30%] my-[20px] text-gray-400'/>

              <div className='w-full flex gap-2'>
                
               <button className='bg-green-400 px-[100px] py-[6px] text-white rounded-sm text-[14px] cursor-pointer'>
                Buy Now 
               </button>

               <button className='bg-primary px-[100px] py-[6px] text-white rounded-sm text-[14px] cursor-pointer'> 
                Add To Cart
               </button>

              </div>

            </div>

        </div>

         <div>
            <h1 className='text-[30px] mt-[50px] ml-[10px] '>
                Porduct Details
            </h1>
            <ul className='list-disc ml-[30px]'>
                <li>Lorem ipsum dolor sit.</li>
                <li>Lorem, ipsum.</li>
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Lorem, ipsum dolor.</li>
                <li>Lorem, ipsum dolor.</li>
                <li>Lorem ipsum dolor sit amet consectetur adipisicing..</li>
            </ul>
         </div>

         <hr className='opacity-[30%] my-[20px] text-gray-400' />

        
        <div>
             <h1 className='text-[30px] mt-[50px] ml-[10px] '>
                Customer Review
            </h1>
           
           <ProductReview />
           <ProductReview />
           <ProductReview />
           <ProductReview />
           <ProductReview />
         


        </div>


      </div>
    </div>
  )
}

export default ProductDetail