import React, { useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { FaRegHeart } from "react-icons/fa";
import { PiShoppingCartSimpleThin } from "react-icons/pi";
import { LuMenu } from "react-icons/lu";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../pages/context/cartContext';
import { IoHeart } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { CiHome } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { FiShoppingCart } from "react-icons/fi";
import { LuSearch } from "react-icons/lu";
import { CiMenuBurger } from "react-icons/ci";
import { useWishlist } from '../pages/context/wishlistContext';
import { useAuth } from '../Auth/authContext';
import SearchModal from './SearchModal';
import NotificationBell from './NotificationBell';

type NavbarProps = {
   setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
   isOpenLogiModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setIsMenuOpen, isOpenLogiModal }) => {

   const { isLoggedIn , user } = useAuth();
   const { totalItems } = useCart();  
   const { totalWishlistItems } = useWishlist()
   const navigation = useNavigate();
   const [isOpen, setIsOpen] = useState(false);
   const [isSearchOpen, setIsSearchOpen] = useState(false);
   const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
    const handleScroll = () => {
    if(window.scrollY >= 50){
        setIsScrolled(true);
     }
     else{
      setIsScrolled(false);
     };
   };
     window.addEventListener("scroll",handleScroll);
      handleScroll();
     return() => {
       window.removeEventListener("scroll",handleScroll);
     };
  
    },[]);

   const OpenMenu = () => {
      setIsMenuOpen(true);
      setIsOpen(!isOpen);
   }

   const hangleLoginModalOpen = () => {
   
       
      switch(true){
         
         case isLoggedIn && user?.role === "user":
            navigation('/profile')
         break;

         case isLoggedIn && user?.role === "admin":
            navigation('/admin/dashboard')
         break;

         default:
            isOpenLogiModal(true);
            break;
      }


    
   }

   const Location = useLocation();

   const MenuList = [
      { Name: "home", Path: "/" },
      { Name: "collections", Path: "/collection" },
      { Name: "about", Path: "/about" },
   ];

   return (
      <>
         {/* ===== SEARCH MODAL ===== */}
         <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

         <div className={`h-[65px] transform-all duration-500 sm:taxt-white text-black bg-[rgb(255,255,255)] w-full justify-between fixed sm:top-0 bottom-0 z-[999] flex items-center  sm:px-[15px] xl:px-[0] 
                         ${isScrolled && window.location.pathname === "/" ? "sm:backdrop-blur-sm sm:bg-black/30" : "sm:bg-black/0"}
                         ${window.location.pathname !== "/" ? "sm:backdrop-blur-sm sm:bg-black/30" : "sm:bg-black/0"}
                         `}>

            <div className='max-w-[1100px] h-full mx-auto w-full justify-between sm:flex items-center hidden'>
         
               <div className='cursor-pointer md:h-[45px] md:w-[160px] h-[30px] w-[110px] relative'
                    onClick={() => window.location.pathname='/'}>
                  <img src='/images/Logo.png' alt='LOGO'
                       className='w-full h-full'/>
               </div>     

               <nav className='text-[14px] gap-1 hidden md:flex'>
                  {MenuList.map((item, index) => (
                     <Link key={index}
                           to={item.Path}
                           className={`cursor-pointer  transition-colors duration-150 hover:text-[#B76E79] hover:font-semibold p-[10px] capitalize 
                              ${Location.pathname === item.Path ? 'text-[#B76E79] font-semibold' : 'text-white'}`}>
                        {item.Name}
                     </Link>
                  ))}
               </nav>

               <div className='flex items-center gap-1 text-[16px] text-white'>

                  {/* ✅ SEARCH BUTTON - Opens Search Modal */}
                  <button 
                     onClick={() => setIsSearchOpen(true)}
                     className='p-[10px] rounded-full hover:bg-[#000000] transition cursor-pointer'
                  >
                     <LuSearch />
                  </button>

                  <Link to={'/favurite-product'}
                        className={`p-[10px] rounded-full transform-all duration-300 relative
                           ${window.location.pathname === '/favurite-product' ? 'bg-[#000000]' : ''}`}>
                     {window.location.pathname === '/favurite-product' 
                        ? <IoHeart className='text-[19px] text-[#B76E79] '/> 
                        : <FaRegHeart />}

                     {totalWishlistItems > 0 && (
                        <div className='rounded-full w-[12px] h-[12px] flex items-center justify-center overflow-hidden bg-[#B76E79] text-white absolute text-[9.5px] font-semibold top-[14%] right-[6%]'>
                           <h2>{totalWishlistItems}</h2>
                        </div>
                     )}
                  </Link>

                  <button onClick={hangleLoginModalOpen}
                          className={`p-[10px] rounded-full text-[20px] cursor-pointer 
                             ${window.location.pathname === '/profile' ? 'bg-[#000000] text-white' : ''}`}>
                     <IoPersonOutline />
                  </button>
                  
                  
                  <Link to="/cart"
                        className={`cursor-pointer h-[40px] w-[40px] flex items-center justify-center rounded-full relative 
                           ${window.location.pathname === '/cart' ? 'bg-[#000000] text-white' : ''}`}>
                     {totalItems > 0 && (
                        <div className='rounded-full w-[13px] h-[13px] flex items-center justify-center overflow-hidden bg-[#B76E79] text-white absolute text-[9.5px] font-semibold top-[14%] right-[6%]'>
                           <h2>{totalItems}</h2>
                        </div>
                     )}
                     <FiShoppingCart />
                  </Link>

                  {user?.role === "admin" ? <NotificationBell/> : ""}
                  
               </div>

               <button onClick={OpenMenu} className='md:hidden block text-[24px] text-white'>
                  <LuMenu />         
               </button>
            </div>
            
            {/* mobile menu starts here  */}
            <h1 className='fixed text-primary top-[12px] left-1/2 -translate-x-1/2 font-bold text-[30px] sm:hidden'>
               <img src="/images/Logo.png" className='h-[35px] w-[150px]' alt="logo" />
            </h1>
            
            <div className='fixed sm:hidden top-[14px] right-[20px] bg-black/30 backdrop-blur-sm rounded-full'>
               {user?.role === "admin" ? <NotificationBell/> : ""}
            </div>

            <div className='grid grid-cols-5 h-full w-full sm:hidden'>

               <div onClick={() => setIsSearchOpen(true)} 
                    className='flex flex-col items-center justify-center text-[26px]'>
                    <CiSearch className='absolute bg-white rounded-full ml-4 mb-2 text-[22px]'/>
                    <CiMenuBurger />
                    <h2 className='text-[11px]'>menu</h2>
                </div>

               <Link to="/cart" className={`flex flex-col items-center justify-center text-[26px] rounded-[30%] relative
                                          ${window.location.pathname === "/cart" ? 'm-1 bg-black text-white' : ''}`}>
                  <PiShoppingCartSimpleThin />
                  <h2 className='text-[11px]'>Cart</h2>
                  
                  {totalItems > 0 && (
                     <div className='rounded-full w-[13px] h-[13px] flex items-center justify-center overflow-hidden bg-[#B76E79] text-white absolute text-[9.5px] font-semibold top-[15%] right-[26%]'>
                        <h2>{totalItems}</h2>
                     </div>
                  )}
               </Link>

               <Link to='/' className={`flex flex-col items-center justify-center text-[26px] rounded-[30%] 
                                       ${window.location.pathname === "/" ? 'm-1 bg-black text-white' : ''}`}>
                  <CiHome />
                  <h2 className='text-[11px]'>Home</h2>
               </Link>

               <Link to={'/favurite-product'} className={`flex flex-col items-center justify-center text-[26px] rounded-[30%] relative
                                             ${window.location.pathname === "/favurite-product" ? 'm-1 bg-black text-white' : ''}`}>
                  <CiHeart />
                  <h2 className='text-[11px]'>Favurite</h2>
                  
                  {totalWishlistItems > 0 && (
                     <div className='rounded-full w-[13px] h-[13px] flex items-center justify-center overflow-hidden bg-[#B76E79] text-white absolute text-[9.5px] font-semibold top-[15%] right-[26%]'>
                        <h2>{totalWishlistItems}</h2>
                     </div>
                  )}
               </Link>

               <div onClick={hangleLoginModalOpen} className={`flex flex-col items-center justify-center text-[26px] rounded-[30%] 
                                                   ${window.location.pathname === "/Profile" ? 'm-1 bg-black text-white' : ''}`}>
                  <IoPersonOutline />
                  <h2 className='text-[11px]'>Account</h2>
               </div>
            </div>
            <div className="flex items-center gap-4">
          </div>
         </div>
      </>
   )
}

export default Navbar

