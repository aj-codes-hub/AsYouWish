import React from 'react'
import { FaStar } from "react-icons/fa";
import { FaAngleLeft , FaAngleRight } from "react-icons/fa6";


interface ProductReviewProps {
    key: number;
    customerName: string;
    message:string;
    Rating: number;
    mainImage: string;
    moreImages: string[];

}


const ProductReview:React.FC<ProductReviewProps> = ({key,customerName,message,Rating,mainImage,moreImages}) => {
  return (
    <div key={key} className='ml-[20px] relative'>
      
        <hr className='opacity-[30%] mb-[20px] mt-[10px] text-gray-400' />

        <h1 className='text-[18px] mb-[5px]'>{customerName}</h1>
        <div className='flex md:gap-2 gap-1 text-yellow-500 md:text-[16px] text-[12px]'>
           <FaStar />
           <FaStar />
           <FaStar />
           <FaStar />
           <FaStar />
           <p className='text-black'>5/{Rating}</p>
        </div>
       <p className='my-[10px] text-[15px] text-gray-600 w-[70%]'>
                 {message}
        </p>

        
        <div className='absolute left-[72%] top-10 bg-cover h-[170px] w-[170px] overflow-hidden'>
               <img src={mainImage} alt="" />
        </div>
          
        <div className='flex gap-10'> 

        <div className='flex mx-auto items-center justify-center gap-4'>
          <FaAngleLeft size={20}/>

          {moreImages.map((item ,index)=>(
             <div key={index} className='h-[50px] w-[57px] overflow-hidden'>
              <img src={item} alt="" />
             </div>
          ))}

          <FaAngleRight size={20}/>
        </div>

        </div>

    </div>
  )
}

export default ProductReview