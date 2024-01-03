import { HiChat, HiUsers } from "react-icons/hi";

const useRoutes = () => {
    
  const routes = [
    {
      label: "Chat",
      href: "/",
      icon: <HiChat className="h-6 w-6 shrink-0"/>,
    },
    {
      label: "Users",
      href: "/users",
      icon: <HiUsers className="h-6 w-6 shrink-0"/>,
    },
  ];
  return routes;
};

export default useRoutes;
