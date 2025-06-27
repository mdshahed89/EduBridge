import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaBookOpen } from "react-icons/fa6";
import { GiBookshelf } from "react-icons/gi";
import { HiUsers } from "react-icons/hi2";
import {
  MdFavoriteBorder,
  MdLocalFireDepartment,
  MdOutlineTimer,
  MdPersonAddAlt1,
  MdPlayCircleFilled,
} from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { RiMoneyDollarCircleFill, RiPlayList2Fill } from "react-icons/ri";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard icon={<FaBookOpen />} label="Enrolled Courses" value={5} />
      <SummaryCard
        icon={<MdPlayCircleFilled />}
        label="Courses In Progress"
        value={2}
      />
      <SummaryCard
        icon={<AiOutlineCheckCircle />}
        label="Completed Courses"
        value={3}
      />
      <SummaryCard
        icon={<BsPatchCheckFill />}
        label="Certificates Earned"
        value={2}
      />
      <SummaryCard
        icon={<RiPlayList2Fill />}
        label="Lectures Watched"
        value={45}
      />
      <SummaryCard
        icon={<MdOutlineTimer />}
        label="Total Learning Time"
        value={"12h"}
      />
      <SummaryCard
        icon={<MdFavoriteBorder />}
        label="Wishlist Courses"
        value={4}
      />
      <SummaryCard
        icon={<MdLocalFireDepartment />}
        label="Learning Streak"
        value={"3 Days"}
      />
    </div>
  );
};

const SummaryCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) => (
  <div className="flex items-center gap-4 px-4 py-5 rounded-lg bg-[#0400ff]/5">
    <div className="p-3 bg-[#0400ff]/10 text-[#0400ff] text-2xl rounded-lg">
      {icon}
    </div>
    <div className="text-lg font-medium">
      <div className="text-[#5e5e5e]">{label}</div>
      <div>{value}</div>
    </div>
  </div>
);
