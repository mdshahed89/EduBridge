"use client";

import { useData } from "@/context/Context";
import { PageLoading } from "@/utils/Loading";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MdJoinLeft, MdRoundaboutRight } from "react-icons/md";
import { RiAccountBox2Line } from "react-icons/ri";
import Logo from "@/assets/Logo.png";
import Image from "next/image";
import { LuUserRound } from "react-icons/lu";
import { FaXmark } from "react-icons/fa6";

interface Filters {
  page: number;
  limit: number;
  nationality: string;
  identity: string[];
  minAge?: string;
  maxAge?: string;
  search: string;
  sortBy: string;
  eyeColors: string[];
  hairColors: string[];
  heights: string[];
}

interface HeaderProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const Header: React.FC<HeaderProps> = ({ filters, setFilters }) => {
  const [isClientReady, setIsClientReady] = useState(false);

  const { userData } = useData();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileSearchRef = useRef<HTMLDivElement | null>(null);

  const toggleMobileSearch = () => setMobileSearchOpen((prev) => !prev);

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setMobileSearchOpen(false);
      }
    };

    if (mobileSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileSearchOpen]);

  const [searchTerm, setSearchTerm] = useState(filters.search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchTerm,
        page: 1, // reset page when searching
      }));
    }, 500); // debounce delay 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, setFilters]);

  if (!isClientReady) {
    return <PageLoading />;
  }

  // console.log(filters);

  return (
    <header className=" bg-gradient-to-r from-[#1B0206] to-[#2C040B] border-b text-[#F4F1ED] border-[#353535] fixed w-full left-0 top-0  z-50  ">
      <div className=" relative flex items-center w-full max-w-[1400px] mx-auto px-3 ">
        <div className=" border-r border-[#353535] pr-[1rem] md:pr-[2rem] mr-[1rem] lg:mr-[2rem] h-full py-6 ">
          <Link href={`/`} className=" text-[2rem] flex items-center ">
            <Image
              src={Logo}
              alt="Logo"
              className=" w-[13rem] md:w-[13rem] object-contain "
            />
          </Link>
        </div>
        <div className="  w-full flex items-center justify-end md:justify-between ">
          <div
            ref={mobileSearchRef}
            className={`absolute top-full left-0 flex items-center w-full bg-[#000] border border-[#800020] rounded-md mt-2 p-2 transition-transform origin-top ${
              mobileSearchOpen ? "scale-y-100" : "scale-y-0 pointer-events-none"
            }`}
            style={{ transformOrigin: "top" }}
          >
            <FiSearch className=" text-gray-400 text-[1.4rem] " />
            <input
              type="text"
              placeholder="Search by username or name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none bg-transparent text-[1.2rem] text-[#F4F1ED] placeholder:text-gray-400 px-3 py-2"
              autoFocus={mobileSearchOpen}
            />
          </div>

          <div className=" md:flex hidden relative ">
            <div className=" absolute h-full flex items-center text-[1.5rem] ">
              <FiSearch className=" text-gray-400 " />
            </div>
            <input
              type="text"
              placeholder="Search by username or name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" outline-none bg-transparent text-[1.2rem] pr-3 pl-[2rem] "
            />
          </div>
          <div className=" flex items-center gap-2 ">
            <div
              onClick={toggleMobileSearch}
              className=" flex lg:hidden items-center gap-2  border-2 border-[#D6BFA7] text-[#D6BFA7]  transition-colors duration-300 ease-in-out rounded-full px-2 py-2 text-[1.1rem]  "
            >
              {mobileSearchOpen ? (
                <FaXmark className="text-[1.3rem]" />
              ) : (
                <FiSearch className="text-[1.3rem]" />
              )}
            </div>
            <Link
              href={`/faq`}
              className=" flex lg:hidden items-center gap-2 border-2 border-[#D6BFA7] text-[#D6BFA7] transition-colors duration-300 ease-in-out rounded-full px-2 py-2 text-[1.1rem]  "
            >
              <MdRoundaboutRight className=" text-[1.3rem] " />
            </Link>
            {userData && userData?._id && userData?.email ? (
              <Link
                href={`/profile/${userData?._id}`}
                className="flex items-center gap-2 text-[#D6BFA7] md:border-2 border-[#D6BFA7]  transition-colors duration-300 ease-in-out rounded-lg px-3 md:px-8 py-2 text-[1.1rem]  "
              >
                <LuUserRound className=" text-[1.2rem] " />
                <span>Profile</span>
              </Link>
            ) : (
              <>
                <Link
                  href={`/loggin`}
                  className=" hidden lg:flex items-center gap-2 bg-transparent text-[#D6BFA7] md:border-2 border-[#D6BFA7]  transition-colors duration-300 ease-in-out rounded-lg px-3 md:px-8 py-2 text-[1.1rem]  "
                >
                  <RiAccountBox2Line className=" text-[1.3rem] " />
                  <span>Logg Inn</span>
                </Link>
                <Link
                  href={`/registrering`}
                  className=" flex lg:hidden items-center gap-2  border-2 border-[#D6BFA7] text-[#D6BFA7] transition-colors duration-300 ease-in-out rounded-lg px-5 md:px-8 py-2 text-[1.1rem]  "
                >
                  <MdJoinLeft className=" text-[1.3rem] " />
                  <span>Join</span>
                </Link>
              </>
            )}
            {/* shadow-[0px_1px_30px_#D6BFA7] */}
            {(!userData || !userData?._id || !userData?.email) && (
              <Link
                href={`/registrering`}
                className=" hidden lg:flex items-center gap-2 text-[#D6BFA7] border-2 border-[#D6BFA7] transition-colors duration-300 ease-in-out rounded-lg px-8 py-2 text-[1.1rem]  "
              >
                <MdJoinLeft className=" text-[1.3rem] " />
                <span>Join</span>
              </Link>
            )}
            <Link
              href={`/faq`}
              className=" hidden lg:flex items-center gap-2 bg-transparent border-2 border-[#D6BFA7] text-[#D6BFA7]  transition-colors duration-300 ease-in-out rounded-lg px-8 py-2 text-[1.1rem]  "
            >
              <MdRoundaboutRight className=" text-[1.3rem] " />
              <span className=" lg:block hidden ">FAQ</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
