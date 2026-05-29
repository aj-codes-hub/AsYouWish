import React from 'react'
import { FaAngleLeft , FaAngleRight } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import ProductReview from './Component/productReview';
import { Product } from '../../data/productCard/product'


const ProductDetail:React.FC = () => {
  return (
    <div className='w-full bg-[#FFF8F5] border border-[#fff0]'>
      {Product.map((item) => (
              <div className='max-w-[1100px] w-full mx-auto pb-[100px]'>

        <div className='w-full  h-[380px] mt-[100px] flex justify-between'>
            <div className='h-full w-[30%]'>
              <div className=' h-[82%] w-[100%] overflow-hidden'>
                  <img src={item.mainImage} className='bg-cover' alt="image" />
              </div>

              <div className='h-[18%] w-full flex items-center justify-center gap-4'>
                <FaAngleLeft size={20}/>
                {item.moreImages.map((image , index) =>(
                  <div key={index} className=' h-[50px] w-[57px] overflow-hidden'>
                    <img src={image} alt="more images" />
                  </div>
                ))}
                 <FaAngleRight size={20}/>
              </div>

            </div>

            <div className=' w-[69%] p-4'>

                <h1 className='text-[30px]'> 
                 {item.title}
                </h1>
                
                  <p className='h-[75px] overflow-hidde.'>
                    {item.details}
                  </p>

                <div className='w-full flex justify-between items-center 0 my-[30px]'>
                    <div className='flex md:gap-2 gap-1 text-yellow-500 md:text-[16px] text-[12px]'>
                             <FaStar />
                             <FaStar />
                             <FaStar />
                             <FaStar />
                             <FaStar /> 
                              <p className='text-black'>5/{item.Rating}</p>
                           </div>
                   <div className='flex gap-3'>
                    <FaRegHeart />
                    
                      <IoShareSocialOutline className='text-[18px]'/>
                   
                   </div>
                </div>

                <hr className='opacity-[30%] my-[20px] text-gray-400'/>

              <h1 className='text-[26px] mt-[15px] leading-6 text-primary'>Rs. {item.price}</h1>
              <p className='flex gap-2 text-[12px]'>
                <span className='line-through font-semibold text-gray-400 '>Rs. 499</span>
                <span>-{item.discount}%</span>
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

         <hr className='my-[20px]' />

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
           
           {item.review.map((item)=>(
             <ProductReview key={item.id}
                            customerName={item.customerName}
                            message={item.message}
                            mainImage={item.mainImage}
                            moreImages={item.moreImages}
                            Rating={item.Rating} /> 
           ))}

        </div>


      </div>
      ))}
    </div>
  )
}

export default ProductDetail