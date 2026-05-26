import React from 'react'
import { IoMdClose } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

type MobileMenuProps = {
     isMenuOpen:boolean;
     setIsMenuOpen:React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileMenu:React.FC<MobileMenuProps> = ({isMenuOpen,setIsMenuOpen}) => {

  const navigate = useNavigate();


  return (
    <div onClick={() => setIsMenuOpen(false)}
         className={`fixed h-screen w-full bg-white/5  shadow-2xl z-[999] block md:hidden transition-all duration-300 
                     ${isMenuOpen ?'backdrop-blur-xs' : 'backdrop-blur-none pointer-events-none'}`}>
        
     <div className={`h-full w-[300px] pt-[20px] pl-[20px] bg-white transition-all duration-300 absolute top-0 ${isMenuOpen ?'left-0' : 'left-[-300px]'}`}>

      <h1 className='font-semibold text-[25px] text-primary'>
        AS YOU WISH
      </h1>

           
      <div className='text-[22px] gap-1 mt-[30px]'>
              <button onClick={() => navigate("/") } className='cursor-pointer transition-colors duration-150 hover:text-[#B76E79] hover:font-semibold p-[10px]'>Home</button>
              <button className='cursor-pointer transition-colors duration-150 hover:text-[#B76E79] hover:font-semibold p-[10px]'>Shop</button>
              <button className='cursor-pointer transition-colors duration-150 hover:text-[#B76E79] hover:font-semibold p-[10px]'>Collections</button>
              <button className='cursor-pointer transition-colors duration-150 hover:text-[#B76E79] hover:font-semibold p-[10px]'>About</button>
      </div>


     </div>   

     <IoMdClose className={`absolute  text-[40px] right-[20px] top-[20px] transition-all duration-300
                ${isMenuOpen ? 'opacity-100' :  'opacity-0' }`}/> 

    </div>
  )
}

export default MobileMenu

