 import React, { useState } from 'react'
 import { TbEyeClosed } from "react-icons/tb";
 import { HiOutlineEye } from "react-icons/hi2";
 

interface ImputProps {
    type?: 'text' | 'password' | 'email';
    name?: string;
    placeholder?: string;
    className?: string;
    value: string;
    onChange:(value: string) => void;
    required?: boolean; 
}

const Input:React.FC<ImputProps> = ({type= 'text' ,name,value,placeholder,className,required,onChange}) => {
      
    const [isActive, setISActive] = useState<boolean>(false);
    const [showPasswod , setShowPassword] = useState(false);
    const onFocuse =  isActive || value.length > 0;

   const handheShowPass = () => {
        setShowPassword(!showPasswod);
   }


return(
    <div className='relative '>
    <label  className={`absolute text-black/50 transform duration-200 -translate-y-1/2 left-[5px] focus:text-5xl pointer-events-none 
                        ${onFocuse ? 'top-1 text-[10.5px] font-semibold' : 'top-1/2 text-[14px]'}`}>
           <span>
             {placeholder} 
             <span className={`text-[#dc0000] ml-[2px] ${required ? "" : "hidden"}`}> 
                *
             </span>
            </span>
    </label>
    <input type={showPasswod ? 'text' : type }
           name={name}
           value={value}
           onChange={(e) => onChange(e.target.value)}
           onFocus={() => setISActive(true)}
           onBlur={() => setISActive(false)}
           required={required}
           className={`w-full border-b text-[14px] h-[40px] font-semibold text-black border-b-[#0000008e] outline-0 px-[5px]
                      ${className}`} />
     
        <div onClick={handheShowPass}
                className={`absolute right-[10px] top-1/2 -translate-y-1/2 text-[20px] cursor-pointer py-1 px-2
                           ${type === "password" ? '' : 'hidden'}`}>
            {showPasswod ? <HiOutlineEye/> : <TbEyeClosed /> }
        </div>

    </div>
  )
}

export default Input