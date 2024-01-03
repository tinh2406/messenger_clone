"use client";
import { memo, useMemo } from "react";
import DesktopItem from "./DesktopItem";

import { HiArrowLeftOnRectangle } from "react-icons/hi2";
import { signOut } from "next-auth/react";
import Link from "next/link";
export default memo(() => {
  return (
    <Link
      onClick={() => signOut()}
      href="#"
      className={`flex
        gap-x-3
        text-sm
        leading-6
        font-semibold
        w-full
        justify-center
        p-4
        hover:text-black
        hover:bg-gray-100
        rounded-md
        text-gray-500
        `}
    >
      <HiArrowLeftOnRectangle className="h-6 w-6 shrink-0" />
    </Link>
  );
});
