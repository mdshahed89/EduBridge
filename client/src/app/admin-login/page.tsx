"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/Context";
import { GiCheckMark } from "react-icons/gi";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    type: "",
    message: "",
  });
  const router = useRouter();
  const { setUserData } = useData();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    const minLength = /^.{8,}$/;
    const hasNumber = /\d/;
    const hasUppercase = /[A-Z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!minLength.test(password))
      return "Password must be at least 8 characters long.";
    if (!hasUppercase.test(password))
      return "Password must include at least one uppercase letter.";
    if (!hasNumber.test(password))
      return "Password must include at least one number.";
    if (!hasSpecialChar.test(password))
      return "Password must include at least one special character.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setToastMessage({
        type: "ERROR",
        message: "Please enter a valid email address.",
      });
      return;
    }

    const validationError = validatePassword(password);
    if (validationError) {
      setToastMessage({
        type: "ERROR",
        message: validationError,
      });
      return;
    }

    setToastMessage({
      type: "",
      message: "",
    });

    try {
      setToastMessage({
        type: "",
        message: "",
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setToastMessage({
          type: "ERROR",
          message: data.error || "Something went wrong",
        });
        return;
      }

      console.log(data);

      setIsSuccess(true);
      setTimeout(() => {
        setUserData({
          ...data?.user,
          token: data?.token,
        });
        router.push(`/admin-panel/${data?.user?._id}`);
      }, 2000);
    } catch (err: unknown) {
      let message = "Something went wrong";

      if (err instanceof Error) {
        message = err.message;
      }

      setToastMessage({
        type: "ERROR",
        message,
      });
    } finally {
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#000] px-4 font-Georama">
      <div className="w-full max-w-md p-8 border-2 border-[#252525] rounded-2xl shadow-lg ">
        <h2 className="text-white text-2xl font-semibold text-center mb-[4rem] ">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300">Email*</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 bg-[#fff]/10 text-white rounded-lg focus:ring-2 focus:ring-[#0400ff] transition-all duration-300 ease-out outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300">Password*</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 bg-[#fff]/10 text-white rounded-lg focus:ring-2 focus:ring-[#0400ff] transition-all duration-300 ease-out outline-none"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="pt-5">
            <button className="w-full relative shadow-inner h-[3rem] bg-[#0400ff] text-[#fff] hover:bg-[#001aff] transition-colors duration-300 ease-in-out rounded-lg font-medium ">
              {isSuccess ? (
                <div>
                  <div className=" flex items-center justify-center gap-2 text-green-500 ">
                    <GiCheckMark />
                    <span>Success</span>
                  </div>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </div>
          {toastMessage.type && toastMessage.message && (
            <p
              className={` text-sm ${
                toastMessage.type === "ERROR"
                  ? "text-red-500"
                  : "text-green-500"
              } `}
            >
              {toastMessage.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
