"use client";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";
import Logout from "./Logout";
import useConversation from "@/app/hooks/useConversation";
import clsx from "clsx";

export default () => {
  const routes = useRoutes();
  const { isOpen } = useConversation();

  return (
    <div
      className={clsx(
        `
            fixed
            justify-between
            w-full
            bottom-0
            z-40
            flex
            items-center
            bg-white
            border-t-[1px]
            lg:hidden
        `,
        isOpen && "hidden"
      )}
    >
      {routes.map((route) => (
        <MobileItem key={route.label} href={route.href} icon={route.icon} />
      ))}
      <Logout />
    </div>
  );
};
