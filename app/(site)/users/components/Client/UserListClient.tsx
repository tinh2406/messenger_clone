"use client";

import { User } from "@prisma/client";
import { useRef, useState } from "react";
import UserBox from "./UserBox";
import useOnScreen from "@/app/hooks/useOnScreen";
import axios from "axios";
import CircleLoading from "@/app/components/CircleLoading";

type UsersResponse = {
  data: User[];
  meta: {
    total: number;
  };
};

interface UserListClientProps {
  initData?: UsersResponse;
}

export default ({ initData }: UserListClientProps) => {
  const [users, setUsers] = useState(initData?.data || []);
  const [total, setTotal] = useState(initData?.meta.total || 0);
  const [isLoading, setIsLoading] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);
  useOnScreen(
    endRef,
    async () => {
      if (users.length < total && !isLoading) {
        setIsLoading(true);
        try {
          const res = await axios.get<UsersResponse>("api/users", {
            params: {
              skip: users.length,
            },
          });
          setUsers((users) => {
            return [...users, ...res.data.data];
          });
          setTotal(res.data.meta.total);
        } catch (error) {}
        setIsLoading(false);
      }
    },
    [users.length, total, isLoading]
  );

  return (
    <div className="flex-col h-[calc(100%-4rem)] overflow-y-auto px-1">
      {users.map((user) => (
        <UserBox key={user.id} data={user} />
      ))}
      {isLoading && (
        <div>
          <CircleLoading />
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
};
