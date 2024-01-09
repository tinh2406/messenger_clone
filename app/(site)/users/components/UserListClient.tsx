"use client";

import { User } from "@prisma/client";
import { useRef } from "react";
import UserBox from "./UserBox";
import useOnScreen from "@/app/hooks/useOnScreen";
import axios from "axios";
import { useInfiniteQuery } from "react-query";

type UsersResponse = {
  data: User[];
  meta: {
    total: number;
    current: number;
  };
};

interface UserListClientProps {
  initData?: UsersResponse;
}

export default ({ initData }: UserListClientProps) => {
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["users"],
    async ({ pageParam }) => {
      const res = await axios.get<UsersResponse>("/api/users", {
        params: {
          skip: pageParam || 0,
        },
      });
      return res.data;
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage && lastPage?.meta.current >= lastPage?.meta.total) return;
        return lastPage?.meta.current;
      },
      initialData: {
        pages: [initData],
        pageParams: [0],
      },
    }
  );

  const endRef = useRef<HTMLDivElement>(null);
  useOnScreen(
    endRef,
    () => {
      fetchNextPage();
    },
    []
  );

  return (
    <div className="flex-col h-[calc(100%-4rem)] overflow-y-auto px-1">
      {data?.pages.map((users) =>
        users?.data.map((user) => <UserBox key={user.id} data={user} />)
      )}
      {isFetchingNextPage && (
        <div
          className={`w-full relative flex items-center space-x-3 p-3 px-6 animate-pulse`}
        >
          <div className="rounded-full h-11 w-11 mx-auto bg-gray-200 dark:bg-gray-400" />
          <div className="flex-1 flex flex-col">
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-400 w-40 mb-2.5"></div>
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
};
