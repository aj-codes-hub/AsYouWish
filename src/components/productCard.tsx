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
    key?:number;
    title?:string;
}

const ProductCard:React.FC<ProductCardPrpos> = ({Image,price,className,key,id,title}) => {


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
    <div key={key}
         className={`sm:h-[380px] h-[70vw] w-[100%] overflow-hidden md:rounded-2xl sm:rounded-xl  shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 cursor-pointer group ${className}`}>
        <div className='h-[80%] w-full overflow-hidden relative'>
           <img onClick={handlePorductClick} src={Image} className='group-hover:scale-[1.08] transition-all duration-500'/>
           
           <div  onClick={handleWishClick}
                 className='rounded-full md:text-[18px] text-[15px] md:p-[10px] p-[8px] bg-white/60 absolute top-[10px] right-[10px]'>
            {liked ? <IoHeart className='text-[19px] text-[#B76E79] '/> 
                   : <FaRegHeart /> }
           </div>

        </div>
         
         <div className='h-[20%] group relative py-[5px]'>

           {/* Add to cart button */}
            <button  onClick={handleAddToCart}
                     className='bg-primary text-white flex gap-2 items-center justify-center lg:text-[16px] sm:text-[14px] text-[9px] w-full absolute group-hover:-mt-[40px] sm:-mt-[35px] -mt-[30px] lg:-mt-[6px]
                               group-hover:h-[40px] lg:h-[0px] sm:h-[35px] h-[30px] cursor-pointer overflow-hidden transition-all duration-300'>
                <FiShoppingCart />Add to cart 
            </button>

            <h2 className='sm:text-[14px] text-[9px] leading-0 mt-[10px] ml-[10px]'>
                Modern Abaya Collection
            </h2>

            <div className='flex justify-between items-center h-full mx-[10px]'>

            <h1 className='text-primary font-semibold sm:text-[16px] text-[16px]'>
                Rs. {price} 
            </h1>

            <button onClick={handlePorductClick} className='bg-primary sm:text-[10px] text-[8px] text-white rounded-sm px-[10px] py-[2px]
                                cursor-pointer'>
                    more Details
            </button>
    
            </div>
        </div>

    </div>
    </>
  )
}

export default ProductCard