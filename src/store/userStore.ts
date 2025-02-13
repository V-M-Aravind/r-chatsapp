import { create } from "zustand";
import { User } from "../utilis/types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

type Store = {
  user: User | null;
  isLoading: boolean;
  setLoggedInUser: (value: User | null) => void;
  fetchUserInfo: (value: string) => void;
};
const userStore = create<Store>((set) => ({
  user: null,
  isLoading: true,
  setLoggedInUser: (value: User | null) =>
    set((state) => ({ ...state, user: value })),
  fetchUserInfo: async (value: string) => {
    set((state) => ({ ...state, isLoading: true }));
    if (!value) {
      return set((state) => ({ ...state, isLoading: false }));
    }
    const docRef = doc(db, "users", value);
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as User;
        set((state) => ({ ...state, user: data, isLoading: false }));
      } else {
        throw Error("User doesn't exist");
      }
    } catch (error) {
      throw Error(error.message);
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },
}));

export default userStore;
