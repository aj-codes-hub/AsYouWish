import React from 'react'
import ProductCard from '../../../components/productCard'
import ClientSaysCard from '../../../components/clientSaysCard'

const ClientSays:React.FC = () => {
  return (
    <div className='w-full py-[60px] '>
   
     <div className='max-w-[1100px] mx-auto'>

        <h1 className='font-sans md:text-[45px] text-[35px] text-center md:leading-12 leading-10'>
            What Our Clients Say
        </h1>
        <p className='md:text-[17px] text-[12px] text-center [word-spacing:3px]'> 
            Trusted by thousands of fashion-forward women
        </p>

        <div className='w-full max-w-[1100px] mt-[30px]'>
            <div className='grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-center items-center gap-7 px-[30px] xl:px-[0px]'>

            <ClientSaysCard />
            <ClientSaysCard />
            <ClientSaysCard />

            </div>
        </div>

        </div>
        
    </div>
  )
}

export default ClientSays