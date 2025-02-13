import { create } from "zustand";
import userStore from "./userStore";
import { FBUserChat, User } from "../utilis/types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

type Props = {
  chatId: string | null;
  recipientUser: User | null;
  isCurrentUserBlocked: boolean;
  isReceiverBlocked: boolean;
  getChat: (chatItem: FBUserChat) => void;
  updateReceiverBlockStatus: (value: boolean) => void;
  updateCurrentUserBlockStatus: (value: boolean) => void;
  resetChatStore: () => void;
};
const chatStore = create<Props>((set) => ({
  chatId: null,
  recipientUser: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  updateReceiverBlockStatus: (value) => {
    set((state) => ({
      ...state,
      isReceiverBlocked: value,
    }));
  },
  updateCurrentUserBlockStatus: (value) => {
    set((state) => ({
      ...state,
      isCurrentUserBlocked: value,
    }));
  },
  getChat: async (chatItem: FBUserChat) => {
    const currentUser = userStore.getState().user as User;
    //make the userchat to have seen the message updation here
    //get the recipient user details
    const recipientUserRef = doc(db, "users", chatItem.recipientUserId);
    const recipientUserSnap = await getDoc(recipientUserRef);
    let recipientUser: User | null;
    if (recipientUserSnap.exists()) {
      recipientUser = recipientUserSnap.data() as User;
    } else {
      recipientUser = null;
    }

    const chatId = chatItem.chatId;
    let isCurrentUserBlocked = false;
    let isReceiverBlocked = false;
    if ((recipientUser?.blockedList as string[]).includes(currentUser.userId)) {
      recipientUser = null;
      isCurrentUserBlocked = true;
    }
    if (
      recipientUser &&
      (currentUser?.blockedList as string[])?.includes(recipientUser?.userId)
    ) {
      isReceiverBlocked = true;
    }

    set({
      chatId,
      recipientUser,
      isCurrentUserBlocked,
      isReceiverBlocked,
    });
  },
  resetChatStore: () => {
    set(() => ({
      chatId: null,
      recipientUser: null,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
    }));
  },
}));

export default chatStore;
