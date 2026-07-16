import React, { useState } from 'react'
import { FiShoppingCart } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useCart } from '../pages/context/cartContext';
import { IoHeart } from "react-icons/io5";
import { useWishlist } from '../pages/context/wishlistContext';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; 



interface ProductCardPrpos {
    id?: any;
    Image?: string;
    price?: any;
    className?:string;
    title?:string;
    discount?:number;
    DiscountPrice?: number;
    HoverImg?: any;
    rating?: number; 
}

const ProductCard:React.FC<ProductCardPrpos> = ({Image,price,className,id,title,discount,DiscountPrice,HoverImg,rating = 0, }) => {


 const { addToWishlist , removeFromWishlist , isInWishlist } = useWishlist();   


const handleWishlistToggle = (e: React.MouseEvent) => {
  e.stopPropagation();
  
  const discountPrice = DiscountPrice || 
    (discount ? Math.round(price - (price * discount / 100)) : price);
  
  const product = {
    id: id,
    _id: id,
    title: title,
    price: price,
    mainImage: Image,
    discount: discount || 0,
    DiscountPrice: discountPrice,
    moreImages: HoverImg || [],
  };
  
  if (isInWishlist(id)) {
    removeFromWishlist(id);
  } else {
    addToWishlist(product);
  }
};

 const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-primary text-[10px] sm:text-[15px]" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-primary text-[10px] sm:text-[15px]" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-400 text-[10px] sm:text-[15px]" />);
    }
    return stars;
  };


// ✅ Update isLiked
const isLiked = isInWishlist(id)

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

const [isMouse, setIsMouse] = useState(false); 


  return (
    <>
    <div className={`sm:h-[380px] h-[290px] w-[100%] overflow-hidden hover:rounded-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 cursor-pointer group ${className}`}>
         <div className='h-[75%] w-full overflow-hidden relative bg-gradient-to-bl from-[#B0AEA2] to-[#CFCDC1]'>
           <img  onClick={handlePorductClick} 
                 src={isMouse ? HoverImg[0] : Image}
                 onMouseEnter={() => setIsMouse(true)}
                 onMouseOut={() => setIsMouse(false)} 
                 className='group-hover:scale-[1.08] transition-all duration-500 ease-in-out'/>
           
           <div  onClick={handleWishlistToggle}
                 className='rounded-full md:text-[18px] text-[16px] md:p-[10px] p-[9px] bg-white/60 absolute top-[10px] right-[10px]'>
            {isLiked ? <IoHeart className='text-[19px] text-[#B76E79] '/> 
                   : <FaRegHeart /> }
           </div>

           <span className='sm:text-[11.5px] text-[8px] inline-block bg-[#f6ea01] px-[6px] py-[1px] ml-[6px] absolute top-[15px]'>
                        {discount}% OFF
            </span>

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
            <div onClick={handlePorductClick} className='h-full'>
             <h2 className='text-[12px] sm:text-[14px] tracking-wider leading-2 font-semibold sm:font-normal text-[#30303071] sm:mt-[6px] sm:ml-[12px]'>
                Embroidered | Lawn
             </h2>

            <h2 className='sm:text-[14px] text-[11.6px] leading-0 mt-[12px] sm:mt-[18px] sm:ml-[12px]'>
                    Unstitched 3 Piece
            </h2>

            <div className='flex justify-between items-center h-full flex sm:mx-[12px]'>

            <h2 className='text-primary font-semibold leading-[15px] sm:text-[18px] text-[17px] flex flex-col'>
                PKR. {DiscountPrice} 
                <span className='line-through text-left sm:text-[12.5px] text-[10px] tracking-[2px] text-gray-400 font-semibold ml-[6px]'>
                   Rs. {price}
                </span>
            </h2>    

            <div className="flex items-center gap-0.5">
              {renderStars(rating || 2)}
              <span className="text-[8px] sm:text-[9px] text-gray-400 ml-0.5">
              </span>
            </div>
            </div>
            </div>
        </div>

    </div>
    </>
  )
}

export default ProductCard