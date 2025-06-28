"use client";

import { useData } from "@/context/Context";
import { PageLoading } from "@/utils/Loading";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { PiStudentBold } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";

const Header = () => {
  const { userData } = useData();
  const pathname = usePathname();
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <PageLoading />;

  return (
    <header className=" fixed top-0 left-0 w-full h-[70px] flex items-center bg-[#fff] z-50 ">
      <div className=" px-3 max-w-[1400px] mx-auto w-full flex items-center justify-between gap-2 ">
        <div className=" flex items-center gap-1 font-poppins ">
          <div className=" text-[#0400ff] text-[1.8rem]  ">
            <PiStudentBold />
          </div>
          <span className=" text-[1.5rem] font-medium ">EduBridge</span>
        </div>
        <div className=" flex items-center gap-3 lg:gap-5 ">
          <div className=" hidden md:flex items-center gap-3  ">
            <Link
              href={`/`}
              className={` ${
                pathname === "/" && "text-[#0400ff]"
              } px-2 py-2 hover:text-[#0400ff] transition-colors duration-300 ease-in-out `}
            >
              Home
            </Link>
            <Link
              href={`#`}
              className={` ${
                pathname === "/about-us" && "text-[#0400ff]"
              } px-2 py-2 hover:text-[#0400ff] transition-colors duration-300 ease-in-out `}
            >
              About Us
            </Link>
            <Link
              href={`/courses`}
              className={` ${
                pathname === "/courses" && "text-[#0400ff]"
              } px-2 py-2 hover:text-[#0400ff] transition-colors duration-300 ease-in-out `}
            >
              Courses
            </Link>
            <Link
              href={`#`}
              className={` ${
                pathname === "/contact-us" && "text-[#0400ff]"
              } px-2 py-2 hover:text-[#0400ff] transition-colors duration-300 ease-in-out `}
            >
              Contact Us
            </Link>
          </div>

          {userData._id ? (
            <div className=" flex items-center gap-2 font-medium ">
              <Link
                href={`/dashboard/${userData._id}`}
                className=" line-clamp-1 border-2 border-[#0400ff] md:text-base text-sm px-5 md:px-7 py-2 hover:bg-[#0400ff] hover:text-[#fff] transition-colors duration-300 ease-in-out rounded-full text-[#0400ff] "
              >
                Dashboard
              </Link>
              <div className=" cursor-pointer md:flex hidden line-clamp-1 border-2 border-[#0400ff] bg-[#0400ff] md:text-base text-sm px-5 md:px-7 py-2 hover:bg-transparent hover:text-[#0400ff] transition-colors duration-300 ease-in-out rounded-full text-[#fff] ">
                Sign Out
              </div>
              <div className=" md:hidden flex text-[1.1rem] line-clamp-1 border-2 border-[#0400ff] bg-[#0400ff] md:text-base  px-2 md:px-7 py-2 hover:bg-transparent hover:text-[#0400ff] transition-colors duration-300 ease-in-out rounded-full text-[#fff] ">
                <FiLogOut />
              </div>
            </div>
          ) : (
            <div className=" flex items-center gap-2 font-medium ">
              <Link
                href={`/registation`}
                className=" line-clamp-1 border-2 border-[#0400ff] md:text-base text-sm px-5 md:px-7 py-2 hover:bg-[#0400ff] hover:text-[#fff] transition-colors duration-300 ease-in-out rounded-full text-[#0400ff] "
              >
                Sign Up
              </Link>
              <Link
                href={`/login`}
                className=" line-clamp-1 border-2 border-[#0400ff] bg-[#0400ff] md:text-base text-sm px-5 md:px-7 py-2 hover:bg-transparent hover:text-[#0400ff] transition-colors duration-300 ease-in-out rounded-full text-[#fff] "
              >
                Sign In
              </Link>
            </div>
          )}
          <div
            onClick={() => setIsOpenSidebar(true)}
            className=" md:hidden flex text-[1.5rem] "
          >
            <HiMiniBars3BottomRight />
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-full bg-white z-50 transform transition-transform duration-300 ease-in-out p-[1rem]
    ${isOpenSidebar ? "translate-x-0" : "-translate-x-full"} md:hidden`}
      >
        <div className=" flex items-center justify-between mb-[2rem] ">
          <div className=" flex items-center gap-1 font-poppins ">
            <div className=" text-[#0400ff] text-[1.8rem]  ">
              <PiStudentBold />
            </div>
            <span className=" text-[1.5rem] font-medium ">EduBridge</span>
          </div>
          <div
            onClick={() => setIsOpenSidebar(false)}
            className=" text-[1.6rem] "
          >
            <RxCross2 />
          </div>
        </div>
        <div className="flex flex-col gap-4 text-xl ">
          <Link href="/" className="py-2 border-b">
            Home
          </Link>
          <Link href="#" className="py-2 border-b">
            About Us
          </Link>
          <Link href="/courses" className="py-2 border-b">
            Courses
          </Link>
          <Link href="#" className="py-2 border-b">
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
