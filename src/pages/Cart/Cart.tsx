import React from 'react'
import { useCart } from '../context/cartContext';
import { Link } from 'react-router-dom';


const CartPage:React.FC = () => {

const {cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

if(cart.length === 0){
  return(
    <div className='flex items-center justify-center w-full sm:h-screen h-[80vh] relative bg-[#0000003f]'>
      <img src="/images/empty-closet.jpg" alt="empty-closet" 
          className='absolute w-full h-full z-[-10]' 
      />
     <div className='text-center sm:py-20 py-8 sm:px-30 px-10 backdrop-blur-xs bg-white/10'>
        <h1 className='sm:text-2xl text-[22px] font-bold mb-4'>Your Cart is Empty 😢</h1>
        <Link to='/' className='bg-primary text-white sm:px-6 px-4 py-2 sm:rounded-lg rounded-sm sm:text-[16px] text-[15px]'> 
          Continue Shopping
        </Link>
      </div>
      </div>
  );
};

  return (
    <div className='container mx-auto p-4 min-h-[80vh]'>
      <h1 className='text-2xl font-bold mb-6'>Shopping Cart</h1>
      
      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Left side - Cart items */}
        <div className='lg:w-2/3'>
          {cart.map((item) => (
            <div key={item.id} className='flex gap-4 border-b py-4'>
              <img 
                src={item.mainImage} 
                alt={item.title}
                className='w-24 h-24 object-cover rounded'
              />
              
              <div className='flex-1'>
                <h3 className='font-semibold'>{item.title}</h3>
                <p className='text-primary font-bold'>Rs. {item.price}</p>
                
                {/* Quantity buttons */}
                <div className='flex items-center gap-3 mt-2'>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className='border px-2 py-1 rounded cursor-pointer'
                  >
                    -
                  </button>
                  
                  <span>{item.quantity}</span>
                  
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className='border px-2 py-1 rounded cursor-pointer'
                  >
                    +
                  </button>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className='text-red-500 ml-4 cursor-pointer'
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              {/* Item total price */}
              <div className='text-right'>
                <p className='font-bold'>Rs. {item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Right side - Order summary */}
        <div className='lg:w-1/3'>
          <div className='bg-gray-50 p-6 rounded-lg'>
            <h2 className='text-xl font-bold mb-4'>Order Summary</h2>
            
            <div className='flex justify-between mb-2'>
              <span>Total Items:</span>
              <span>{totalItems}</span>
            </div>
            
            <div className='flex justify-between mb-4'>
              <span>Total Price:</span>
              <span className='text-primary font-bold'>Rs. {totalPrice}</span>
            </div>
            
            <button className='bg-primary text-white w-full py-3 rounded-lg'>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default CartPage