import React, { useState, useEffect } from 'react';
import ProductCard from '../../../components/productCard';
import { getProducts } from '../../../services/productService';

interface ProductType {
  _id?: string;
  id?: number;
  title: string;
  price: number;
  mainImage: string;
  Event?: string;
  discount: number;
  details?: string;
}

const BestSellers: React.FC = () => {
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [currentProducts, setCurrentProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setAllProducts(data);
        
        // ✅ Pehle 3 products show karo
        if (data.length > 0) {
          const firstThree = data.slice(0, 3);
          setCurrentProducts(firstThree);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Auto-rotate products every 5 seconds
  useEffect(() => {
    if (allProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 3) % allProducts.length;
        const nextProducts = allProducts.slice(nextIndex, nextIndex + 3);
        
        // Agar last mein 3 se kam products bachein to shuru se le lo
        if (nextProducts.length < 3) {
          const remaining = allProducts.slice(nextIndex);
          const extra = allProducts.slice(0, 3 - remaining.length);
          setCurrentProducts([...remaining, ...extra]);
        } else {
          setCurrentProducts(nextProducts);
        }
        
        return nextIndex;
      });
    }, 5000); // ✅ 5 seconds

    return () => clearInterval(interval);
  }, [allProducts]);

  if (loading) {
    return (
      <div className="w-full bg-[#FFF8F5] py-[60px] flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B76E79] border-t-transparent"></div>
      </div>
    );
  }

  if (allProducts.length === 0) {
    return (
      <div className="w-full bg-[#FFF8F5] py-[60px]">
        <div className="max-w-[1100px] mx-auto text-center">
          <h1 className="font-sans md:text-[45px] text-[35px] text-center md:leading-12 leading-10">
            Best Sellers
          </h1>
          <p className="text-gray-500 mt-10">No products available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFF8F5] py-[60px]">
      <div className="max-w-[1100px] mx-auto">
        <h1 className="font-sans md:text-[45px] text-[35px] text-center md:leading-12 leading-10">
          Best Sellers
        </h1>
        <p className="md:text-[17px] text-[12px] text-center [word-spacing:3px]">
          Customer favorites that never go out of style
        </p>

        {/* ✅ Products Grid - Sirf 3 Products */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-center items-center gap-6 mt-[40px] px-[30px]">
          {currentProducts.map((item, index) => (
            <ProductCard
              key={item._id || item.id || index}
              id={item._id || item.id}
              Image={item.mainImage}
              price={item.price}
              title={item.title}
              discount={item.discount}
              DiscountPrice={Math.round((item.price) - item.price * item.discount / 100)}
              className="h-[500px]"
            />
          ))}
        </div>

        {/* ✅ Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.ceil(allProducts.length / 3) }).map((_, index) => {
            const startIndex = index * 3;
            const isActive = startIndex === currentIndex;
            return (
              <button
                key={index}
                onClick={() => {
                  const newIndex = startIndex;
                  const nextProducts = allProducts.slice(newIndex, newIndex + 3);
                  if (nextProducts.length < 3) {
                    const remaining = allProducts.slice(newIndex);
                    const extra = allProducts.slice(0, 3 - remaining.length);
                    setCurrentProducts([...remaining, ...extra]);
                  } else {
                    setCurrentProducts(nextProducts);
                  }
                  setCurrentIndex(newIndex);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive ? 'bg-[#B76E79] w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BestSellers;