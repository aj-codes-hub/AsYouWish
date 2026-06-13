import React from 'react';
import { IoHeart } from "react-icons/io5";

interface AddToWishlistAnimationProps {
    runAnination: any;
}

const AddToWishlistAnimation:React.FC<AddToWishlistAnimationProps> = ({runAnination = false}) => {



  return (
    <div className='h-screen w-screen flex fixed z-[99] pointer-events-none'>
        <div className={`bg-transparent text-primary flex items-center justify-center absolute 
                         ${runAnination ? 'addToWsihlistAnimation': 'text-[0px]'}`}>
            <IoHeart />
        </div>
    </div>
  )
}

export default AddToWishlistAnimation