import React, { useEffect, useState } from 'react'
import ProductCard from '../../../components/productCard'
import { getProducts } from '../../../services/productService';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';

interface ProductType {
  _id?: string;
  id?: number;
  title: string;
  price: number;
  mainImage: string;
  isFeatured?: boolean;
  discount: number;
  details?: string;
  rating?: number;
  moreImages: string[];
}

const FeaturedCollection: React.FC = () => {

const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 });


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

  // ✅ Filter Featured Collection
  const featuredProducts = products.filter(
    (product) => product.isFeatured === true
  );

  if (loading) {
    return (
      <div className="w-full bg-[#FFF8F5] py-[60px] flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B76E79] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div id='FeatureCollection' className='w-full bg-[#FFF8F5] py-[60px] mt-[620px] sm:mt-0 relative'>
   
      <div className='w-full h-[120px] absolute top-[-70px] overflow-hidden sm:hidden'>
        <img src="/images/downBorder.png" className='' alt="border" />
      </div>

      <div className='max-w-[1100px] mx-auto'>

        <h1 ref={ref} className={`font-sans md:text-[45px] text-[35px] text-center md:leading-12 leading-10
                                 ${isVisible ? "animate-fade-in-up delay-100" : "opacity-0 scale-95"}`}>
          Featured Collection
        </h1>
        <p className={`md:text-[17px] text-[12px] text-center [word-spacing:3px]
                       ${isVisible ? "animate-fade-in-up delay-200" : "opacity-0 scale-95"}`}>
          Handpicked styles for the modern woman
        </p>

        <div className={`grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2 justify-center items-center sm:gap-6 gap-4 mt-[40px] sm:px-[30px] px-[10px]
                        ${isVisible ? "animate-scale-in delay-300" : "opacity-0 scale-95"}`}>
          {featuredProducts.map((item) => (
            <ProductCard
              key={item._id || item.id || Math.random().toString()}
              id={item._id as any || item.id as any}
              Image={item.mainImage}
              HoverImg={item.moreImages}
              price={item.price}
              title={item.title}
              discount={item.discount}
              DiscountPrice={Math.round((item.price) - item.price * item.discount / 100)}
              rating={item.rating || 0}
            />
          ))}
        </div>

        {/* ✅ Agar koi product nahi mila */}
        {featuredProducts.length === 0 && !loading && (
          <div className="text-center py-10 text-gray-500">
            No featured products available
          </div>
        )}

      </div>
    </div>
  )
}

export default FeaturedCollection