import { getServerSession } from "next-auth";
import { MySession } from "../types";
import { authOptions } from "../utils/authOptions";

export default async (): Promise<MySession | null> => {
  return (await getServerSession(authOptions)) as MySession;
};
