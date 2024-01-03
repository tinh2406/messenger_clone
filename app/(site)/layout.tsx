import Image from "next/image";
import AuthForm from "./components/AuthForm";
import getSession from "../actions/getSession";
import Sidebar from "@/app/(site)/components/sidebar/Sidebar";

export default async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  return (
    <div className="flex min-h-full flex-col justify-center bg-gray-100 px-0">
      {!session?.user ? (
        <>
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Image
              alt="Logo"
              height={48}
              width={48}
              className="mx-auto w-auto"
              src="https://github.com/tinh2406/messenger-clone-nextjs13/blob/main/public/images/logo.png?raw=true"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <AuthForm />
        </>
      ) : (
        <Sidebar>{children}</Sidebar>
      )}
    </div>
  );
};
