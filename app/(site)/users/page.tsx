import clsx from "clsx";
import EmptyState from "../components/EmptyState";
import UserListClient from "./components/UserListClient";
import getUsers from "@/app/actions/getUsers";

export default async () => {
  const data = await getUsers();

  return (
    <div className="h-full">
      <aside
        className="
          bg-white
          fixed
          inset-y-0
          h-[calc(100%-3.5rem)]
          lg:h-full
          lg:ml-20
          lg:block
          lg:w-[22rem]
          border-r
          border-gray-200
          block
          w-full
          flex-col 
          left-0
          justify-start
          items-start
          "
      >
        <div
          className="
              px-4
              text-2xl 
              font-bold
              text-neutral-800 
              py-4
              h-16
              border-b-[1px]
              shadow-sm
              "
        >
          People
        </div>
        <UserListClient initData={data} />;
      </aside>
      <div className={clsx("md:pl-[22rem] h-full hidden md:block")}>
        <EmptyState />
      </div>
    </div>
  );
};
