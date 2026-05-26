import React from 'react'
import ProductCard from '../../../components/productCard'

const FeaturedCollection:React.FC = () => {
  return (
    <div className='w-full bg-[#FFF8F5] py-[60px]'>
   
     <div className='max-w-[1100px] mx-auto'>

        <h1 className='font-sans md:text-[45px] text-[35px] text-center md:leading-12 leading-10'>
            Featured Collection
        </h1>
        <p className='md:text-[17px] text-[12px] text-center [word-spacing:3px]'> 
            Handpicked styles for the modern woman
        </p>

        <div className='grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2 justify-center items-center gap-6 mt-[40px] px-[30px]'>
            <ProductCard Image='./images/blue-dress.jpg' price={6999}/>
            <ProductCard Image='./images/white-dress.jpg' price={1599}/>
            <ProductCard Image='./images/golden-dress.jpg' price={2399}/>
            <ProductCard Image='./images/yellow-dress.jpg' price={3999}/>
        </div>

        </div>
        
    </div>
  )
}

export default FeaturedCollection