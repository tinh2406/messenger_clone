"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useMemo } from "react";

interface DesktopItemProps {
  label: string;
  icon?: any;
  href: string;
  onClick?: () => void;
}

export default memo(({ label, icon, href, onClick }: DesktopItemProps) => {
  const pathName = usePathname();

  const active = useMemo(() => {
    if (pathName === "/users")
      if (href === "/users") return true;
      else return false;

    return href === "/";
  }, [pathName]);

  return (
    <li onClick={onClick}>
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
