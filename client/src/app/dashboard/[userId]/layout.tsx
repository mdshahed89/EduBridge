"use client";
import { PageLoading } from "@/utils/Loading";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useData } from "@/context/Context";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}) {

  const {userData}  = useData()
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null);
  const [isOpenSidebar, setIsOpenSidebar] = useState(() => {
  if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
    return true;
  }
  return false; 
});

  useEffect(() => {
    params.then((res) => {
      setUserId(res.userId);
    });
  }, [params]);

  if (!userId) {
    return <PageLoading />;
  }

  if(!userData || userData.role !== "User"){
    router.push(`/login`)
  }

  return (
    <div className="min-h-[100vh] flex">
      <Sidebar id={userId} isOpenSidebar={isOpenSidebar} setIsOpenSidebar={setIsOpenSidebar} />
      <div className=" w-full  ">
        <TopBar
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
        />
        <div
          className={` ${
            isOpenSidebar ? "ml-[0px]" : "xl:ml-[300px]"
          } mt-[70px] bg-[#ffffff] xl:px-10 px-3 md:px-5 pt-6 pb-[2rem] transition-all duration-300 ease-in-out `}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
