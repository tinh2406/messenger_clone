import getMessages from "@/app/actions/getMessages";
import BodyClient from "../Client/BodyClient";
import Form from "../Client/Form";
import EmptyState from "@/app/(site)/components/EmptyState";

interface BodyServerProps {
  conversationId: string;
}

export default async ({ conversationId }: BodyServerProps) => {
  try {
    const data = await getMessages(conversationId);
    return (
      <>
        <div className="flex-1 overflow-y-auto">
          <BodyClient initData={data} />
        </div>
        <Form />
      </>
    );
  } catch (error) {
    return (
      <div className="h-full block">
        <EmptyState />
      </div>
    );
  }
};
