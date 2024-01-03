"use client";

import clsx from "clsx";
import { HTMLInputTypeAttribute, memo, useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface InputProps {
  id: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
}
export default memo(
  ({ id, label, type, disabled, errors, required, register }: InputProps) => {
    const [_type, setType] = useState(type);
    
    return (
      <div>
        <label
          className="block text-sm font-medium leading-6 text-gray-900"
          htmlFor={id}
        >
          {label}
        </label>
        <div className="mt-2 relative flex items-center">
          <input
            id={id}
            type={_type}
            autoComplete={id}
            disabled={disabled}
            className={clsx(
              `
            block
            w-full
            rounded-md
            border-0
            p-1.5
            text-gray-900
            shadow-sm
            ring-1
            ring-inset
            ring-gray-400
            focus:ring-2
            focus:ring-inset
            focus:ring-sky-600
            placeholder:text-gray-400 
            sm:text-sm
            sm:leading-6
            `,
              errors[id] && "focus:ring-rose-500",
              disabled && "opacity-50 cursor-default"
            )}
            {...register(id, { required })}
          />
          {type === "password" && (
            <div className="absolute right-4 self-center cursor-pointer" onClick={()=>{
              console.log("Click");
              
              if(_type === type) setType("text")
              else setType(type)
            }}>
              {_type === "password" ? <FaRegEye /> : <FaRegEyeSlash />}
            </div>
          )}
        </div>
      </div>
    );
  }
);
