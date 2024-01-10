"use client";

import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";
import useConversations from "@/app/hooks/useConversations";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import Header from "../Skeleton/Header";
import ProfileDrawer from "./ProfileDrawer";
import { useRouter } from "next/navigation";

interface HeaderProps {
  userEmail: string;
  id: string;
}

export default ({ id, userEmail }: HeaderProps) => {
  const { getById } = useConversations();
  const router = useRouter()
  const [conversation, setConversation] = useState(getById(id));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { members } = useActiveList();
  useEffect(() => {
    if (!conversation) {
      axios
        .get(`api/conversations/${id}`)
        .then((res) => {
          setConversation(res.data);
        })
        .catch((err) => {
          router.push("/")
        });
    }
  }, []);
  if (!conversation) return <Header />;
  const otherUser = conversation?.users.filter((u) => u.email !== userEmail)[0];
  const isActive = members.indexOf(otherUser.email!) !== -1;
  const statusText = conversation.isGroup
    ? `${conversation.users.length} members`
    : isActive
    ? "Active"
    : "Offline";
  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
        }}
        userEmail={userEmail}
      />
      <div
        className="
                bg-white
                w-full 
                flex
                border-b-[1px]
                py-3
                px-4
                sm:px-4
                lg:px-6
                justify-between
                items-center
                shadow-sm
                "
      >
        <div className="flex gap-3 items-center">
          <Link
            className="
                lg:hidden 
                block 
                text-sky-500 
                hover:text-sky-600 
                transition 
                cursor-pointer"
            href="/"
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar user={otherUser} />
          )}
          <div className="flex flex-col">
            <div>{conversation.name || otherUser?.name || ""}</div>
            <div
              className="
                    text-sm 
                    font-light 
                    text-neutral-500"
            >
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => {
            setDrawerOpen(true);
          }}
          className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
        />
      </div>
    </>
  );
};
