import Header from "./components/Skeleton/Header";
import { Suspense } from "react";
import HeaderServer from "./components/Server/HeaderServer";
import BodyServer from "./components/Server/BodyServer";
import Body from "./components/Skeleton/Body";

interface IParams {
  conversationId: string;
}

export default async ({
  params,
}: {
  children: React.ReactNode;
  params: IParams;
}) => {
  return (
    <div className="bg-white absolute w-full left-0 h-full pb-0 md:relative md:w-auto md:ml-[22rem] md:pb-14 lg:pb-0">
      <div className="h-full flex flex-col">
        <Suspense fallback={<Header />}>
          <HeaderServer conversationId={params.conversationId} />
        </Suspense>
        <Suspense fallback={<Body/>}>
          <BodyServer conversationId={params.conversationId} />
        </Suspense>
      </div>
    </div>
  );
};
