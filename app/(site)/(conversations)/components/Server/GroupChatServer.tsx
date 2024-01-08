import getUsers from "@/app/actions/getUsers";
import GroupChatModal from "../Client/GroupChatModal";

export default async () => {
  const data = await getUsers();
  return <GroupChatModal users={data.data} />;
};
