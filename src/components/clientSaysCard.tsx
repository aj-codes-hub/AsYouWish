import React from 'react'
import { FaStar } from "react-icons/fa";

const ClientSaysCard:React.FC = () => {
  return (
    <div className='bg-[#FFF8F5] flex flex-col justify-center gap-4 rounded-2xl shadow-sm hover:shadow-xl hover:scale-[1.01] p-[25px]
                    transition-all duration-500'>
        <div className='flex md:gap-2 gap-1 text-primary md:text-[16px] text-[12px]'>
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
        </div>

        <p className='md:text-[16px] text-[12px]'>
          "Absolutely love the quality and fit! The fabrics are 
           luxurious and the designs are timeless. My go-to store
           for elegant fashion."
        </p>

        <h1 className='text-primary'>
          Sarah Johnson
        </h1>

    </div>
  )
}

export default ClientSaysCard