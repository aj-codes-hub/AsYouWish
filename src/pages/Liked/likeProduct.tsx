import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/wishlistContext';
import ProductCard from '../../components/productCard';

const LikeProduct: React.FC = () => {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className='text-center py-20 pt-[65px] h-screen flex flex-col items-center justify-center'>
        <h1 className='text-2xl font-bold mb-4'>Your Wishlist is Empty 💔</h1>
        <p className='text-gray-500 mb-6'>Save your favorite items here!</p>
        <Link to='/' className='bg-primary text-white px-6 py-2 rounded-lg'>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4 pt-[65px] bg-[#B76E79]/10'>
      <div className='max-w-[1100px] mx-auto'>
        <h1 className='text-2xl font-bold mb-6 text-center'>
          Your Favorite Products ({wishlist.length})
        </h1>

        <div className='grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2 justify-center items-center sm:gap-6 gap-4 mt-[40px] sm:px-[30px] px-[10px]'>
          {wishlist.map((item) => (
            <ProductCard
              key={item._id || item.id}
              id={item._id || item.id}
              Image={item.mainImage}
              price={item.price}
              title={item.title}
              HoverImg={item.moreImages || []}
              discount={item.discount || 0}
              DiscountPrice={item.DiscountPrice || item.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LikeProduct;