import React from 'react'
import { FiShoppingCart } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';




interface ProductCardPrpos {
    Image?: string;
    price?: number;

}

const ProductCard:React.FC<ProductCardPrpos> = ({Image,price}) => {

const navigate = useNavigate();

  return (
    <div className='sm:h-[380px] h-[70vw] w-[100%] overflow-hidden md:rounded-2xl rounded-xl shadow-sm hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 cursor-pointer group'>
        <div className='h-[80%] w-full overflow-hidden relative'>
           <img onClick={() => navigate("/product-detail")} src={Image} className='group-hover:scale-[1.08] transition-all duration-500'/>
           
           <div className='rounded-full md:text-[18px] text-[15px] md:p-[10px] p-[8px] bg-white absolute top-[10px] right-[10px]'>
                 <FaRegHeart />
           </div>

        </div>

        
        <div className='h-[20%] group relative py-[5px]'>

           {/* Add to cart button */}
            <button className='bg-primary text-white flex gap-2 items-center justify-center lg:text-[16px] sm:text-[14px] text-[9px] w-full absolute group-hover:-mt-[40px] sm:-mt-[35px] -mt-[20px] lg:-mt-[6px]
                               group-hover:h-[40px] lg:h-[0px] sm:h-[35px] h-[20px] cursor-pointer overflow-hidden transition-all duration-300'>
                <FiShoppingCart />Add to cart 
            </button>

            <h2 className='sm:text-[14px] text-[9px] leading-0 mt-[10px] ml-[14px]'>
                Modern Abaya Collection
            </h2>

            <div className='flex justify-between items-center h-full mx-[14px]'>

            <h1 className='text-primary font-semibold sm:text-[16px] text-[10px]'>
                Rs. {price} 
            </h1>

            <button onClick={() => navigate("/product-detail")} className='bg-primary sm:text-[10px] text-[8px] text-white rounded-sm px-[10px] py-[2px]
                                cursor-pointer'>
                    more Details
            </button>
    
            </div>
        </div>

    </div>
  )
}

export default ProductCard