import React, { useState } from "react";
import chatStore from "../../store/chatStore";
import userStore from "../../store/userStore";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../lib/firebase";
import { toast } from "react-toastify";
import LoaderScreen from "../common/LoaderScreen";

const ChatAccount = () => {
  const { chatId, recipientUser, isCurrentUserBlocked, isReceiverBlocked } =
    chatStore();
  const { user } = userStore();
  const [loading, setLoading] = useState(false);
  const blockUserHandler = async () => {
    setLoading(true);
    try {
      const currentUserRef = doc(db, "users", user?.userId as string);
      await updateDoc(currentUserRef, {
        blockedList: isReceiverBlocked
          ? arrayRemove(recipientUser?.userId)
          : arrayUnion(recipientUser?.userId),
      });
      const chatsRef = doc(db, "chats", chatId as string);
      await updateDoc(chatsRef, {
        blockedList: isReceiverBlocked
          ? arrayRemove(`${user?.userId} blocked ${recipientUser?.userId}`)
          : arrayUnion(`${user?.userId} blocked ${recipientUser?.userId}`),
      });
      toast(`User is ${isReceiverBlocked ? "un blocked" : "blocked"}`, {
        type: "success",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="basis-1/4 border-l-2 border-slate-300 flex flex-col p-3">
      {chatId && (
        <>
          <div className="flex flex-col justify-center items-center border-b-2 pb-3">
            <img
              src={
                isCurrentUserBlocked || isReceiverBlocked
                  ? "profile/blocked.png"
                  : recipientUser?.profilePic
              }
              alt="profile-pic"
              className="w-24 h-24 rounded-full object-cover"
            />
            <p className="font-bold text-xl">
              {isCurrentUserBlocked || isReceiverBlocked
                ? "Account Blocked"
                : recipientUser?.username.toUpperCase()}
            </p>
          </div>
          <div className="text-sm font-semibold p-3">
            <p>Chat Settings</p>
            <p>Privacy & Help</p>
            <p>Shared Photos</p>
          </div>
          <div className="flex justify-center mt-auto mb-5">
            <button
              className="bg-red-900 px-4 py-2 h-10 rounded-md font-medium text-white mt-4 hover:bg-red-700 active:font-bold w-full"
              onClick={blockUserHandler}
            >
              {isReceiverBlocked ? "Unblock User" : "Block User"}
            </button>
          </div>
        </>
      )}
      {loading && <LoaderScreen />}
    </section>
  );
};

export default ChatAccount;
