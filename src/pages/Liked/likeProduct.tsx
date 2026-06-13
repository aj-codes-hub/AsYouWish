import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/cartContext';
import { useWishlist } from '../context/wishlistContext';


const LikeProduct:React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    alert('Added to cart!');
  };

  if (wishlist.length === 0) {
    return (
      <div className='text-center py-20 pt-[65px]'>
        <h1 className='text-2xl font-bold mb-4'>Your Wishlist is Empty 💔</h1>
        <p className='text-gray-500 mb-6'>Save your favorite items here!</p>
        <Link to='/' className='bg-primary text-white px-6 py-2 rounded-lg'>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4 pt-[65px]'>
      <h1 className='text-2xl font-bold mb-6'>My Wishlist ({wishlist.length})</h1>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {wishlist.map((item) => (
          <div key={item.id} className='border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow'>
            
            <Link to={`/product-detail/${item.id}`}>
              <img 
                src={item.mainImage} 
                alt={item.title}
                className='w-full h-48 object-cover rounded-lg mb-4'
              />
            </Link>
            
            <Link to={`/product-detail/${item.id}`}>
              <h3 className='font-semibold hover:text-primary cursor-pointer'>
                {item.title}
              </h3>
            </Link>
            
            <p className='text-primary font-bold mt-2'>Rs. {item.price}</p>
            
            <div className='flex gap-2 mt-4'>
              <button 
                onClick={() => handleAddToCart(item)}
                className='flex-1 bg-primary text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90'
              >
                <FaShoppingCart /> Add to Cart
              </button>
              
              <button 
                onClick={() => removeFromWishlist(item.id)}
                className='bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600'
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikeProduct