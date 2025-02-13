import { useState } from "react";
import userStore from "../../store/userStore";
import { toast } from "react-toastify";
import Overlay from "../common/Overlay";
import Loader from "../common/Loader";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";

const SignIn = () => {
  const { fetchUserInfo } = userStore();
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const form = e.target as HTMLFormElement;
      const email = (form.elements.namedItem("email") as HTMLInputElement)
        ?.value;
      const password = (form.elements.namedItem("password") as HTMLInputElement)
        ?.value;

      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;
      console.log({ user });
      fetchUserInfo(user.uid);

      toast("Logged in successfully.", { type: "success" });
    } catch (error) {
      console.log(error);
      // @ts-ignore
      toast(error?.message, { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="h-40 items-center">
      <form
        onSubmit={onSubmit}
        className="flex flex-1 flex-col gap-3 p-2 text-sm"
      >
        <div className="flex items-center">
          <label htmlFor="email" className="w-1/4">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="bg-slate-200 p-1 rounded-sm flex-1"
            required
          />
        </div>

        <div className="flex">
          <label htmlFor="password" className="w-1/4">
            Password:{" "}
          </label>
          <input
            type="password"
            id="password"
            className="bg-slate-200 p-1 rounded-sm flex-1"
            required
          />
        </div>

        <button
          className="bg-blue-600 px-4 py-2 h-10 rounded-md font-medium text-white mt-4 hover:bg-blue-700"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <Loader styles="w-4 h-4" /> : "SIGN IN"}
        </button>
      </form>
      {isLoading && <Overlay />}
    </div>
  );
};

export default SignIn;
