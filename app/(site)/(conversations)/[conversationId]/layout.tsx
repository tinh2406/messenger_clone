import getConversationById from "@/app/actions/getConversationById";
import getSession from "@/app/actions/getSession";
import EmptyState from "../../components/EmptyState";
import Header from "./components/Header";
import Form from "./components/Form";
import { Suspense } from "react";
import CircleLoading from "@/app/components/CircleLoading";

interface IParams {
  conversationId: string;
}

export default async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: IParams;
}) => {
  const session = await getSession();
  const conversation = await getConversationById(
    params.conversationId,
    session!
  );
  if (!conversation) {
    return (
      <div className="pl-24 md:pl-80 h-full pb-0 md:pb-14 lg:pb-0">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white absolute w-full left-0 h-full pb-0 md:relative md:w-auto md:ml-80 md:pb-14 lg:pb-0">
      <div className="h-full flex flex-col">
        <Header
          conversation={conversation!}
          userEmail={session!.user!.email!}
        />
        <div className="flex-1 overflow-y-auto">
          <Suspense fallback={<CircleLoading />}>{children}</Suspense>
        </div>
        <Form />
      </div>
    </div>
  );
};
