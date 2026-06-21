import React, { useRef } from 'react' 
import ProductCard from '../../../components/productCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination , Navigation , Autoplay } from 'swiper/modules'
import { Product } from '../../../data/productCard/product'
import { FaAngleLeft , FaAngleRight } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom'

const NewArrivals:React.FC = () => {
  const navigate = useNavigate()
     const swiperRef = useRef<any>(null);


  return (
     <div id='NewArrivals' className='max-w-[1100px] mx-auto w-full py-[60px] bg-white'>
        
        <div className='relative w-full px-[30px] xl:px-[0px]'>

        <h1  className='font-sans md:text-[45px] sm:text-[35px] text-[30px]  md:leading-12 leading-8'>
            New Arrivals

        </h1>
        <p className='md:text-[17px] sm:text-[12px] text-[11px] [word-spacing:3px]'> 
            Fresh styles just for you
        </p>

         <button onClick={() => navigate('/Collection')}
                 className='py-[10px] sm:text-[12px] text-[10px] bg-transparent border-[B76E79] border-2 px-[24px] font-semibold text-primary rounded-full mx-auto flex items-center gap-2 
                            absolute top-1/2 -translate-y-1/2 right-[30px] xl:right-[0px] cursor-pointer hover:scale-[1.05] transition duration-500 group'>
                View All        
        </button>


        </div>
        
       <div className='mt-[40px] sm:px-[30px] px-[12px] relative'>
      
       <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Navigation, Pagination, Autoplay]}  
        spaceBetween={20}                              
            
        breakpoints={{
            0: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
            480: {
                slidesPerView: 2,
                spaceBetween: 15,
            },
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 25,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
            1280: {
                slidesPerView: 4,
                spaceBetween: 20,
            },
            }}                                                          
        pagination={{ clickable: true }}              
        autoplay={{ delay: 3000 }}                    
        loop={true}                                  
        className="mySwiper sm:h-[430px] h-[330px] mt-[5px]"
    
      >
       
       {Product.map((item,index)=>(
        <SwiperSlide key={index}>
            <ProductCard id={item.id}
                         Image={item.mainImage}
                         price={item.price}
                         title={item.title}
                         />
        </SwiperSlide>
       ))}
        

      </Swiper>

      <div className='absolute xl:w-[105%] w-[100%] left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 md:flex justify-between items-center text-[22px] hidden'>  
        <button onClick={() => swiperRef.current?.slideNext()}
                className='p-[5px] cursor-pointer hover:scale-[1.2] transform duration-300'>
            <FaAngleLeft />
        </button>
         <button onClick={() => swiperRef.current?.slidePrev()}
                className='p-[5px] cursor-pointer hover:scale-[1.2] transform duration-300'>
            <FaAngleRight />
        </button>
      </div>

      </div>
        
    </div>
  )
}

export default NewArrivals