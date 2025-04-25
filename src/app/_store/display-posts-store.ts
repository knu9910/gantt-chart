import { create } from "zustand";

interface DisplayPostsStore {
  displayPostsCount: number;
  setDisplayPostsCount: (count: number) => void;
}

export const useDisplayPostsStore = create<DisplayPostsStore>((set) => ({
  displayPostsCount: 0,
  setDisplayPostsCount: (count) => set({ displayPostsCount: count }),
}));
