import React from 'react'
import ProductCard from '../../../components/productCard'


const BestSellers:React.FC = () => {
  return (
    <div className='w-full bg-[#FFF8F5] py-[60px] '>
   
     <div className='max-w-[1100px] mx-auto'>

        <h1 className='font-sans md:text-[45px] text-[35px] text-center md:leading-12 leading-10'>
            Best Sellers
        </h1>
        <p className='md:text-[17px] text-[12px] text-center [word-spacing:3px]'> 
            Customer favorites that never go out of style
        </p>

        <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-center items-center gap-6 mt-[40px] px-[30px]'>
            <ProductCard Image='./images/blue-dress.jpg' price={6999} className='h-[550px]'/>
            <ProductCard Image='./images/white-dress.jpg' price={1599} className='h-[550px] '/>
            <ProductCard Image='./images/golden-dress.jpg' price={2399} className='h-[550px] '/>
        </div>

        </div>
        
    </div>
  )
}

export default BestSellers