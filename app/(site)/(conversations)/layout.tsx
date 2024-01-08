import clsx from "clsx";
import ConversationList from "./components/Server/ConversationListServer";
import { Suspense } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import GroupChatModal from "./components/Server/GroupChatServer";
import Loading from "@/app/components/Loading";

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <aside
        className={clsx(
          `
          bg-white            
            fixed
            inset-y-0
            h-[calc(100%-3.5rem)]
            lg:h-full
            lg:left-20
            w-full
            md:w-[22rem]
            block
            overflow-y-auto
            border-r
            border-gray-200
            `
        )}
      >
          <div className="px-5 flex justify-between pt-4 pb-[12px] h-16 border-b-[1px] shadow-sm">
            <div className="text-2xl font-bold text-neutral-800">Message</div>
            <Suspense
              fallback={
                <div
                  className="
                  rounded-full
                  p-2
                  bg-gray-100 
                  text-gray-600 
                  cursor-pointer 
                  hover:opacity-75 
                  transition"
                >
                  <MdOutlineGroupAdd size={20} />
                </div>
              }
            >
              <GroupChatModal />
            </Suspense>
          </div>
          <Suspense fallback={<div><Loading /></div>}>
            <ConversationList />
          </Suspense>
      </aside>
      {children}
    </div>
  );
};
