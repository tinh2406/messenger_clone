"use client";

import useLoading from "@/app/hooks/useLoading";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memo, useEffect, useMemo } from "react";

interface DesktopItemProps {
  label: string;
  icon?: any;
  href: string;
}

export default memo(({ label, icon, href }: DesktopItemProps) => {
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
    <li
      onClick={() => {
        setIsLoading(true);
        router.push(href);
      }}
    >
      <Link
        href={href}
        className={clsx(
          `flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold hover:text-black hover:bg-gray-100`,
          active ? `text-black bg-gray-100` : "text-gray-500"
        )}
      >
        {icon}
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
});
