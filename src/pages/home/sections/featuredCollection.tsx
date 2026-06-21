import React from 'react'
import ProductCard from '../../../components/productCard'
import { Product } from '../../../data/productCard/product'

const FeaturedCollection:React.FC = () => {

  
  const FutureCollection = Product.filter(Product => Product.Event === 'FeaturedCollection');


  return (
    <div id='FeatureCollection' className='w-full bg-[#FFF8F5] py-[60px] mt-[620px] sm:mt-0 relative'>
   
      <div className='w-full h-[120px] absolute top-[-70px] overflow-hidden sm:hidden'>
        <img src="/images/downBorder.png" className=''/>
      </div>


     <div className='max-w-[1100px] mx-auto'>

        <h1 className='font-sans md:text-[45px] text-[35px] text-center md:leading-12 leading-10'>
            Featured Collection
        </h1>
        <p className='md:text-[17px] text-[12px] text-center [word-spacing:3px]'> 
            Handpicked styles for the modern woman
        </p>

        <div className='grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2 justify-center items-center sm:gap-6 gap-4 mt-[40px] sm:px-[30px] px-[10px]'>
            {FutureCollection.map((item)=>(

            <ProductCard id={item.id}
                         Image={item.mainImage}
                         price={item.price}
                         title={item.title}
                         />
            ))}
        </div>

        </div>
        
    </div>
  )
}

export default FeaturedCollection