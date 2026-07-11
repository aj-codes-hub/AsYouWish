import React, { useEffect, useRef, useState } from 'react' 
import ProductCard from '../../../components/productCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination , Navigation , Autoplay } from 'swiper/modules'
import { FaAngleLeft , FaAngleRight } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../../../services'



interface ProductType {
  _id?: string;
  id?: number;
  title: string;
  price: number;
  mainImage: string;
  isFeatured?: boolean;
  discount: number;
  details?: string;
  moreImages: string[];
}

const NewArrivals:React.FC = () => {
  const navigate = useNavigate()
     const swiperRef = useRef<any>(null);

      // ✅ State ka type sahi karo
       const [products, setProducts] = useState<ProductType[]>([]);
       const [loading, setLoading] = useState(true);
     
       useEffect(() => {
         const fetchProducts = async () => {
           try {
             const data = await getProducts();
             setProducts(data);
           } catch (error) {
             console.error('Error fetching products:', error);
           } finally {
             setLoading(false);
           }
         };
         fetchProducts();
       }, []);
    
     
       if (loading) {
         return (
           <div className="w-full bg-[#FFF8F5] py-[60px] flex justify-center items-center min-h-[300px]">
             <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B76E79] border-t-transparent"></div>
           </div>
         );
       }
     


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
       
       {products.map((item,index)=>(
        <SwiperSlide key={index}>
            <ProductCard  key={item._id || item.id || Math.random().toString()}
                          id={item._id as any || item.id as any}
                          Image={item.mainImage}
                          price={item.price}
                          title={item.title}
                          HoverImg={item.moreImages}
                          discount={item.discount}
                          DiscountPrice={Math.round((item.price) - item.price * item.discount / 100)}
                         />
        </SwiperSlide>
       ))}
        

      </Swiper>

      <div className='absolute xl:w-[105%] w-[100%] left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 md:flex justify-between items-center text-[22px] hidden'>  
        <button onClick={() => swiperRef.current?.slidePrev()}
                className='p-[5px] cursor-pointer hover:scale-[1.2] transform duration-300'>
            <FaAngleLeft />
        </button>
         <button onClick={() => swiperRef.current?.slideNext()}
                className='p-[5px] cursor-pointer hover:scale-[1.2] transform duration-300'>
            <FaAngleRight />
        </button>
      </div>

      </div>
        
    </div>
  )
}

export default NewArrivals