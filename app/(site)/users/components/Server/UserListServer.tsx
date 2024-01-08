import getUsers from "@/app/actions/getUsers";
import UserListClient from "../Client/UserListClient";

export default async () => {
  const data = await getUsers();
  return <UserListClient initData={data} />;
};
