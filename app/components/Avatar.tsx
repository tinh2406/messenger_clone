"use client";
import { User } from "@prisma/client";
import Image from "next/image";
import { memo } from "react";
import useActiveList from "../hooks/useActiveList";

interface AvatarProps {
  user: User;
}

export default memo(({ user }: AvatarProps) => {
  const { members } = useActiveList();

  const isActive = members.indexOf(user?.email!) !== -1;
  return (
    <div
      className="
        relative
        inline-block
        rounded-full
        h-11
        w-11
        mx-auto
        cursor-pointer
      "
    >
      <Image
        priority
        alt="Avatar"
        src={user?.image || "/logo.png"}
        fill
        sizes="36px"
        className="rounded-full"
      />
      {isActive && (
        <span className="absolute block rounded-full bg-green-500 ring-2 ring-white bottom-0 right-0 h-3 w-3"></span>
      )}
    </div>
  );
});
