import { Timestamp } from "firebase/firestore";

export type User = {
  username: string;
  profilePic: string;
  userId: string;
  email: string;
  blockedList: string[] | [];
};
export type Chat = {
  chatId: null | string;
  recipientUser: null | { username: string; avatar: string; id: string };
  isCurrentUserBlocked: boolean;
  isReceiverBlocked: boolean;
};
export type ChatListItem = {
  recipientId: string;
  recipientProfilePic: string;
  lastMessage: string;
  isSeen: boolean;
  recipientName: string;
  chatId: string;
  isBlocked: boolean;
};
export type ChatMessage = {
  message: string;
  user: string;
  createdAt: number;
};

export type FBUserChat = {
  chatId: string;
  lastMessage: string;
  isSeen: boolean;
  recipientUserId: string;
  recipientProfilePic: string;
  recipientName: string;
};
export type FBUserchats = {
  chats: FBUserChat[] | [];
  blockedList: string[];
};
export type FBChats = {
  chats: FBChat[] | [];
  blockedList: string[];
};
export type FBChat = {
  type: "text" | "image" | "pdf";
  message?: string;
  file?: string;
  user: string;
  createdAt: number;
};
