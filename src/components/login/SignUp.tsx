import React, { useState } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Loader from "../common/Loader";
import { auth, db } from "../../lib/firebase";
import { getRandomImageUrl } from "../../utilis/utils";
import { User } from "../../utilis/types";
type Props = {
  reDirectToSigin: () => void;
};

const SignUp = ({ reDirectToSigin }: Props) => {
  // const [profileImg, setProfileImg] = useState<{
  //   name: string;
  //   lastModified: number;
  //   size: number;
  //   type: string;
  //   localUrl: string;
  // } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  //free cloud hosting is not available.so removing profile picture upload
  // const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target?.files?.[0];
  //   if (!file) return;
  //   setProfileImg({ ...file, localUrl: URL.createObjectURL(file) });
  // };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    try {
      const email = (form.elements.namedItem("email") as HTMLInputElement)
        ?.value;
      const username = (form.elements.namedItem("username") as HTMLInputElement)
        ?.value;
      const password = (form.elements.namedItem("password") as HTMLInputElement)
        ?.value;
      const confirmPassword = (
        form.elements.namedItem("retype_password") as HTMLInputElement
      )?.value;
      console.log({ email, password, confirmPassword });
      if (password.localeCompare(confirmPassword) !== 0) {
        toast("Password doesn't match.", { type: "error" });
        return;
      }
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const userId = res.user.uid;
      const profilePic = getRandomImageUrl();
      const user: User = {
        username,
        userId,
        email,
        profilePic,
        blockedList: [],
      };
      await setDoc(doc(db, "users", userId), user);
      await setDoc(doc(db, "userchats", userId), {
        chats: [],
      });
      toast("Registration Successfull. Please login", { type: "success" });
      reDirectToSigin();
    } catch (error) {
      console.log(error);
      toast(error?.message, { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 p-2 text-sm">
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
        <div className="flex items-center">
          <label htmlFor="username" className="w-1/4">
            Username:
          </label>
          <input
            type="text"
            id="username"
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
        <div className="flex">
          <label htmlFor="retype_password" className="w-1/4">
            Confirm:
          </label>
          <input
            type="password"
            id="retype_password"
            className="bg-slate-200 p-1 rounded-sm flex-1"
            required
          />
        </div>
        {/* <div className="flex items-center">
          <label htmlFor="profile-pic" className="flex items-center">
            Profile Picture:
            <img
              src={profileImg?.localUrl || "/img.png"}
              alt="profile-pic"
              className="ml-3 object-cover w-10 h-8"
            />
          </label>
          <input
            type="file"
            id="profile-pic"
            className="opacity-0 w-8"
            accept="image/*"
            onChange={onImageUpload}
            required
          />
        </div> */}
        <button
          className="bg-blue-600 px-4 py-2 h-10 rounded-md font-medium text-white hover:bg-blue-700"
          type="submit"
        >
          {isLoading ? <Loader styles="w-4 h-4" /> : "REGISTER"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
