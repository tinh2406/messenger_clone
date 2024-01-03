"use client";
import { User } from "@prisma/client";
import Image from "next/image";
import { memo, useCallback, useState } from "react";

interface AvatarProps {
  user: User;
}

export default memo(({ user }: AvatarProps) => {
  return (
    <div
      className="
        relative
        inline-block
        rounded-full
        overflow-hidden
        h-11
        w-11
        mx-auto
        cursor-pointer
      "
    >
      <Image
        priority
        alt="Avatar"
        src={
          user?.image ||
          "https://github.com/tinh2406/messenger-clone-nextjs13/blob/main/public/images/logo.png?raw=true"
        }
        fill
        sizes="36px"
      />
    </div>
  );
});
