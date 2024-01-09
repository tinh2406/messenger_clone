"use client";

import useLoading from "@/app/hooks/useLoading";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memo, useEffect, useMemo } from "react";

interface MobileItemProps {
  href: string;
  icon: any;
}
export default memo(({ href, icon }: MobileItemProps) => {
  const pathName = usePathname();
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const active = useMemo(() => {
    if (pathName === "/users")
      if (href === "/users") return true;
      else return false;

    return href === "/";
  }, [pathName]);
  useEffect(() => {
    setIsLoading(false);
  }, [active]);
  return (
    <Link
      href={href}
      className={clsx(
        `flex
        gap-x-3
        text-sm
        leading-6
        font-semibold
        w-full
        justify-center
        p-4
        hover:text-black
        hover:bg-gray-100
        `,
        active ? "bg-gray-100 text-black" : "text-gray-500"
      )}
      onClick={() => {
        setIsLoading(true);
        router.push(href);
      }}
    >
      {icon}
    </Link>
  );
});
