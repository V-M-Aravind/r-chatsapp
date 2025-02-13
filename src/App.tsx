import { ToastContainer } from "react-toastify";
import LoginPage from "./components/login/LoginPage";
import MainPage from "./components/main/MainPage";
import userStore from "./store/userStore";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import Loader from "./components/common/Loader";

function App() {
  const { user, fetchUserInfo, isLoading } = userStore();
  useEffect(() => {
    const unAuthSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid as string);
    });

    return () => {
      unAuthSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader styles={"h-10 w-10"} />
      </div>
    );
  }
  return (
    <div className="flex flex-col h-screen mx-10 mb-6">
      {user ? <MainPage /> : <LoginPage />}
      <ToastContainer position="bottom-right" />
      <footer className="my-2 py-4 bg-white rounded-md px-4 text-center font-bold text-sm">
        R-Chatsapp 2025. All right reserved to VM Aravind
      </footer>
    </div>
  );
}

export default App;
