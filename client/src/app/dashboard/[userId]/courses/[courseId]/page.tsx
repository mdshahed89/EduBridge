"use client";

import { useData } from "@/context/Context";
import { FetchLoading } from "@/utils/Loading";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { RiArrowGoBackFill } from "react-icons/ri";

interface Course {
  _id: string;
  title: string;
  price: number;
  description: string;
  thumbnail: string;
  // Add other fields as needed
}

interface Module {
  _id: string;
  title: string;
  moduleNumber: number;
  course: string;
}

const Page = () => {
  const { courseId, userId } = useParams();
  const { userData } = useData();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [titleForUpdate, setTitleForUpdate] = useState("");
  // const [toast, setToast] = useState("");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCourse = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/courses/${courseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch course");

      setCourse(data.course);
      setModules(data.modules);
      setError("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userData.token && courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleAddModule = async () => {
    if (!title) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/module`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify({ title, courseId }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // setToast();
        toast.error(data.message || "Failed to add module");
        return;
      }

      fetchCourse();
      toast.success("New module added successfully!!");
      setTitle("");
      setShowModal(false);
    } catch (error: any) {
      // setToast();
      toast.error(error.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateModule = async () => {
    if (!titleForUpdate) {
      toast.error("Title is required!!");
      return;
    }
    if (!selectedModule?._id) {
      toast.error("Something went wrong");
      return;
    }
    if (!userData.token) {
      toast.error("You are not authenticated!!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/module/${selectedModule?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify({ title: titleForUpdate, courseId }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // setToast();
        toast.error(data.message || "Failed to Update module");
        return;
      }

      fetchCourse();
      toast.success("Module Update Successfully!!");
      setShowEditModal(false);
    } catch (error: any) {
      // setToast();
      toast.error(error.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filteredModules = modules.filter((module) =>
    module.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // console.log(course);

  if (loading)
    return (
      <div className=" relative min-h-[20rem] ">
        <FetchLoading />
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <Link
        href={`/dashboard/${userId}/courses`}
        className=" flex items-center gap-1 text-[#0400ff] mb-[1rem] "
      >
        <RiArrowGoBackFill />
        <span>Back</span>
      </Link>
      <div>
        <div className=" text-[2.5rem] font-medium leading-tight ">
          {course?.title}
        </div>
        <span className=" text-lg text-[#0400ff] mt-[1rem] ">
          ${course?.price}
        </span>
      </div>

      <div className=" cursor-pointer bg-[#0400ff] px-7 py-2 w-fit text-[#fff] font-medium rounded-md mt-[2rem] active:scale-95 transition-all duration-300 ease-in-out ">
        Enroll For Free
      </div>

      <div className=" mt-[2rem] ">
        <h3 className=" text-[1.5rem] font-medium ">
          There are {modules.length} modules in this course
        </h3>
        <p className=" text-lg text-[#2e2e2e] mt-[.5rem] ">
          {course?.description}
        </p>
      </div>

      <div className=" min-h-[20rem] mt-[2rem] border p-[1rem] rounded-lg ">
        <div className=" my-3 flex justify-between gap-4 ">
          <div className=" w-full md:w-[40%] relative flex items-center gap-6  ">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search module by title..."
              className=" w-full outline-none border-none py-2 pl-4 pr-[3rem] bg-[#F6F6FB] rounded-md "
            />
            <div className=" absolute top-0 right-0 px-4 h-full flex items-center  ">
              <FiSearch className=" text-[#A6ABC8] text-[1.2rem] " />
            </div>
          </div>
        </div>

        {
          filteredModules.length > 0 ? <div className="  ">
          {filteredModules.map((module, idx) => (
            <div
              key={idx}
              className={` flex items-center justify-between py-3  ${
                modules.length !== idx + 1 && "border-b"
              } `}
            >
              <Link
                href={`/dashboard/${userId}/courses/${courseId}/module/${module._id}`}
                className=" group transition-all duration-300 ease-in-out "
              >
                <div className="  ">
                  <div className=" text-[#757575] ">
                    Module {module.moduleNumber}
                  </div>
                  <div className=" line-clamp-1 text-[1.3rem] font-medium group-hover:text-[#0400ff] group-hover:underline  ">
                    {module.title}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div> : <div className=" mt-[2rem] text-[1.2rem] font-medium text-[#5e5e5e] ">
            There are no module's yet
          </div>
        }
      </div>
    </div>
  );
};

export default Page;
