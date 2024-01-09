"use client";

import { User } from "@prisma/client";
import { useRef } from "react";
import UserBox from "./UserBox";
import useOnScreen from "@/app/hooks/useOnScreen";
import axios from "axios";
import CircleLoading from "@/app/components/CircleLoading";
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
        <div>
          <CircleLoading />
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
};
