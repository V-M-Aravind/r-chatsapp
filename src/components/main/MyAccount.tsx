import { useState } from "react";
import userStore from "../../store/userStore";
import MyAccountDetails from "./MyAccountDetails";
import chatStore from "../../store/chatStore";
import { toast } from "react-toastify";
import { auth } from "../../lib/firebase";

const MyAccount = () => {
  const { user, setLoggedInUser } = userStore();
  const { resetChatStore } = chatStore();
  const [showMyAccountDetails, setShowMyAccountDetails] = useState(false);
  const logout = () => {
    setLoggedInUser(null);
    resetChatStore();
    auth.signOut();
    toast("Logged out successfully.", { type: "success" });
  };
  return (
    <div className="border-b-2 border-slate-300 p-3 flex items-center">
      <img
        src={user?.profilePic}
        alt="user-avatar"
        className="w-24 h-24 rounded-full object-cover"
      />
      <p className="text font-semibold ml-2">{user?.username}</p>
      <div className="ml-auto flex gap-3">
        <button
          className="bg-slate-500"
          onClick={() => {
            setShowMyAccountDetails((v) => !v);
          }}
        >
          <img src="/edit.png" alt="edit" className="w-7 h-7 bg-white" />
        </button>
        <button className="">
          <img src="/more.png" alt="more" className="w-7 h-7 bg-bl" />
        </button>
        <button className="" onClick={logout}>
          <img src="/logout.png" alt="user-avatar" className="w-7 h-7 bg-bl" />
        </button>
      </div>
      {showMyAccountDetails && (
        <MyAccountDetails
          onClose={() => {
            setShowMyAccountDetails((v) => !v);
          }}
        />
      )}
    </div>
  );
};

export default MyAccount;
