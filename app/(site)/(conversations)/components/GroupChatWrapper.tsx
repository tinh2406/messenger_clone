import getUsers from "@/app/actions/getUsers";
import GroupChatModal from "./GroupChatModal";

export default async () => {
  const users = await getUsers();
  return <GroupChatModal users={users!} />;
};
