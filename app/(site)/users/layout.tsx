import { Suspense } from "react";
import UserList from "./components/Server/UserListServer";
import Loading from "@/app/components/Loading";

export default ({ children }: { children: React.ReactNode }) => {
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
        <Suspense
          fallback={
            <div>
              <Loading />
            </div>
          }
        >
          <UserList />
        </Suspense>
      </aside>
      {children}
    </div>
  );
};
