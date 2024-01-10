import { create } from "zustand";
import { User } from "@prisma/client";

interface UsersStore {
  users: User[];
  add: (user: User) => void;
  remove: (user: User) => void;
  set: (users: User[]) => void;
  update: (user: User) => void;
  addLast: (users: User[]) => void;
}

const useUsers = create<UsersStore>((set) => ({
  users: [],
  add(user) {
    set((state) => ({ users: [user, ...state.users] }));
  },
  remove(user) {
    set((state) => ({
      users: state.users.filter((usr) => user.id !== usr.id),
    }));
  },
  set(users) {
    set((state) => {
      if (state.users.length !== 0) return state;
      console.log("Set users");

      return { users };
    });
  },
  update(user) {
    set((state) => ({
      users: [user, ...state.users.filter((usr) => user.id !== usr.id)],
    }));
  },
  addLast(users) {
    set((state) => ({
      users: [...state.users, ...users],
    }));
  },
}));

export default useUsers;
