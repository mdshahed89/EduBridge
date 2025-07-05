"use client";

import { useData } from "@/context/Context";
import { FetchLoading } from "@/utils/Loading";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { useDebounce } from "use-debounce";

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

const Page = () => {
  const { adminId } = useParams();
  const { userData } = useData();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const fetchCourses = async () => {
    if (!userData.token) {
      setError("Unauthorized: No token found");
      return;
    }

    try {
      setLoading(true)
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/admin/course?search=${encodeURIComponent(debouncedSearchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setLoading(false)
        throw new Error(data.message || "Failed to fetch lectures");
      }

      setCourses(data);
      setError("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData.token) {
      fetchCourses();
    }
  }, [userData, debouncedSearchQuery]);

  // console.log(courses);

  // if (loading) {
  //   return (
  //     <div className=" min-h-[20rem] relative ">
  //       <FetchLoading />
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className=" flex items-center justify-between ">
        <h3 className=" text-[1.3rem] font-medium ">All Courses</h3>
      </div>

      {error && <p className=" text-sm text-red-500 mt-2 ">{error}</p>}

      <div className=" mt-[2rem] flex justify-between gap-4 ">
        <div className=" w-full md:w-[40%] relative flex items-center gap-6  ">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search course..."
            className=" w-full outline-none border-none py-2 pl-4 pr-[3rem] bg-[#F6F6FB] rounded-md "
          />
          <div className=" absolute top-0 right-0 px-4 h-full flex items-center  ">
            <FiSearch className=" text-[#A6ABC8] text-[1.2rem] " />
          </div>
        </div>
        <div>
          <Link
            href={`/admin-panel/${adminId}/courses/add-course`}
            className="md:hidden block cursor-pointer bg-[#0400ff] p-3 rounded-full text-white text-lg shadow"
          >
            <FaPlus />
          </Link>

          <Link
            href={`/admin-panel/${adminId}/courses/add-course`}
            className=" md:flex hidden cursor-pointer bg-[#0400ff] px-5 py-2 rounded-md text-[#fff] active:scale-95 transition-all duration-300 ease-in-out "
          >
            Add New Course
          </Link>
        </div>
      </div>

      {
        loading ? <div className=" min-h-[20rem] relative ">
          <FetchLoading />
        </div> : <div className="mt-[2rem] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
        {courses.map((course, idx) => (
          <div
            key={idx}
            className="w-full rounded-lg overflow-hidden border bg-white flex flex-col relative"
          >
            <div className=" absolute top-2 right-2 flex items-center gap-2 text-[1.7rem] z-50 ">
              <Link
                href={`/admin-panel/${adminId}/courses/${course._id}/update-course`}
                className=" cursor-pointer text-[#0400ff] p-2 rounded-full bg-[#fff] "
              >
                <CiEdit />
              </Link>
              <div
                onClick={() => {
                  setSelectedCourseId(course._id);
                  setShowDeleteModal(true);
                }}
                className=" cursor-pointer text-red-500 p-2 rounded-full bg-red-50 "
              >
                <MdDeleteOutline />
              </div>
            </div>
            <div className="w-full h-[15rem] relative">
              <Image
                src={course.thumbnail}
                alt="course thumbnail"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-between h-full px-2 py-2 bg-[#0400ff]/5 flex-1">
              <div className="flex-1">
                <div className=" text-[1.2rem] md:text-[1.4rem] font-medium line-clamp-1">
                  {course.title}
                </div>
                <div className="text-[#414040] line-clamp-2">
                  {course.description}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[#0400ff]">${course.price}</span>
                  <span className="line-through text-gray-500">
                    ${Number(course.price + course.price * 0.3).toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Button */}
              <Link
                href={`/admin-panel/${adminId}/courses/${course._id}`}
                className="mt-4 bg-[#0400ff] py-2 w-full block text-center rounded-md text-white active:scale-95 transition-all duration-300 ease-in-out"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
      }

      {showDeleteModal && selectedCourseId && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center"
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedCourseId("");
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-lg w-[90%] max-w-sm text-center"
          >
            <h2 className="text-lg font-semibold mb-4">Delete Course</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this Course?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCourseId("");
                }}
                className="px-4 py-2 text-gray-700 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const toastId = toast.loading("Deleting...");
                  try {
                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/course/${selectedCourseId}`,
                      {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${userData.token}`,
                        },
                      }
                    );
                    if (!res.ok) throw new Error("Delete failed");
                    toast.success("Course deleted", { id: toastId });
                    setShowDeleteModal(false);
                    setSelectedCourseId("");
                    fetchCourses();
                  } catch (err: unknown) {
                    if (err instanceof Error) {
                      console.error("Failed to delete course:", err.message);
                    }
                    toast.error("Failed to delete course", { id: toastId });
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
