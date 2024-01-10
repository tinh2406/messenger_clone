"use client";

import { User } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import UserBox from "./UserBox";
import useOnScreen from "@/app/hooks/useOnScreen";
import axios from "axios";
import useUsers from "@/app/hooks/useUsers";

type UsersResponse = {
  data: User[];
  meta: {
    total: number;
    current: number;
  };
};

interface UserListClientProps {
  initData: UsersResponse;
}

export default ({ initData }: UserListClientProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { users, set, addLast } = useUsers();
  useEffect(() => {
    set(initData?.data);
  }, []);

  const endRef = useRef<HTMLDivElement>(null);
  useOnScreen(
    endRef,
    async () => {
      if (isLoading || users.length >= initData.meta.total) return;
      setIsLoading(true);
      const res = await axios.get<UsersResponse>("api/users", {
        params: {
          cursorId: users[users.length - 1]?.id,
        },
      });
      addLast(res.data.data);
      setIsLoading(false);
    },
    [users, isLoading]
  );

  return (
    <div className="flex-col h-[calc(100%-4rem)] overflow-y-auto px-1">
      {users?.map((user) => (
        <UserBox key={user.id} data={user} />
      ))}
      {isLoading ? (
        <div
          className={`w-full relative flex items-center space-x-3 p-3 px-6 animate-pulse`}
        >
          <div className="rounded-full h-11 w-11 mx-auto bg-gray-200 dark:bg-gray-400" />
          <div className="flex-1 flex flex-col">
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-400 w-40 mb-2.5"></div>
          </div>
        </div>
      ) : (
        <div className="h-14" />
      )}
      <div ref={endRef} />
    </div>
  );
};
