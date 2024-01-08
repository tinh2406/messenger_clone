"use client";

import Avatar from "@/app/components/Avatar";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";

interface UserBoxProps {
  data: User & { conversationId?: string };
}

export default memo(({ data }: UserBoxProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (data.conversationId) {
      router.push(`/${data.conversationId}`);
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post("/api/conversations", {
        userId: data.id,
      });
      router.push(`/${res.data.id}`);
    } catch (error) {}
    setIsLoading(false);
  }, [data, router]);

  return (
    <div
      onClick={handleClick}
      className="
            w-full 
            relative 
            flex 
            items-center 
            space-x-3
            bg-white 
            p-3 
            px-6
            hover:bg-neutral-100 
            rounded-lg 
            transition 
            cursor-pointer"
    >
      <Avatar user={data} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-semibold text-gray-900">{data.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
});
