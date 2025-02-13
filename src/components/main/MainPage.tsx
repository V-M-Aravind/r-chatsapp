import MyAccount from "./MyAccount";
import ChatList from "./ChatList";
import ChatContainer from "./ChatContainer";
import ChatAccount from "./ChatAccount";

const MainPage = () => {
  return (
    <>
      <header>
        <h1 className="font-bold text-center py-6">R Chatsapp</h1>
      </header>
      <main className="flex flex-1 bg-white rounded-md h-4/5 relative">
        <section className="flex flex-1 flex-col basis-1/4 border-r-2 border-l-2 border-slate-300">
          <MyAccount />
          <ChatList />
        </section>
        <ChatContainer />
        <ChatAccount />
      </main>
    </>
  );
};

export default MainPage;
