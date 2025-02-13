import React, { useState } from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const reDirectToSigin = () => {
    setIsSignUp(false);
  };
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="bg-white w-96 h-auto p-3 rounded-md">
        <h1 className="font-bold text-center py-2">R Chatsapp</h1>
        {isSignUp ? <SignUp reDirectToSigin={reDirectToSigin} /> : <SignIn />}
        <p className="text-xs mt-4">
          {isSignUp
            ? "Already have account! Click here to "
            : "Don't have account! Click here to "}
          <button
            onClick={() => {
              setIsSignUp((v) => !v);
            }}
            className="cursor-pointer underline underline-offset-2 font-semibold text-blue-600 hover:text-blue-900 "
          >
            {isSignUp ? "Sign In" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
