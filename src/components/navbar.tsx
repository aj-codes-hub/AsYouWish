import React, { useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { LuMenu } from "react-icons/lu";
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../pages/context/cartContext';
import { IoHeart } from "react-icons/io5";


type NavbarProps = {
   setIsMenuOpen:React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar:React.FC<NavbarProps> = ({setIsMenuOpen}) => {

   const { totalItems } = useCart();  // Component ke andar yeh line

const [isOpen, setIsOpen] = useState(false);

const OpenMenu = () => {
  setIsMenuOpen(true);
  setIsOpen(!isOpen);

}

  const Location = useLocation();


  const MenuList = [
         {Name:"home", Path:"/"},
         {Name:"shop", Path:"/shop"},
         {Name:"collections", Path:"/collections"},
         {Name:"about", Path:"/about"},
  ];


  return (
    <div className='bg-white h-[65px] w-full justify-between fixed top-0 z-[999] flex items-center shadow-sm px-[15px] xl:px-[0]'>
       <div className='max-w-[1100px] h-full mx-auto w-full justify-between flex items-center'>
     
     <h1 onClick={() => window.location.pathname='/'}
         className='text-primary font-semibold cursor-pointer'>
       AS YOU WISH
     </h1>

     <nav className='text-[14px] gap-1 hidden md:flex'>
        {MenuList.map((item, index)=>(

        <Link key={index}
              to={item.Path}
              className={`cursor-pointer transition-colors duration-150 hover:text-[#B76E79] hover:font-semibold p-[10px] capitalize 
                           ${Location.pathname === item.Path 
                           ? 'text-[#B76E79] font-semibold' 
                           : ''}`}>
                   
                    {item.Name}
                </Link>
        ))}

     </nav>

     <div className='flex items-center  text-[16px]'>

       <button className='p-[10px] rounded-full'>
           <IoSearch />
       </button>

       <Link to={'/favurite-product'}
             className={`p-[10px] rounded-full transform-all duration-300
                        ${window.location.pathname === '/favurite-product' ? 'bg-[#fef4f0]' : ''}`}>
           {window.location.pathname === '/favurite-product' 
             ? <IoHeart className='text-[19px] text-[#B76E79] '/> 
             : <FaRegHeart />}
       </Link>
       
          <Link to="/cart"
             className={`cursor-pointer h-[40px] w-[40px] flex items-center justify-center rounded-full  relative 
                        ${window.location.pathname === '/cart' ? 'bg-[#fef4f0]' : ''}`}>


       {totalItems > 0 && (

        <div className='rounded-full w-[13px] h-[13px] flex items-center justify-center overflow-hidden bg-primary text-white absolute text-[9.5px] font-semibold top-[14%] right-[6%]'>
          <h2 className=''>{totalItems}</h2>
        </div>


       )}
        

       <FiShoppingCart />
       </Link>
     </div>

     <button onClick={OpenMenu} className='md:hidden block text-[24px]'>
         <LuMenu />         
     </button>
     </div>

    </div>
  )
}

export default Navbar

