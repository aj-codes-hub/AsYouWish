import React, { useState, useEffect } from 'react';
import ProductCard from '../components/productCard';
import { getProducts } from '../services';


const Collection: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-[80px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B76E79] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center py-[80px]">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-[#B76E79] text-white px-6 py-2 rounded-xl hover:bg-[#B76E79]/90 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='py-[80px] mt-[65px]'>
      <div className='container mx-auto px-4'>
        <h1 className='text-center text-3xl font-bold text-gray-800 mb-2'>All Collections</h1>
        <p className='text-center text-gray-500 mb-8'>
          {products.length} {products.length === 1 ? 'product' : 'products'} available
        </p>
        
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No products available yet</p>
            <p className="text-gray-400 text-sm mt-2">Check back soon for new arrivals!</p>
          </div>
        ) : (
          <div className='grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2 justify-center items-center sm:gap-6 gap-4 mt-[40px] sm:px-[30px] px-[10px] max-w-[1100px] mx-auto'>
            {products.map((item) => (
              <ProductCard
                key={item._id || item.id}
                id={item._id || item.id}
                Image={item.mainImage}
                price={item.price}
                title={item.title}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;