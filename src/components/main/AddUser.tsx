import { useState } from "react";
import userStore from "../../store/userStore";
import { User } from "../../utilis/types";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { toast } from "react-toastify";
import LoaderScreen from "../common/LoaderScreen";
type Props = {
  onClose: () => void;
};

const AddUser = ({ onClose }: Props) => {
  const { user } = userStore();
  const [searchUser, setSearchUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const searchUserHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    setSearchUser(null);
    setLoading(true);
    e.preventDefault();
    const searchTerm = (
      (e.target as HTMLFormElement)?.elements.namedItem(
        "searchTerm"
      ) as HTMLInputElement
    ).value;
    try {
      const usersRef = collection(db, "users");

      // Create a query against the collection.
      const q = query(usersRef, where("username", "==", searchTerm));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot?.empty) {
        const res = querySnapshot?.docs[0].data() as User;
        setSearchUser(res);
      } else {
        toast("User doesn't exist", { type: "error" });
      }
    } catch (error) {
      // @ts-ignore
      toast(error?.message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };
  const addUserHandler = async () => {
    setLoading(true);
    const currentUserRef = doc(db, "userchats", user?.userId as string);
    const recipientUserRef = doc(db, "userchats", searchUser?.userId as string);
    const chatRef = await addDoc(collection(db, "chats"), {
      chats: [],
      blockedList: [],
    });
    await updateDoc(currentUserRef, {
      chats: arrayUnion({
        chatId: chatRef.id,
        isSeen: true,
        lastMessage: "",
        recipientName: searchUser?.username,
        recipientProfilePic: searchUser?.profilePic,
        recipientUserId: searchUser?.userId,
      }),
    });
    await updateDoc(recipientUserRef, {
      chats: arrayUnion({
        chatId: chatRef.id,
        isSeen: false,
        lastMessage: "",
        recipientName: user?.username,
        recipientProfilePic: user?.profilePic,
        recipientUserId: user?.userId,
      }),
    });
    onClose();
    setLoading(false);
  };
  return (
    <>
      <section className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 p-3 px-5 bg-sky-500 w-96 h-max-96 overflow-y-auto z-20 rounded-md opacity-95">
        <div className="flex flex-col text-sm min-h-44">
          <button className="ml-auto p-2 mb-2" onClick={onClose}>
            <img
              src="/close.png"
              alt="close-icon"
              className="w-6 hover:scale-105 active:scale-125"
            />
          </button>
          <form
            className="flex justify-between items-center"
            onSubmit={searchUserHandler}
          >
            <input
              type="text"
              className="bg-sky-100 p-2 pl-6 outline-none text-sm rounded-md"
              placeholder="username or email"
              id="searchTerm"
              required
            />
            <button
              className="bg-blue-800 w-24 px-4 py-2 rounded-md font-medium text-white hover:bg-blue-700 active:font-bold"
              type="submit"
            >
              Search
            </button>
          </form>
          {searchUser && (
            <div className=" bg-white mt-2 px-1 rounded-md">
              <div className="flex mt-4 gap-3 items-center border-b-2 pb-2">
                <img
                  src={
                    (searchUser?.blockedList as string[])?.includes(
                      user?.userId as string
                    )
                      ? "/blocked.png"
                      : searchUser?.profilePic
                  }
                  alt="avatar"
                  className="w-7 h-7 rounded-full object-cover"
                />

                <p className="text-xs">{searchUser?.username}</p>
                <button
                  className="bg-blue-800 px-4 text-xs py-2 ml-auto w-24 rounded-md font-medium text-white hover:bg-blue-700 active:font-bold disabled:bg-gray-600 disabled:cursor-not-allowed"
                  onClick={addUserHandler}
                  disabled={searchUser.userId === user?.userId}
                >
                  Add User
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      <div
        className="absolute top-0 left-0 w-full h-full bg-sky-100 z-10 opacity-35"
        onClick={onClose}
      ></div>
      {loading && <LoaderScreen />}
    </>
  );
};

export default AddUser;
