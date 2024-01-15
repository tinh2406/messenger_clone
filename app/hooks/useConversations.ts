import { create } from "zustand";
import { ConversationType } from "../types";
import axios from "axios";

type Meta = {
  total: number;
};
type ConversationResponse = {
  data: ConversationType[];
  meta: Meta;
};

interface ConversationsStore {
  meta?: Meta;
  conversations: ConversationType[];
  add: (conversation: ConversationType) => void;
  remove: (conversationId: string) => void;
  set: (conversations: ConversationType[]) => void;
  update: (conversation: ConversationType) => void;
  seen: (conversation: ConversationType) => void;
  getMore: () => void;
  getById: (id: string) => ConversationType | undefined;
}

const useConversations = create<ConversationsStore>((set, get) => ({
  conversations: [],
  add(conversation) {
    set((state) => ({ conversations: [conversation, ...state.conversations] }));
  },
  remove(conversationId) {
    set((state) => ({
      conversations: state.conversations.filter(
        (conversation) => conversationId !== conversation.id
      ),
    }));
  },
  set(conversations) {
    set((state) => {
      if (state.conversations.length !== 0) return state;
      console.log("Set conversation");

      return { conversations };
    });
  },
  update(conversation) {
    set((state) => ({
      conversations: [
        conversation,
        ...state.conversations.filter(
          (conver) =>
            conversation.id !== conver.id && conver.id !== "conversationId"
        ),
      ],
    }));
  },
  seen(conversation) {
    set((state) => ({
      conversations: state.conversations.map((conver) => {
        if (conversation.id === conver.id)
          return {
            ...conver,
            lastMessage: conversation.lastMessage,
          };
        return conver;
      }),
    }));
  },
  async getMore() {
    const { conversations, meta } = get();
    if (meta && conversations.length >= meta.total) return;
    const res = await axios.get<ConversationResponse>("api/conversations", {
      params: {
        cursorId: conversations[conversations.length - 1]?.id,
      },
    });
    set({
      conversations: [...conversations, ...res.data.data],
      meta: res.data.meta,
    });
  },
  getById(id) {
    const { conversations } = get();
    return conversations.find((conversation) => conversation.id === id);
  },
}));

export default useConversations;
