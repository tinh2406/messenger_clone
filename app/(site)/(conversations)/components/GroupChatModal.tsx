"use client";

import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import Input from "@/app/components/inputs/Input";
import Select from "@/app/components/inputs/Select";
import useConversations from "@/app/hooks/useConversations";
import useUsers from "@/app/hooks/useUsers";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { MdOutlineGroupAdd } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
interface GroupChatModalProps {
  users: User[];
}
function generateUniqueId() {
  const uuid = uuidv4(); // Tạo ID với độ dài là 36 kí tự
  return uuid.replace(/-/g, "").slice(0, 24); // Loại bỏ dấu "-" và giữ lại 24 kí tự đầu tiên
}
export default ({ users }: GroupChatModalProps) => {
  const router = useRouter();
  const { set } = useUsers();
  const { add } = useConversations();
  const [isLoading, setIsLoading] = useState(false);
  const [groupChatOpen, setGroupChatOpen] = useState(false);
  useEffect(() => {
    set(users);
  }, []);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = watch("members");

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    const id = generateUniqueId();
    try {
      add({
        name: data.name,
        users: members,
        id:"conversationId",
        createdAt: new Date(),
        isGroup: true,
        lastMessageAt: new Date(),
        lastMessageId: null,
        lastMessage: null,
        userIds: [],
      });
      const res = await axios.post("/api/conversations", {
        id,
        ...data,
        isGroup: true,
      });
      router.push(`/${res.data.id}`);
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
    setIsLoading(false);
  };
  const onClose = useCallback(() => {
    setGroupChatOpen(false);
  }, []);
  return (
    <>
      <div
        className="
                  rounded-full
                  p-2
                  bg-gray-100 
                  text-gray-600 
                  cursor-pointer 
                  hover:opacity-75 
                  transition"
        onClick={() => {
          setGroupChatOpen(true);
        }}
      >
        <MdOutlineGroupAdd size={20} />
      </div>
      <Modal isOpen={groupChatOpen} onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Create a group chat
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Create a chat with more than people
              </p>
              <div className="mt-10 flex flex-col gap-y-8">
                <Input
                  register={register}
                  label="Name"
                  id="name"
                  disabled={isLoading}
                  required
                  errors={errors}
                />
                <Select
                  label="Members"
                  disabled={isLoading}
                  options={users.map((user) => ({
                    value: user.id,
                    label: user.name,
                  }))}
                  onChange={(value) =>
                    setValue("members", value, {
                      shouldValidate: true,
                    })
                  }
                  value={members}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button
              disabled={isLoading}
              type="button"
              onClick={onClose}
              secondary
            >
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit">
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
