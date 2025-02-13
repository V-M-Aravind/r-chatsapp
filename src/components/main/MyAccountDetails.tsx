import userStore from "../../store/userStore";
import chatStore from "../../store/chatStore";
import { toast } from "react-toastify";
import { auth } from "../../lib/firebase";

type Props = {
  onClose: () => void;
};

const MyAccountDetails = ({ onClose }: Props) => {
  const { user, setLoggedInUser } = userStore();
  const { resetChatStore } = chatStore();
  const logout = () => {
    setLoggedInUser(null);
    resetChatStore();
    auth.signOut();
    toast("Logged out successfully.", { type: "success" });
  };
  return (
    <>
      <section className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 p-3 px-5 bg-sky-300 w-96 h-max-96 overflow-y-auto z-20 rounded-md opacity-95">
        <div className="flex flex-col text-sm">
          <button className="ml-auto p-3" onClick={onClose}>
            <img
              src="/close.png"
              alt="close-icon"
              className="w-6 hover:scale-105 active:scale-125"
            />
          </button>
        </div>
        <div className="flex flex-col items-center gap-2">
          <img
            src={user?.profilePic}
            alt="profile"
            className="w-24 h-24 object-cover rounded-full"
          />
          <p className="font-bold text">{user?.username}</p>
          {/* edit button to edit username , profile pic and password */}
        </div>
        <button
          className="bg-red-900 px-4 py-2 h-10 rounded-md font-medium text-white mt-4 hover:bg-red-700 active:font-bold w-full"
          onClick={logout}
        >
          Logout
        </button>
      </section>
      <div
        className="absolute top-0 left-0 w-full h-full bg-sky-100 z-10 opacity-35"
        onClick={onClose}
      ></div>
    </>
  );
};

export default MyAccountDetails;
