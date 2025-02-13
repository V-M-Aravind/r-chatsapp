import React, { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import AddUser from "./AddUser";
import userStore from "../../store/userStore";
import { FBUserChat } from "../../utilis/types";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";

const ChatList = () => {
  const { user } = userStore();
  const [showAddUser, setShowAddUser] = useState(false);
  const [chats, setChats] = useState<FBUserChat[]>([]);

  const [searchUser, setSearchUser] = useState<string>("");
  const [filteredChats, setFilteredChats] = useState<FBUserChat[]>([]);
  useEffect(() => {
    let unsub: () => void;
    if (user) {
      unsub = onSnapshot(doc(db, "userchats", user.userId), (doc) => {
        const data = doc.data()?.chats as FBUserChat[];
        setChats(data);
      });
    }

    return () => {
      user && unsub();
    };
  }, [user]);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (searchUser == "") {
        setFilteredChats(chats);
      }
      const data = chats.filter((chat) =>
        chat.recipientName.includes(searchUser)
      );
      setFilteredChats(data);
    }, 300);
    return () => {
      clearTimeout(timeOut);
    };
  }, [searchUser]);

  return (
    <div className="flex flex-col flex-1 h-5/6">
      <div className="p-3 flex justify-between items-center gap-1">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="search"
            className="bg-sky-100 px-2 pl-8 outline-none text-sm py-2 w-11/12 rounded-md"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <img
            src="/search.png"
            alt="search-icon"
            className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-2 z-10"
          />
        </div>
        <button
          className=" bg-blue-400 p-1"
          onClick={() => setShowAddUser((v) => !v)}
        >
          <img
            src="/plus.png"
            alt="add-icon"
            className="w-6 h-6 active:animate-ping active:bg-slate-300"
          />
        </button>
      </div>
      <ul className="overflow-y-auto mt-2">
        {filteredChats?.map((item) => (
          <ChatItem item={item} key={item.chatId} />
        ))}
      </ul>
      {showAddUser && <AddUser onClose={() => setShowAddUser((v) => !v)} />}
    </div>
  );
};

export default ChatList;
