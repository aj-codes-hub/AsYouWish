import React from 'react'
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

        <div className='w-full  sm:h-[380px] sm:mt-[100px] mt-[60px] sm:flex justify-between'>
            <div className='sm:h-full h-[55vh] sm:w-[30%] w-[98%] sm:mx-0 mx-auto overflow-hidden'>
              <div className=' sm:h-[82%] h-full w-[100%] overflow-hidden'>
                  <img src={item.mainImage} className='bg-cover' alt="image" />
              </div>

              <div className='h-[18%] w-full sm:flex items-center justify-center gap-4 hidden'>
                {item.moreImages.map((image , index) =>(
                  <div key={index} className=' h-[50px] w-[57px] overflow-hidden'>
                    <img src={image} alt="more images" />
                  </div>
                ))}
              </div>

            </div>

            <div className='sm:w-[69%] w-full p-4'>

                <h1 className='sm:text-[30px] text-[25px]'> 
                 {item.title}
                </h1>
                
                  <p className='xl:h-[75px] sm:text-[16px] text-[13px]'> 
                    {item.details}
                  </p>

                <div className='w-full flex justify-between items-center sm:my-[30px] my-[20px]'>

              <div className='sm:hidden block'>
              <h1 className='text-[34px] leading-6 text-primary'>Rs. {item.price}</h1>
              <p className='flex gap-2 text-[15px]'>
                <span className='line-through font-semibold text-gray-400 '>Rs. 499</span>
                <span>-{item.discount}%</span>
               </p>
              </div>

                    <div className='flex md:gap-2 gap-1 text-yellow-500 md:text-[16px] sm:text-[12px] text-[18px]'>
                             <FaStar />
                             <FaStar />
                             <FaStar />
                             <FaStar />
                             <FaStar /> 
                              <p className='text-black'>5/{item.Rating}</p>
                      </div>

                   <div className='sm:flex gap-3 hidden'>
                    <FaRegHeart />
                    
                      <IoShareSocialOutline className='text-[18px]'/>
                   
                   </div>
                </div>

                <hr className='opacity-[30%] my-[20px] text-gray-400 sm:block hidden'/>

              <h1 className='text-[26px] mt-[15px] leading-6 text-primary sm:block hidden'>Rs. {item.price}</h1>
              <p className='gap-2 text-[12px] sm:flex hidden'>
                <span className='line-through font-semibold text-gray-400 '>Rs. 499</span>
                <span className='bg-[#068fff] px-[5px] py-[1px] rounded-full text-[10px]'>-{item.discount}%</span>
               </p>

                <hr className='opacity-[30%] my-[20px] text-gray-400 sm:block hidden'/>

              <div className='w-full sm:flex hidden gap-2'>
                
               <button className='bg-green-400 w-[50%] py-[6px] text-white rounded-sm text-[14px] cursor-pointer'>
                Buy Now 
               </button>

               <button className='bg-primary w-[50%] py-[6px] text-white rounded-sm text-[14px] cursor-pointer'> 
                Add To Cart
               </button>

              </div>

            </div>

        </div>

         <hr className='my-[20px]' />

         <div>
            <h1 className='text-[30px] sm:mt-[50px] ml-[10px] '>
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

      <div className='bg-black/10 backdrop-blur-xs w-full h-[60px] fixed bottom-0 left-0 flex sm:hidden justify-between z-[99]'>
              <div className='h-full  w-[30%] flex gap-[40px] items-center justify-center'>

                    <FaRegHeart className='text-[22px]'/>
                    
                      <IoShareSocialOutline className='text-[26px]'/>

              </div>
              <div className='w-[65%] h-full relative'>
                 <button className='bg-gradient-to-tl from-[#05DE71] to-[#228754] w-[55%] h-full left-[-5%] -skew-x-30 z-[20] absolute'>
                        <p className='skew-x-20 text-[24px]'>
                          buy
                         </p>
                 </button>

                  <button className='bg-gradient-to-tl from-[#B76E79] to-[#f58194] w-[60%] h-full -right-[3%] z-[10] absolute'>
                        <p className=' text-[20px]'>
                          Add to cart
                         </p>
                 </button>

              </div>

      </div>



    </div>
  )
}

export default ProductDetail