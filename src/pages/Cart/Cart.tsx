import React from 'react';
import { useCart } from '../context/cartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice, clearBuyNow } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    clearBuyNow();
    navigate('/checkout');
  };

  // ✅ FIXED: Product click handler with id parameter
  const handleProductClick = (id: number | string) => {
    navigate(`/product-detail/${id}`);
  };

  if (cart.length === 0) {
    return (
      <div className='flex items-center justify-center w-full sm:h-screen h-[80vh] relative bg-[#0000003f]'>
        <img src="https://res.cloudinary.com/sjdfl12v/image/upload/v1784039212/empty-closet_pli1jc.jpg" 
          className='absolute w-full h-full z-[-10] object-cover'
        />
        <div className='text-center sm:py-20 py-10 sm:px-30 px-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl'>
          <div className='flex justify-center mb-4'>
            <div className='bg-[#B76E79]/15 p-4 rounded-full'>
              <ShoppingBag className='w-8 h-8 text-[#B76E79]' />
            </div>
          </div>
          <h1 className='sm:text-2xl text-[22px] font-bold mb-2 text-white'>Your Cart is Empty</h1>
          <p className='text-white/80 text-sm mb-6'>Looks like you haven't added anything yet.</p>
          <Link
            to='/'
            className='inline-flex items-center gap-2 bg-[#B76E79] hover:bg-[#a25c67] text-white sm:px-6 px-5 py-2.5 sm:rounded-lg rounded-md sm:text-[16px] text-[15px] font-medium cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-[#B76E79]/30 hover:-translate-y-0.5'
          >
            Continue Shopping
            <ArrowRight className='w-4 h-4' />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4 sm:p-6 min-h-[80vh] bg-gray-50/50'>
      <div className='flex items-center justify-between mb-6 mt-[40px] sm:mb-8'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>Your Cart</h2>
          <p className='text-gray-500 text-sm mt-1'>{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
        {/* Left side - Cart items */}
        <div className='lg:w-2/3 flex flex-col gap-3'>
          {cart.map((item) => (
            <div
              key={item.id}
              className='flex gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#B76E79]/20 transition-all duration-200'
            >
              {/* ✅ FIXED: Pass item.id to handleProductClick */}
              <img
                src={item.mainImage}
                alt={item.title}
                onClick={() => handleProductClick(item.id)}
                className='w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:scale-[1.08] transition-transform duration-300'
              />

              <div className='flex-1 min-w-0'>
                {/* ✅ Click on title also navigates to product detail */}
                <h3
                  onClick={() => handleProductClick(item.id)}
                  className='font-semibold text-gray-900 truncate cursor-pointer hover:text-[#B76E79] transition-colors duration-200'
                >
                  {item.title}
                </h3>
                <p className='text-[#B76E79] font-bold mt-0.5'>Rs. {item.price}</p>

                {/* Quantity buttons */}
                <div className='flex items-center gap-3 mt-3'>
                  <div className='flex items-center border border-gray-200 rounded-lg overflow-hidden'>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className='p-2 cursor-pointer text-gray-600 hover:bg-[#B76E79]/10 hover:text-[#B76E79] transition-colors duration-150'
                      aria-label='Decrease quantity'
                    >
                      <Minus className='w-3.5 h-3.5' />
                    </button>

                    <span className='w-8 text-center font-medium text-sm select-none'>{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className='p-2 cursor-pointer text-gray-600 hover:bg-[#B76E79]/10 hover:text-[#B76E79] transition-colors duration-150'
                      aria-label='Increase quantity'
                    >
                      <Plus className='w-3.5 h-3.5' />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className='flex items-center gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors duration-150 text-sm font-medium'
                  >
                    <Trash2 className='w-3.5 h-3.5' />
                    <span className='hidden sm:inline'>Remove</span>
                  </button>
                </div>
              </div>

              {/* Item total price */}
              <div className='text-right flex-shrink-0'>
                <p className='font-bold text-gray-900'>Rs. {item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right side - Order summary */}
        <div className='lg:w-1/3'>
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-[80px]'>
            <h2 className='text-xl font-bold mb-4 text-gray-900'>Order Summary</h2>

            <div className='flex justify-between mb-2 text-gray-600'>
              <span>Total Items</span>
              <span className='font-medium text-gray-900'>{totalItems}</span>
            </div>

            <div className='flex justify-between pb-4 border-b border-gray-100 text-gray-600'>
              <span>Subtotal</span>
              <span className='font-medium text-gray-900'>Rs. {totalPrice}</span>
            </div>

            <div className='flex justify-between mt-4 mb-5'>
              <span className='font-semibold text-gray-900'>Total</span>
              <span className='text-[#B76E79] font-bold text-lg'>Rs. {totalPrice}</span>
            </div>

            <button
              onClick={handleCheckout}
              className='group bg-[#B76E79] hover:bg-[#a25c67] text-white w-full py-3 rounded-lg cursor-pointer font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-[#B76E79]/30'
            >
              Proceed to Checkout
              <ArrowRight className='w-4 h-4 transition-transform duration-200 group-hover:translate-x-1' />
            </button>

            <Link
              to='/'
              className='block text-center mt-4 text-sm text-gray-500 hover:text-[#B76E79] cursor-pointer transition-colors duration-150'
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;