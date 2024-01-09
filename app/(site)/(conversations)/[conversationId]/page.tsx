import BodyServer from "./components/Server/BodyServer";
import getConversationById from "@/app/actions/getConversationById";
import HeaderClient from "./components/Client/HeaderClient";
import EmptyState from "../../components/EmptyState";
import getSession from "@/app/actions/getSession";

interface IParams {
  conversationId: string;
}

export default async ({ params }: { params: IParams }) => {
  const session = await getSession();
  const conversation = await getConversationById(
    params.conversationId,
    session!
  );
  
  if (!conversation)
    return (
      <div className="md:pl-[22rem] h-full hidden md:block">
        <EmptyState />
      </div>
    );
  return (
    <div className="bg-white absolute w-full left-0 h-full pb-0 md:relative md:w-auto md:ml-[22rem] md:pb-14 lg:pb-0">
      <div className="h-full flex flex-col">
        <HeaderClient
          conversation={conversation!}
          userEmail={session!.user!.email!}
        />
        <BodyServer conversationId={params.conversationId} />
      </div>
    </div>
  );
};
