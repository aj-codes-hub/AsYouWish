import React, { useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { LuMenu } from "react-icons/lu";
import { useLocation, Link, useNavigate } from 'react-router-dom';


type NavbarProps = {
   setIsMenuOpen:React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar:React.FC<NavbarProps> = ({setIsMenuOpen}) => {

const [isOpen, setIsOpen] = useState(false);

const OpenMenu = () => {
  setIsMenuOpen(true);
  setIsOpen(!isOpen);

}

  const Location = useLocation();
  const navigate = useNavigate();


  const MenuList = [
         {Name:"home", Path:"/"},
         {Name:"shop", Path:"/shop"},
         {Name:"collections", Path:"/collections"},
         {Name:"about", Path:"/about"},
  ];


  return (
    <div className='bg-white h-[65px] w-full justify-between fixed top-0 z-[999] flex items-center shadow-sm px-[15px] xl:px-[0]'>
       <div className='max-w-[1100px] h-full mx-auto w-full justify-between flex items-center'>
     
     <h1 className='text-primary font-semibold'>
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

     <div className='flex items-center gap-6 text-[16px]'>
       <IoSearch />
       <FaRegHeart />
          <div onClick={() => navigate('/add-To-cart')}
             className={`cursor-pointer h-[40px] w-[40px] flex items-center justify-center rounded-full  relative 
                        ${window.location.pathname === '/add-To-cart' ? 'bg-[#FFF8F5]' : ''}`}>

        <div className='rounded-full w-[13px] h-[13px] flex items-center justify-center overflow-hidden bg-primary text-white absolute text-[9.5px] font-semibold top-[14%] right-[6%]'>
          <h2>2</h2>
        </div>
       <FiShoppingCart />
       </div>
     </div>

     <button onClick={OpenMenu} className='md:hidden block text-[24px]'>
         <LuMenu />         
     </button>
     </div>

    </div>
  )
}

export default Navbar

