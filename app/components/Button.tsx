"use client";

import clsx from "clsx";
import { memo } from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

export default memo(
  ({
    onClick,
    type,
    disabled,
    fullWidth,
    secondary,
    danger,
    children,
  }: ButtonProps) => {
    return (
      <button
        onClick={onClick}
        type={type}
        disabled={disabled}
        className={clsx(
                `flex
                justify-center
                rounded-md
                px-3
                py-2
                text-sm
                select-none
                font-semibold
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2`,
          disabled && "opacity-50 cursor-default",
          fullWidth && "w-full",
          secondary ? "text-gray-900" : "text-white",
          danger &&
            "bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600",
          !secondary &&
            !danger &&
            "bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600"
        )}
      >
        {children}
      </button>
    );
  }
);
