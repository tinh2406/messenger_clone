import clsx from "clsx";
import ConversationList from "./components/ConversationList";
import { Suspense } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import GroupChatModal from "./components/GroupChatWrapper";
import Image from "next/image";
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
            pb-14
            lg:pb-0
            lg:left-20
            md:w-80
            md:block
            overflow-y-auto
            border-r
            border-gray-200
            w-24
            `
        )}
      >
        <div className="px-1 md:px-5">
          <Image
            alt="Logo"
            height={48}
            width={48}
            className="mx-auto w-auto md:hidden pt-4 mb-[4px]"
            src="https://github.com/tinh2406/messenger-clone-nextjs13/blob/main/public/images/logo.png?raw=true"
          />
          <div className="hidden md:flex justify-between mb-[12px] pt-4">
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
          <Suspense fallback={<Loading />}>
            <ConversationList />
          </Suspense>
        </div>
      </aside>
      {children}
    </div>
  );
};
