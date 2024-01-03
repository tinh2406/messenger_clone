"use client";

import { User } from "@prisma/client";
import clsx from "clsx";
import Image from "next/image";

interface AvatarGroupProps {
  users?: User[];
}
const positionMap = ["top-0 left-[12px]", "bottom-0", "bottom-0 right-0"];
export default ({ users }: AvatarGroupProps) => {
  const slicedUsers = users?.slice(0, 3);

  return (
    <div className="relative h-11 w-11">
      {slicedUsers?.map((user, i) => (
        <div
          key={user.name}
          className={clsx(
            `
                    absolute
                    inline-block
                    rounded-full
                    overflow-hidden
                    h-[21px] w-[21px]
                    `,
            positionMap[i]
          )}
        >
          <Image
            alt="AvtGroup"
            src={
              user.image ||
              "https://github.com/tinh2406/messenger-clone-nextjs13/blob/main/public/images/logo.png?raw=true"
            }
            fill
          />
        </div>
      ))}
    </div>
  );
};
