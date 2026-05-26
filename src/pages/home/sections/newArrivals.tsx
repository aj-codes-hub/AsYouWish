import React from 'react'
import ProductCard from '../../../components/productCard'

const NewArrivals:React.FC = () => {
  return (
     <div className='max-w-[1100px] mx-auto w-full py-[60px]'>
        
        <div className='relative w-full px-[30px] xl:px-[0px]'>

        <h1  className='font-sans md:text-[45px] sm:text-[35px] text-[30px]  md:leading-12 leading-8'>
            New Arrivals

        </h1>
        <p className='md:text-[17px] sm:text-[12px] text-[11px] [word-spacing:3px]'> 
            Fresh styles just for you
        </p>

         <button className='py-[10px] sm:text-[12px] text-[10px] bg-transparent border-[B76E79] border-2 px-[24px] font-semibold text-primary rounded-full mx-auto flex items-center gap-2 
                            absolute top-1/2 -translate-y-1/2 right-[30px] xl:right-[0px] cursor-pointer hover:scale-[1.05] transition duration-500 group'>
                View All        
        </button>


        </div>
        
       
         

        <div className='grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2 justify-center items-center gap-6 mt-[40px] px-[30px]'>
            <ProductCard Image='./images/golden-dress.jpg' price={2399}/>
            <ProductCard Image='./images/yellow-dress.jpg' price={3999}/>
            <ProductCard Image='./images/blue-dress.jpg' price={6999}/>
            <ProductCard Image='./images/white-dress.jpg' price={1599}/>
        </div>
        
    </div>
  )
}

export default NewArrivals