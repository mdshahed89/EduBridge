"use client";

import Header from "@/components/Header";
import HomeSidebar from "@/components/HomeSidebar";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import ProfileImg1 from "@/assets/ProfileImg1.png";
import ProfileImg2 from "@/assets/ProfileImg2.png";
import ProfileImg3 from "@/assets/ProfileImg3.png";
import { FiVideo } from "react-icons/fi";
import Link from "next/link";
import { AiOutlineCamera } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { TbColorFilter } from "react-icons/tb";
import { HomeFetchLoading } from "@/utils/Loading";
import NorwayFlag from "@/assets/norway.png";
import SwedenFlag from "@/assets/sweden.png";
import DenmarkFlag from "@/assets/denmark.png";
import FinlandFlag from "@/assets/finland.png";
import IcelandFlag from "@/assets/iceland.png";

type User = {
  _id: string;
  email: string;
  profileImg?: string;
  description?: string;
  userName?: string;
  name?: string;
  identity?: string;
  age?: number;
  nationality?: string;
  eyeColors?: string[];
  hairColors?: string[];
  heights?: string[];
  isPlanActive: boolean;
  onlyFansInfo: {
    video: number | null;
    img: number | null;
    react: number | null;
  };
};

type ApiResponse = {
  data: User[];
  total: number;
  totalPages: number;
  currentPage: number;
};

type Filters = {
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
};

export default function Home() {
  
  const [optionsOpen, setOptionsOpen] = useState(false);
  const sortOptions = [
    "Most Popular Today",
    "Newest Profile",
    "Oldest Profiles",
    "Most Liked",
    "Most Videos",
    "Most Pictures",
  ];
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [fetching, setFetching] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setOptionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 20,
    identity: [],
    nationality: "View All",
    search: "",
    sortBy: "Sort By",
    eyeColors: [],
    hairColors: [],
    heights: [],
  });
  // const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setFetching(true);

      const query = new URLSearchParams();

      if (filters.page) query.append("page", String(filters.page));
      if (filters.limit) query.append("limit", String(filters.limit));
      if (filters.nationality) query.append("nationality", filters.nationality);
      if (filters.minAge) query.append("minAge", filters.minAge);
      if (filters.maxAge) query.append("maxAge", filters.maxAge);
      if (filters.search) query.append("search", filters.search);
      if (filters.sortBy) query.append("sortBy", filters.sortBy);
      if (filters.identity.length > 0) {
        filters.identity.forEach((value) => {
          query.append("identity", value);
        });
      }
      if (filters.eyeColors.length > 0) {
        filters.eyeColors.forEach((value) => {
          query.append("eyeColors", value);
        });
      }
      if (filters.hairColors.length > 0) {
        filters.hairColors.forEach((value) => {
          query.append("hairColors", value);
        });
      }
      if (filters.heights.length > 0) {
        filters.heights.forEach((value) => {
          query.append("heights", value);
        });
      }

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/user/users?${query.toString()}`
      );

      if (!res.ok) {
        console.log(`HTTP error! status: ${res.status}`);
        return;
      }

      const data: ApiResponse = await res.json();

      setUsers(data.data);
      // setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setFetching(false);
    }
  };

  // const goToPage = (pageNumber: number) => {
  //   setFilters((prev) => ({ ...prev, page: pageNumber }));
  // };

  // console.log(users);
  // 470012

  return (
    <div>
      <Header filters={filters} setFilters={setFilters} />
      <div className=" bg-[linear-gradient(to_top_right,#1B0206,#1B0206,#1B0206,#2C040B,#2C040B)] text-[#fff] min-h-[100vh] pt-[5rem] full-bg pb-[1rem] ">
        <div className=" max-w-[1400px] mx-auto pt-[4rem] flex gap-10 lg:gap-20 px-3 ">
          <HomeSidebar
            filters={filters}
            setFilters={setFilters}
            isOpen={isOpen}
            toggleSidebar={toggleSidebar}
          />
          <div className=" w-full md:w-2/3 relative ">
            <div className=" flex justify-between md:justify-end ">
              <div
                onClick={toggleSidebar}
                className="  cursor-pointer md:hidden flex items-center gap-2 bg-[#D6BFA7] text-[#000] px-5 py-2 rounded-lg "
              >
                <TbColorFilter className=" text-[1.1rem] " />
                <span>Filter</span>
              </div>

              <div className="w-[13rem] relative text-center " ref={optionsRef}>
                <div
                  className="w-full px-2 py-2 border-2 border-[#D6BFA7] rounded-md cursor-pointer flex items-center justify-center gap-3 text-[#D6BFA7] "
                  onClick={() => setOptionsOpen(!optionsOpen)}
                >
                  <span>{filters.sortBy}</span>
                  <IoIosArrowDown
                    className={` ${
                      optionsOpen ? "rotate-180" : ""
                    } transition-all duration-300 ease-in-out text-[1.1rem] `}
                  />
                </div>
                {optionsOpen && (
                  <ul className="absolute w-full border-2 border-[#D6BFA7] rounded-lg mt-1 shadow-lg bg-[linear-gradient(to_top_right,#1B0206,#1B0206,#1B0206,#2C040B,#2C040B)] z-[60] ">
                    {sortOptions.map((option) => (
                      <li
                        key={option}
                        className="px-4 py-2 hover:bg-[#D6BFA7]/20 cursor-pointer "
                        onClick={() => {
                          setFilters({
                            ...filters,
                            sortBy: option,
                          });
                          setOptionsOpen(false);
                        }}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className=" mt-[2rem] md:mt-[.8rem] min-h-[25rem] relative ">
              {fetching ? <HomeFetchLoading /> : <Profiles users={users} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type ProfilesProps = {
  users: User[];
};

const Profiles = ({ users }: ProfilesProps) => {
  const incrementProfileView = async (userId: string): Promise<void> => {
    if (!userId) {
      console.log("No userId provided");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/increment-profile-view/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        console.log("Provile view incremented");
      } else {
        console.log("Failed to increment profile view");
      }
    } catch (error) {
      console.error("View increment error:", error);
    }
  };

  const activeUsers = users.filter((user) => user.isPlanActive);
  const inactiveUsers = users.filter((user) => !user.isPlanActive);

  const renderUserCard = (user: User) => {
    const userCountry =
      user.nationality === "Norway"
        ? NorwayFlag
        : user.nationality === "Sweden"
        ? SwedenFlag
        : user.nationality === "Denmark"
        ? DenmarkFlag
        : user.nationality === "Finland"
        ? FinlandFlag
        : user.nationality === "Iceland"
        ? IcelandFlag
        : null;

    return (
      <div
        key={user._id}
        className="shadow-[0px_1px_50px_#D6BFA726] hover:scale-[1.02] transition-all duration-300 ease-in-out w-full rounded-2xl overflow-hidden relative"
      >
        {user.isPlanActive && (
          <div className="absolute z-[50] bg-[#000] py-1 text-center rotate-[-45deg] -left-12 top-4 w-[10rem]">
            <div className="text-center text-sm">VIP</div>
          </div>
        )}

        <div className="w-full h-[10rem] relative bg-gradient-to-tr from-black to-[#800020]">
          {userCountry && (
            <div className="absolute top-3 right-3 z-40">
              <Image
                src={userCountry}
                alt="Country flag"
                className="w-[2rem] object-contain"
              />
            </div>
          )}
          <Image
            src={
              user.profileImg
                ? user.profileImg
                : user.identity === "Man"
                ? ProfileImg2
                : user.identity === "Woman"
                ? ProfileImg3
                : ProfileImg1
            }
            alt="Profile Img"
            fill
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="bg-[#20050c] pt-1 pb-3">
          <div className="font-semibold text-center border-b border-[#BFA07A] pb-1 mb-1">
            {user.userName || "username"}
          </div>
          <div className="grid grid-cols-3 gap-4 pt-3">
            <div className="flex flex-col gap-1 justify-center items-center w-full">
              <FiVideo className="text-[1.4rem]" />
              <div className="text-[#cac8c6]">{user.onlyFansInfo.video}</div>
            </div>
            <div className="flex flex-col gap-1 justify-center items-center w-full">
              <AiOutlineCamera className="text-[1.4rem]" />
              <div className="text-[#cac8c6]">{user.onlyFansInfo.img}</div>
            </div>
            <div className="flex flex-col gap-1 justify-center items-center w-full">
              <FaRegHeart className="text-[1.4rem]" />
              <div className="text-[#cac8c6]">{user.onlyFansInfo.react}</div>
            </div>
          </div>
          <div className="w-full mt-[1rem] px-2">
            <Link
              onClick={() => incrementProfileView(user._id)}
              href={`/profile-view/${user._id}`}
              className="block w-full py-2 px-2 text-center border-2 border-[#BFA07A] hover:bg-[#BFA07A] text-[#fff] transition-colors duration-300 ease-in-out rounded-md"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Active Users */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {activeUsers.map(renderUserCard)}
      </div>

      {/* Divider */}
      {inactiveUsers.length > 0 && (
        <hr className="h-1 bg-[#D6BFA7] my-6 border-none rounded-full" />
      )}

      {/* Inactive Users */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {inactiveUsers.map(renderUserCard)}
      </div>
    </div>
  );
};
