"use client";

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import {
  FaHome,
} from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";
import { BsLayoutSidebar } from "react-icons/bs";
import { PiStudentBold } from "react-icons/pi";
import { MdHelpOutline, MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { LuBookOpen, LuGraduationCap } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";
import { useData } from "@/context/Context";
import toast from "react-hot-toast";

interface SidebarProps {
  id: string;
  isOpenSidebar: boolean;
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ id, isOpenSidebar, setIsOpenSidebar }: SidebarProps) => {
  const { logout } = useData();
  const router = useRouter();
  const currentPath = usePathname();

  const items1 = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: `/dashboard/${id}`,
    },
    {
      name: "My Profile",
      icon: <CgProfile />,
      path: `/dashboard/${id}/profile`,
    },
    {
      name: "Courses",
      icon: <LuBookOpen />,
      path: `/dashboard/${id}/courses`,
    },
    {
      name: "Enrolled Courses",
      icon: <LuGraduationCap />,
      path: `/dashboard/${id}/enrolled-courses`,
    },
  ];

  const items2 = [
    {
      name: "Setting",
      icon: <FiSettings />,
      path: `/dashboard/${id}/setting`,
    },
    {
      name: "Help",
      icon: <MdHelpOutline />,
      path: `/dashboard/${id}/help`,
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-[59] ${
          !isOpenSidebar
            ? "xl:bg-transparent bg-black/20 xl:w-fit w-full"
            : "pointer-events-none"
        }`}
        onClick={() => {
          if (window.innerWidth < 1280) {
            // Tailwind's xl = 1280px
            setIsOpenSidebar(true);
          }
        }}
      >
        <div
          className={`bg-[#ededf7] h-screen w-[300px] flex flex-col justify-between pb-8
    transform transition-transform duration-300 ease-in-out ${
      !isOpenSidebar ? "translate-x-0" : "-translate-x-full"
    }`}
          onClick={(e) => e.stopPropagation()} 
        >
          <div>
            <div className=" h-[70px] w-full border-b border-[#d6d8dd] px-4 lg:px-8 gap-2 flex items-center justify-between ">
              <Link href={`/`} className=" flex items-center gap-1 font-poppins ">
                <div className=" text-[#0400ff] text-[1.8rem]  ">
                  <PiStudentBold />
                </div>
                <span className=" text-[1.5rem] font-medium ">EduBridge</span>
              </Link>
              <div
                onClick={() => setIsOpenSidebar(!isOpenSidebar)}
                className=" text-[1.3rem] cursor-pointer xl:hidden flex "
              >
                <BsLayoutSidebar
                  className={` ${
                    isOpenSidebar ? "rotate-180" : "rotate-0"
                  } transition-all duration-300 ease-in-out `}
                />
              </div>
            </div>
            <div className=" px-4 pt-8 space-y-3 ">
              <div className=" text-[#082431]/50 px-4 ">Main Menu</div>
              <div className=" space-y-2 ">
                {items1.map((item, idx) => (
                  <Link
                    href={item.path}
                    onClick={() => {
                      if (
                        typeof window !== "undefined" &&
                        window.innerWidth < 1280
                      ) {
                        setIsOpenSidebar(true);
                      }
                    }}
                    key={idx}
                    className={` ${
                      item.path === currentPath
                        ? "bg-[#0400ff]/10 text-[#0400ff]"
                        : " bg-transparent text-[#A6ABC8]/60 "
                    } flex items-center gap-3 hover:bg-[#0400ff]/10 py-2 px-4 rounded-md text-[1.1rem] group  `}
                  >
                    <div
                      className={` ${
                        item.path === currentPath
                          ? "text-[#0400ff]"
                          : " text-[#A6ABC8]/60 "
                      } group-hover:text-[#0400ff] `}
                    >
                      {item.icon}
                    </div>
                    <div
                      className={` ${
                        item.path === currentPath
                          ? "text-[#0400ff]"
                          : " text-[#273240]/60 "
                      } text-[1rem] group-hover:text-[#0400ff] `}
                    >
                      {item.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className=" px-4 pt-8 space-y-3 ">
              <div className=" text-[#082431]/50 px-4 ">Account Setting</div>

              <Items items={items2} currentPath={currentPath} />
            </div>
          </div>

          <div className=" px-7  ">
            <div
              onClick={() => {
                logout();
                toast.success("Logout Successfully!!");
                router.push(`/login`);
              }}
              className=" cursor-pointer flex items-center justify-between bg-[#0400ff]/10 px-3 py-2 rounded-lg text-[#0400ff]  "
            >
              <div>Sign Out</div>
              <MdLogout />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

type ItemType = {
  name: string;
  icon: ReactNode;
  path: string;
  subItems?: ItemType[];
};

type ItemsProps = {
  items: ItemType[];
  currentPath: string;
};

const Items = ({ items, currentPath }: ItemsProps) => {
  const [isActive, setIsActive] = useState<number | null>(null);
  const handleToggle = (idx: number) => {
    setIsActive((prevIdx) => (prevIdx === idx ? null : idx));
  };

  return (
    <div className=" space-y-2 ">
      {items.map((item, idx) => (
        <div key={idx}>
          <Link
            onClick={() => handleToggle(idx)}
            href={item.subItems ? currentPath : item.path}
            className={` ${
              item.path === currentPath
                ? "bg-[#0400ff]/10 text-[#0400ff]"
                : " bg-transparent text-[#A6ABC8]/60 "
            }  hover:bg-[#0400ff]/10 py-2 px-4 rounded-md text-[1.1rem] group flex items-center justify-between `}
          >
            <div className=" flex items-center gap-3 ">
              <div
                className={` ${
                  item.path === currentPath
                    ? "text-[#0400ff]"
                    : " text-[#A6ABC8]/60 "
                } group-hover:text-[#0400ff] `}
              >
                {item.icon}
              </div>
              <div
                className={` ${
                  item.path === currentPath
                    ? "text-[#0400ff]"
                    : " text-[#273240]/60 "
                } text-[1rem] group-hover:text-[#0400ff] `}
              >
                {item.name}
              </div>
            </div>
            {item.subItems && (
              <div
                className={` ${
                  item.path === currentPath
                    ? "text-[#0400ff]"
                    : " text-[#273240]/60 "
                } text-[1rem] group-hover:text-[#0400ff] `}
              >
                <IoIosArrowForward
                  className={` ${
                    isActive === idx ? "rotate-90" : ""
                  } transition-all duration-300 ease-in-out `}
                />
              </div>
            )}
          </Link>

          <div
            className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
              isActive === idx
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden *:cursor-pointer pl-4 ">
              {item.subItems?.map((sub, idx) => (
                <div
                  key={idx}
                  className="w-full flex items-center gap-2 border-l-4 py-3 pl-3 border-[#A6ABC8]/60 text-sm text-gray-400 transition-all duration-300 hover:border-[#0400ff] hover:bg-[#707FDD]/10 hover:text-[#0400ff] "
                >
                  {sub.icon}
                  {sub.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// const SwitchMode = () => {
//   const [toggle, setToggle] = useState(false);

//   return (
//     <div className=" px-8 flex items-center gap-2 ">
//       <button
//         onClick={() => setToggle((prev) => !prev)}
//         className={`flex h-5 w-12 items-center rounded-full border border-[#5A6ACF] p-1 ${
//           toggle ? "bg-[#5A6ACF]/50" : null
//         }`}
//       >
//         <div
//           className={`size-4 rounded-full bg-[#5A6ACF] duration-200 ${
//             toggle ? "translate-x-[1.45rem]" : "translate-x-0"
//           }`}
//         ></div>
//       </button>
//       <span>Dark Mode</span>
//     </div>
//   );
// };


