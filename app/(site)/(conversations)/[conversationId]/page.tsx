import getConversationById from "@/app/actions/getConversationById";
import EmptyState from "../../components/EmptyState";
import getSession from "@/app/actions/getSession";
import Header from "./components/Header";
import Body from "./components/Body";
import getMessages from "@/app/actions/getMessages";
import Form from "./components/Form";

interface IParams {
  conversationId: string;
}

export default async ({ params }: { params: IParams }) => {
  const session = await getSession();
  const conversation = await getConversationById(
    params.conversationId,
    session!
  );
  const messages = await getMessages(params.conversationId);
  if (!conversation) {
    return (
      <div className="md:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="md:pl-80 h-full pb-0 md:pb-14 lg:pb-0">
      <div className="h-full flex flex-col">
        <Header
          conversation={conversation!}
          userEmail={session!.user!.email!}
        />
        <Body initialMessages={messages} />
        <Form />
      </div>
    </div>
  );
};
