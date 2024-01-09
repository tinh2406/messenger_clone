import { create } from "zustand";

interface LoadingStore {
  isLoading: boolean;
  setIsLoading: (status: boolean) => void;
}

const useLoading = create<LoadingStore>((set) => ({
  isLoading: false,
  setIsLoading(status) {
    set({ isLoading: status });
  },
}));

export default useLoading;
