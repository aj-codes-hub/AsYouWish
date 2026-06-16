import React from 'react';
import { GiAmpleDress } from "react-icons/gi";


interface AddToCartAnimationProps {
    runAnimation: any;
}

const AddToCartAnimation:React.FC<AddToCartAnimationProps> = ({runAnimation = false}) => {



  return (
    <div className='h-screen w-screen flex fixed z-[9999] pointer-events-none top-0 left-0'>
        <div className={`rounded-full bg-white/60 flex items-center justify-center absolute 
                         ${runAnimation ? 'addToCartAnimation': 'text-[0px]'}`}>
            <GiAmpleDress />
        </div>
    </div>
  )
}

export default AddToCartAnimation