import Body from "./components/Body";
import getMessages from "@/app/actions/getMessages";

interface IParams {
  conversationId: string;
}

export default async ({ params }: { params: IParams }) => {
  const messages = await getMessages(params.conversationId);

  return <Body initialMessages={messages} />;
};
