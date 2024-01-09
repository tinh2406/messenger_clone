"use client";
import { User } from "@prisma/client";
import Image from "next/image";
import { memo, useCallback, useState } from "react";
import SettingModal from "./SettingModal";

interface AvatarProps {
  user: User;
}

export default memo(({ user }: AvatarProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const onClose = useCallback(() => {
    setIsOpenModal(false);
  }, []);
  
  return (
    <>
      <div
        className="
        relative
        inline-block
        rounded-full
        overflow-hidden
        h-9
        w-9
        md:h-11
        md:w-11
        mx-auto
        cursor-pointer
      "
        onClick={() => {
          setIsOpenModal(true);
        }}
      >
        <Image
          priority
          alt="Avatar"
          src={
            user?.image ||
            "/logo.png"
          }
          fill
          sizes="36px"
        />
      </div>
      {user&&
      <SettingModal user={user} isOpen={isOpenModal} onClose={onClose} />}
    </>
  );
});
