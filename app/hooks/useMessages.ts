import { create } from "zustand";
import { FullMessageType } from "../types";
import axios from "axios";

type Meta = {
  total: number;
};
type MessageResponse = {
  data: FullMessageType[];
  meta: Meta;
};

interface MessagesStore {
  meta?: Meta;
  messages: FullMessageType[];
  add: (message: FullMessageType) => void;
  addNew: (message: FullMessageType) => void;
  set: (messages: FullMessageType[]) => void;
  update: (message: FullMessageType) => void;
  getMore: (conversationId: string) => void;
}

const useMessages = create<MessagesStore>((set, get) => ({
  messages: [],
  add(message) {
    set((state) => ({ messages: [...state.messages, message] }));
  },
  set(messages) {
    set({ messages });
  },
  addNew(message) {
    set((state) => ({
      messages: [
        ...state.messages.filter(
          (_message) =>
            _message.id !== message.id && _message.id !== "messageId"
        ),
        message,
      ],
    }));
  },
  update(message) {
    set((state) => ({
      messages: state.messages.map((_message) => {
        if (_message.id === message.id) return message;
        return _message;
      }),
    }));
  },
  async getMore(conversationId: string) {
    const { messages, meta } = get();
    if (meta && messages.length >= meta.total) return;
    const res = await axios.get<MessageResponse>(
      `api/conversations/${conversationId}/messages`,
      {
        params: {
          cursorId: messages[0]?.id,
        },
      }
    );
    set({
      messages: [...res.data.data, ...messages],
      meta: res.data.meta,
    });
  },
}));

export default useMessages;
