import React from 'react'
import ProductCard from '../components/productCard'
import { Product } from '../data/productCard/product'


const Collection:React.FC = () => {
  return (
    <div className='py-[80px]'>
        <h1 className='text-center text-2xl'>All Collections</h1>
       <div className='grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2 justify-center items-center sm:gap-6 gap-4 mt-[40px] sm:px-[30px] px-[10px] max-w-[1100px] mx-auto'> 
            {Product.map((item, index) => (
                <div key={index}>
                <ProductCard  
                            id={item.id}
                            Image={item.mainImage}
                            price={item.price}
                            title={item.title}
                            />
            </div>
            ))}
        </div>
    </div>
  )
}

export default Collection