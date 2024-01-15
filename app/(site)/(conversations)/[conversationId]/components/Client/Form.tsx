"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import { CldUploadButton } from "next-cloudinary";
import MessageInput from "./MessageInput";
import useMessages from "@/app/hooks/useMessages";
import { useAuth } from "@/app/context/AuthContext";

export default () => {
  const { conversationId } = useConversation();
  const { add } = useMessages();
  const { data: currentUserData } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    add({
      body: data.message,
      id: "messageId",
      conversationId,
      createdAt: new Date(),
      image: null,
      lastOfIds: [],
      seen: [],
      seenIds: [],
      sender: {
        id: currentUserData?.user?.id!,
        email: currentUserData?.user?.email!,
        name: currentUserData?.user?.name!,
        image: currentUserData?.user?.image!,
        conversationIds: [],
        createdAt: new Date(),
        emailVerified: null,
        hashedPassword: null,
        seenMessageIds: [],
        updatedAt: new Date(),
      },
      senderId: currentUserData?.user?.id!,
    });
    axios
      .post("/api/messages", {
        ...data,
        conversationId,
      })
      .catch((error: any) => {});
  };
  const handleUpload = (result: any) => {
    add({
      body: null,
      id: "messageId",
      conversationId,
      createdAt: new Date(),
      image: result?.info.secure_url,
      lastOfIds: [],
      seen: [],
      seenIds: [],
      sender: {
        id: currentUserData?.user?.id!,
        email: currentUserData?.user?.email!,
        name: currentUserData?.user?.name!,
        image: currentUserData?.user?.image!,
        conversationIds: [],
        createdAt: new Date(),
        emailVerified: null,
        hashedPassword: null,
        seenMessageIds: [],
        updatedAt: new Date(),
      },
      senderId: currentUserData?.user?.id!,
    });
    axios.post("/api/messages", {
      image: result?.info.secure_url,
      conversationId,
    });
  };
  return (
    <div
      className="
            py-4 
            px-4 
            bg-white 
            border-t 
            flex 
            items-center 
            gap-2 
            lg:gap-4 
            w-full"
    >
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset="viwwlrtz"
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full "
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
        />
        <button
          type="submit"
          className="
                rounded-full
                p-2
                bg-sky-500
                cursor-pointer
                hover:bg-sky-600
                transition"
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};
