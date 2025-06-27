import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FaBookOpen } from "react-icons/fa6";
import { GiBookshelf } from "react-icons/gi";
import { HiUsers } from "react-icons/hi2";
import { MdPersonAddAlt1, MdPlayCircleFilled } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { RiMoneyDollarCircleFill } from "react-icons/ri";

const page = () => {
  return (
    <div>
      <h3 className=" mb-[2rem] ">Dashboard</h3>

      <Summary />
    </div>
  );
};

export default page;

const Summary = () => {
  return (
    <div className=" grid grid-cols-4 gap-2 ">
      <div className=" flex items-center gap-6 px-[1rem] py-[1.5rem] rounded-lg bg-[#0400ff]/5 ">
        <div className=" p-3 bg-[#0400ff]/10 text-[#0400ff] text-[2rem] rounded-lg ">
          <FaBookOpen />
        </div>
        <div className=" text-[1.4rem] font-medium ">
          <div className=" text-[#5e5e5e] ">Enrolled Courses</div>
          <div>30</div>
        </div>
      </div>
      <div className=" flex items-center gap-6 px-[1rem] py-[1.5rem] rounded-lg bg-[#0400ff]/5 ">
        <div className=" p-3 bg-[#0400ff]/10 text-[#0400ff] text-[2rem] rounded-lg ">
          <MdPlayCircleFilled />
        </div>
        <div className=" text-[1.4rem] font-medium ">
          <div className=" text-[#5e5e5e] ">Active Courses</div>
          <div>30</div>
        </div>
      </div>
      <div className=" flex items-center gap-6 px-[1rem] py-[1.5rem] rounded-lg bg-[#0400ff]/5 ">
        <div className=" p-3 bg-[#0400ff]/10 text-[#0400ff] text-[2rem] rounded-lg ">
          <AiOutlineCheckCircle />
        </div>
        <div className=" text-[1.4rem] font-medium ">
          <div className=" text-[#5e5e5e] ">Completed Courses</div>
          <div>30</div>
        </div>
      </div>
      <div className=" flex items-center gap-6 px-[1rem] py-[1.5rem] rounded-lg bg-[#0400ff]/5 ">
        <div className=" p-3 bg-[#0400ff]/10 text-[#0400ff] text-[2rem] rounded-lg ">
          <MdPersonAddAlt1 />
        </div>
        <div className=" text-[1.4rem] font-medium ">
          <div className=" text-[#5e5e5e] ">New Registrations</div>
          <div>30</div>
        </div>
      </div>
      <div className=" flex items-center gap-6 px-[1rem] py-[1.5rem] rounded-lg bg-[#0400ff]/5 ">
        <div className=" p-3 bg-[#0400ff]/10 text-[#0400ff] text-[2rem] rounded-lg ">
          <PiStudentFill />
        </div>
        <div className=" text-[1.4rem] font-medium ">
          <div className=" text-[#5e5e5e] ">Total Students</div>
          <div>30</div>
        </div>
      </div>
      <div className=" flex items-center gap-6 px-[1rem] py-[1.5rem] rounded-lg bg-[#0400ff]/5 ">
        <div className=" p-3 bg-[#0400ff]/10 text-[#0400ff] text-[2rem] rounded-lg ">
          <GiBookshelf />
        </div>
        <div className=" text-[1.4rem] font-medium ">
          <div className=" text-[#5e5e5e] ">Total Courses</div>
          <div>30</div>
        </div>
      </div>
      <div className=" flex items-center gap-6 px-[1rem] py-[1.5rem] rounded-lg bg-[#0400ff]/5 ">
        <div className=" p-3 bg-[#0400ff]/10 text-[#0400ff] text-[2rem] rounded-lg ">
          <RiMoneyDollarCircleFill />
        </div>
        <div className=" text-[1.4rem] font-medium ">
          <div className=" text-[#5e5e5e] ">Total Earning</div>
          <div>30</div>
        </div>
      </div>
      <div className=" flex items-center gap-6 px-[1rem] py-[1.5rem] rounded-lg bg-[#0400ff]/5 ">
        <div className=" p-3 bg-[#0400ff]/10 text-[#0400ff] text-[2rem] rounded-lg ">
          <HiUsers />
        </div>
        <div className=" text-[1.4rem] font-medium ">
          <div className=" text-[#5e5e5e] ">Total Instructors</div>
          <div>30</div>
        </div>
      </div>
    </div>
  );
};
