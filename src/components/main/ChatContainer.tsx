import { useEffect, useRef, useState } from "react";
import chatStore from "../../store/chatStore";
import { ChatMessage, FBUserChat } from "../../utilis/types";
import userStore from "../../store/userStore";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { toast } from "react-toastify";
import { formatTimestamp } from "../../utilis/utils";

//const chatLimit = 10;

const ChatContainer = () => {
  const {
    chatId,
    recipientUser,
    isCurrentUserBlocked,
    isReceiverBlocked,
    updateReceiverBlockStatus,
    updateCurrentUserBlockStatus,
  } = chatStore();
  const { user } = userStore();

  const [chats, setChats] = useState<ChatMessage[] | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  console.log({ isFirstTime });

  useEffect(() => {
    setIsFirstTime(true);
  }, [chatId]);

  useEffect(() => {
    let unsub: () => void;
    if (chatId) {
      setLoading(true);
      unsub = onSnapshot(doc(db, "chats", chatId), (doc) => {
        const data = doc.data();
        console.log("chat value changed");
        setChats(data?.chats as ChatMessage[]);
        if (
          data?.blockedList.includes(
            `${user?.userId} blocked ${recipientUser?.userId}`
          )
        ) {
          updateReceiverBlockStatus(true);
        } else {
          updateReceiverBlockStatus(false);
        }
        if (
          data?.blockedList.includes(
            `${recipientUser?.userId} blocked ${user?.userId}`
          )
        ) {
          updateCurrentUserBlockStatus(true);
        } else {
          updateCurrentUserBlockStatus(false);
        }
        setLoading(false);
        if (isFirstTime) {
          setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 200);
          setIsFirstTime(false);
        }
      });
    }

    return () => {
      if (chatId) unsub();
    };
  }, [chatId, setChats]);

  const submitChatHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const textMessage: string = inputRef.current?.value as string;
    try {
      const chatDocRef = doc(db, "chats", chatId as string);
      await updateDoc(chatDocRef, {
        chats: arrayUnion({
          message: textMessage,
          user: user?.userId,
          createdAt: Date.now(),
        }),
      });
      const userIds = [user?.userId, recipientUser?.userId];
      userIds.forEach(async (id) => {
        const currentUserRef = doc(db, "userchats", id as string);
        const userChatsSnapshot = await getDoc(currentUserRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData: FBUserChat[] = userChatsSnapshot.data().chats;

          const chatIndex = userChatsData.findIndex((c) => c.chatId === chatId);
          userChatsData[chatIndex].lastMessage = textMessage;
          userChatsData[chatIndex].isSeen = id === user?.userId ? true : false;
          await updateDoc(currentUserRef, {
            chats: userChatsData,
          });
        }
      });
      if (inputRef?.current) {
        inputRef.current.value = "";
      }
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      // @ts-ignore
      toast(error?.message, { type: "error" });
    }
  };
  const chatExists = (chats?.length as number) > 0;
  return (
    <section
      className={`basis-1/2 p-3 flex flex-col h-full relative pb-20 ${
        (!chatId || (chatId && !chatExists)) && "justify-center"
      }`}
    >
      {!chatId && (
        <p className="text-center absolute top-1/2 left-1/2 -translate-x-1/2 w-full">
          Welcome to R-Chatsapp. Start chatting with any of your friends!
        </p>
      )}
      {chatId && !chatExists && (
        <p className="text-center absolute top-1/2 left-1/2 -translate-x-1/2 w-full">
          You dont have any chats with {recipientUser?.username}. Start
          typing....
        </p>
      )}
      {chatId && (
        <div className="flex flex-col flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-1 pt-2">
            {chats?.map((chat) => (
              <li
                key={chat.createdAt}
                className={`max-w-1/3 h-auto m-2 mt-5 p-2 px-3 text-left rounded-lg relative ${
                  chat.user === user?.userId
                    ? "ml-auto bg-sky-300"
                    : "mr-auto bg-slate-200"
                }`}
              >
                {chat.message}
                {chat.user !== user?.userId && (
                  <img
                    src={
                      isCurrentUserBlocked || isReceiverBlocked
                        ? "/blocked.png"
                        : recipientUser?.profilePic
                    }
                    alt="avatar"
                    className="absolute w-5 h-5 rounded-full -top-3 -left-2"
                  />
                )}
                <span
                  className={`text-xs absolute -bottom-4 ${
                    chat.user === user?.userId ? "right-0" : "left-0"
                  } text-gray-500`}
                >
                  {formatTimestamp(chat.createdAt)}
                </span>
              </li>
            ))}
            <div ref={chatEndRef}></div>
          </ul>
          <form
            onSubmit={submitChatHandler}
            className="absolute bottom-2 left-0 w-full p-3"
          >
            <div className="flex justify-between">
              <input
                type="text"
                className="bg-sky-100 px-2 py-4 pl-6 outline-none text-sm text-gray-700 w-11/12 rounded-md"
                placeholder={
                  isCurrentUserBlocked || isReceiverBlocked
                    ? "You cannot send a message"
                    : "Type a message..."
                }
                disabled={isCurrentUserBlocked || isReceiverBlocked}
                id="message"
                ref={inputRef}
              />
              <button
                type="submit"
                className="mr-2 px-2 active:scale-125 disabled:cursor-not-allowed"
                disabled={isCurrentUserBlocked || isReceiverBlocked || loading}
              >
                <img src="/send.png" alt="send" className="w-10" />
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default ChatContainer;
