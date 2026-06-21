import React from 'react'
import { FiShoppingCart } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useCart } from '../pages/context/cartContext';
import { IoHeart } from "react-icons/io5";
import { useWishlist } from '../pages/context/wishlistContext';




interface ProductCardPrpos {
    id: number;
    Image?: string;
    price?: number;
    className?:string;
    title?:string;
}

const ProductCard:React.FC<ProductCardPrpos> = ({Image,price,className,id,title}) => {


 const { addToWishlist , removeFromWishlist , isInWishlist } = useWishlist();   


const liked = isInWishlist(id);

const handleWishClick = () => {

if(liked){
   removeFromWishlist(id);
}else {
      const product = { id, title, price, mainImage: Image };
      addToWishlist(product);
    }
}

const navigate = useNavigate();
const {addToCart} = useCart();

const handleAddToCart = () => {
    const product = {
        id: id,
        title: title,
        price: price,
        mainImage: Image,
    }

    addToCart(product);
}

const handlePorductClick = () => {
     navigate(`/product-detail/${id}`)
}

  return (
    <>
    <div
         className={`sm:h-[380px] h-[290px] w-[100%] overflow-hidden hover:rounded-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 cursor-pointer group ${className}`}>
        <div className='h-[75%] w-full overflow-hidden relative bg-gradient-to-bl from-[#B0AEA2] to-[#CFCDC1]'>
           <img onClick={handlePorductClick} src={Image} className='group-hover:scale-[1.08] transition-all duration-500'/>
           
           <div  onClick={handleWishClick}
                 className='rounded-full md:text-[18px] text-[16px] md:p-[10px] p-[9px] bg-white/60 absolute top-[10px] right-[10px]'>
            {liked ? <IoHeart className='text-[19px] text-[#B76E79] '/> 
                   : <FaRegHeart /> }
           </div>

           <button  onClick={handleAddToCart}
                     className='rounded-r-full px-[10px] gap-1 py-[6px] text-[12px] bg-white/60 absolute bottom-[10px] left-[0px] flex items-center justify-center sm:hidden'> 
                <span className='text-[12px]'> Add to </span>
                <FiShoppingCart />
            </button>

        </div>
         
         <div className='h-[20%] group relative py-[5px]'>

           {/* Add to cart button */}
            <button  onClick={handleAddToCart}
                     className='bg-primary text-white sm:flex hidden gap-2 items-center justify-center lg:text-[16px] text-[14px] w-full absolute group-hover:-mt-[40px] sm:-mt-[35px] -mt-[30px] lg:-mt-[6px]
                               group-hover:h-[40px] lg:h-[0px] h-[35px] cursor-pointer overflow-hidden transition-all duration-300'>
                <FiShoppingCart />Add to cart 
            </button>
             
             <h2 className='text-[12px] sm:text-[14px] tracking-wider leading-2 font-semibold sm:font-normal text-[#30303071] sm:mt-[6px] sm:ml-[12px]'>
                Embroidered | Lawn
             </h2>

            <h2 className='sm:text-[14px] text-[11.6px] leading-0 mt-[12px] sm:mt-[18px] sm:ml-[12px]'>
                    Unstitched 3 Piece
            </h2>

            <div className='flex justify-between items-center h-full flex sm:mx-[12px]'>

            <h2 className='text-primary font-semibold leading-[15px] sm:text-[18px] text-[17px] flex flex-col'>
                PKR. {price} 
                <span className='line-through text-left sm:text-[12.5px] text-[10px] tracking-[2px] text-gray-400 font-semibold ml-[6px]'>
                    Rs. 464
                </span>
            </h2>    
             <span className='sm:text-[11.5px] text-[8px] inline-block text-whit bg-[yellow] rounded-full px-[6px] py-[1px] ml-[6px]'>
                        50% OFF
            </span>
            </div>
        </div>

    </div>
    </>
  )
}

export default ProductCard