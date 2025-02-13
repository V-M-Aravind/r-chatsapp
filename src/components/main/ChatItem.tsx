import { FBUserChat } from "../../utilis/types";
import chatStore from "../../store/chatStore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import userStore from "../../store/userStore";
import { db } from "../../lib/firebase";
type Props = {
  item: FBUserChat;
};

const ChatItem = ({ item }: Props) => {
  const { getChat, chatId } = chatStore();
  const { user } = userStore();
  const handleSelect = async () => {
    if (chatId !== item.chatId) {
      getChat(item);
      try {
        const currentUserRef = doc(db, "userchats", user?.userId as string);
        const userChatsSnapshot = await getDoc(currentUserRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData: FBUserChat[] = userChatsSnapshot.data().chats;

          const chatIndex = userChatsData.findIndex(
            (c) => c.chatId === item.chatId
          );
          userChatsData[chatIndex].isSeen = true;
          await updateDoc(currentUserRef, {
            chats: userChatsData,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <li
      className={`mb-1 p-2 border-b-2 flex items-center gap-3 ${
        item.isSeen ? "bg-gray-200" : "bg-blue-400"
      } hover:bg-sky-300`}
      onClick={handleSelect}
    >
      <img
        src={item.recipientProfilePic}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <p className="text-sm">{item.recipientName}</p>
        <p className="text-xs">{item.lastMessage}</p>
      </div>
    </li>
  );
};

export default ChatItem;
