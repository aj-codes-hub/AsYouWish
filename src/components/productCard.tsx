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
         className={`sm:h-[380px] h-[270px] w-[100%] overflow-hidden sm:rounded-xl sm:shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 cursor-pointer group ${className}`}>
        <div className='h-[80%] w-full overflow-hidden relative'>
           <img onClick={handlePorductClick} src={Image} className='group-hover:scale-[1.08] transition-all duration-500'/>
           
           <div  onClick={handleWishClick}
                 className='rounded-full md:text-[18px] text-[16px] md:p-[10px] p-[9px] bg-white/60 absolute top-[10px] right-[10px]'>
            {liked ? <IoHeart className='text-[19px] text-[#B76E79] '/> 
                   : <FaRegHeart /> }
           </div>

           <button  onClick={handleAddToCart}
                     className='rounded-r-full px-[10px] py-[8px] text-[10px] bg-white/60 absolute bottom-[10px] left-[0px] flex items-center justify-center'> 
                <FiShoppingCart /> + 
            </button>

        </div>
         
         <div className='h-[20%] group relative py-[5px]'>

           {/* Add to cart button */}
            <button  onClick={handleAddToCart}
                     className='bg-primary text-white sm:flex hidden gap-2 items-center justify-center lg:text-[16px] text-[14px] w-full absolute group-hover:-mt-[40px] sm:-mt-[35px] -mt-[30px] lg:-mt-[6px]
                               group-hover:h-[40px] lg:h-[0px] h-[35px] cursor-pointer overflow-hidden transition-all duration-300'>
                <FiShoppingCart />Add to cart 
            </button>

            <h2 className='sm:text-[14px] text-[9px] leading-0 mt-[10px] ml-[10px]'>
                Modern Abaya Collection
            </h2>

            <div className='flex justify-between items-center h-full mx-[10px] flex'>

            <h2 className='text-primary font-semibold leading-[15px] sm:text-[18px] text-[17px] flex flex-col'>
                Rs. {price} 
                <span className='line-through text-left sm:text-[12.5px] text-[10px] tracking-widest text-gray-400 font-semibold ml-[6px]'>
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