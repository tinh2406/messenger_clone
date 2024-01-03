"use client"

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"

interface MessageInputProps {
    id: string
    register: UseFormRegister<FieldValues>
    required?: boolean
    placeholder?: string
    type?: string
    errors: FieldErrors
}

export default ({
    id,
    type,
    register,
    required,
    placeholder,
    errors
}: MessageInputProps) => {
    return (
        <div className="relative w-full">
            <input type={type}
                id={id}
                autoComplete={id}
                {...register(id, { required })}
                placeholder={placeholder}
                className="
               text-black
               font-light
               py-2
               px-4
               bg-neutral-100
               w-full
               rounded-full
               focus:outline-none"
            />
        </div>
    )
}