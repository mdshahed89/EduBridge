"use client";

import { useData } from "@/context/Context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { RiHome9Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { ButtonLoading } from "@/utils/Loading";
import toast from "react-hot-toast";

const Page = () => {
  // const { userData } = useData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
      // setIsLoading(true);
      setIsLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/auth/login`,
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

      if (data?.user?._id) {
        setIsLoading(false);
        toast.success("User Login Successfully!!");
        setUserData({
          ...data?.user,
          token: data?.token,
        });
        router.push(`/dashboard/${data?.user?._id}`);
      } else {
        setToastMessage({
          type: "ERROR",
          message: "Something went wrong!!",
        });
        setIsLoading(false);
      }
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
      setIsLoading(false);
    }
  };

  // if (userData._id) {
  //   return (
  //     <div className="bg-[#000]/90 h-[100vh] flex flex-col">
  //       <div className="max-w-[1400px] mx-auto px-3 w-full">
  //         <div className="h-[5rem] flex items-center justify-between">
  //           <Link href={`/`} className="text-[2rem] text-white">
  //             EduBridge
  //           </Link>
  //           <Link
  //             href={`/`}
  //             className="flex items-center gap-2 border-2 border-[#0400ff] text-white transition-colors duration-300 ease-in-out rounded-lg px-8 py-2 text-[1.1rem]"
  //           >
  //             <RiHome9Line className="text-[1.3rem]" />
  //             <span>Home</span>
  //           </Link>
  //         </div>
  //       </div>

  //       <div className="flex-1 flex flex-col items-center justify-center text-white text-[1.2rem] font-medium text-center">
  //         <h3 className="mb-3">You are already logged in</h3>
  //         <Link
  //           href={`/dashboard/${userData._id}`}
  //           className="underline text-blue-400 hover:text-blue-500 transition"
  //         >
  //           Go to Dashboard
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className=" bg-[#000000] min-h-screen h-full text-[#fff] login-bg ">
      <div className=" max-w-[1400px] mx-auto h-full px-3 ">
        <div className=" h-[5rem] flex items-center justify-between  ">
          <Link href={`/`} className=" text-[2rem] ">
            <div>EduBridge</div>
          </Link>
          <Link
            href={`/`}
            className="flex items-center gap-2 border-2 border-[#0400ff] text-[#fff] transition-colors duration-300 ease-in-out rounded-lg px-8 py-2 text-[1.1rem]  "
          >
            <RiHome9Line className=" text-[1.3rem] " />
            <span>Home</span>
          </Link>
        </div>

        <div className=" h-[calc(100vh-5rem)] flex items-center ">
          <form
            onSubmit={handleSubmit}
            className=" max-w-[40rem] border-2 border-[#252525] mx-auto p-[2rem] rounded-lg "
          >
            <div className=" text-center space-y-2 ">
              <h3 className=" text-[2rem] ">Sign In</h3>
              <p className=" text-[#cfcfcf] max-w-[22rem] ">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Inventore, rem.
              </p>
            </div>

            <div className=" mt-[3rem] space-y-4 ">
              <div className=" text-[1.1rem] space-y-2 ">
                <label htmlFor="">Email*</label>
                <input
                  type="text"
                  placeholder="Enter your email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 p-3 bg-[#fff]/10 text-white rounded-lg focus:ring-2 focus:ring-[#0400ff] transition-all duration-300 ease-out outline-none"
                />
              </div>
              <div className=" text-[1.1rem] space-y-2 ">
                <label htmlFor="">Password*</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 p-3 bg-[#fff]/10 text-white rounded-lg focus:ring-2 focus:ring-[#0400ff] transition-all duration-300 ease-out outline-none"
                />
              </div>

              <div className=" flex justify-end ">
                <div
                  onClick={() => setShowModal(true)}
                  className=" border-b text-[#0400ff] hover:text-[#0400ff] transition-colors duration-300 ease-in-out border-[#0400ff] cursor-pointer "
                >
                  Forgot Password?
                </div>
              </div>

              {showModal && (
                <ForgotPasswordModal
                  isOpen={showModal}
                  onClose={() => setShowModal(false)}
                />
              )}

              <div className="  ">
                {toastMessage && toastMessage.type && toastMessage.message && (
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
              </div>

              <div className=" pt-[1rem]  text-[1.1rem] ">
                <button className=" relative h-[2.7rem] w-full bg-[#0400ff] text-[#fff] hover:bg-[#2f00ff] rounded-md font-medium transition-all duration-300 ease-in-out ">
                  {isLoading ? <ButtonLoading /> : "Sign In"}
                </button>
              </div>

              <div className=" pt-[1rem] ">
                New to Scandify?{" "}
                <Link
                  href={`/registation`}
                  className=" text-[#0400ff] border-b border-[#0400ff] font-medium "
                >
                  Sign Up Now
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [toastMessage, setToastMessage] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleForgotPassword = async () => {
    if (!email) {
      setToastMessage({
        type: "ERROR",
        message: "Please enter your email",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setToastMessage({
          type: "SUCCESS",
          message: "Reset link sent to your email",
        });
        setTimeout(() => {
          onClose();
        }, 5000);
      } else {
        setToastMessage({
          type: "ERROR",
          message: data.message || "Something went wrong",
        });
      }
    } catch (err) {
      console.log("Failed to reset email", err);
      setToastMessage({
        type: "ERROR",
        message: "Failed to send reset email",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center transition-all duration-300 ease-in-out ">
      <div
        ref={modalRef}
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg text-[#000] "
      >
        <div className=" flex justify-end ">
          <div onClick={onClose} className=" text-[1.3rem] cursor-pointer ">
            <RxCross2 />
          </div>
        </div>
        <h2 className="text-lg font-semibold mb-4">Forgot Password</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full border text-[#000] outline-none px-3 py-2 rounded-md mb-4"
        />
        {toastMessage.type && toastMessage.message && (
          <p
            className={` text-sm ${
              toastMessage.type === "ERROR" ? "text-red-500" : "text-green-500"
            } `}
          >
            {toastMessage.message}
          </p>
        )}
        <div className="flex justify-end gap-2 mt-[1rem] ">
          <button
            className="px-7 py-2 bg-[#0400ff]/80 rounded text-[#fff] hover:bg-[#0400ff] "
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className=" w-[8rem] py-2 bg-[#0400ff] text-[#fff] rounded relative "
            onClick={handleForgotPassword}
            disabled={loading}
          >
            {loading ? <ButtonLoading /> : "Send Link"}
          </button>
        </div>
      </div>
    </div>
  );
};
