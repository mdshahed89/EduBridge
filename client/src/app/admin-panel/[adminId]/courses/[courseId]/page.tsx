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
  const { courseId, adminId } = useParams();
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/course/${courseId}`,
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
    if (userData.token && courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleAddModule = async () => {
    if (!title) {
      toast.error("Title is required!!");
      return;
    }

    const toastId = toast.loading("Adding module...");
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
        throw new Error(data.message || "Failed to add module");
      }

      toast.success("New module added successfully!", { id: toastId });
      fetchCourse();
      setTitle("");
      setShowModal(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong";
      toast.error(message, { id: toastId });
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

    const toastId = toast.loading("Updating module...");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/module/${selectedModule._id}`,
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
        throw new Error(data.message || "Failed to update module");
      }

      toast.success("Module updated successfully!", { id: toastId });
      fetchCourse();
      setShowEditModal(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Error occurred";

      toast.error(message, { id: toastId });
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
        href={`/admin-panel/${adminId}/courses`}
        className=" flex items-center gap-1 text-[#0400ff] mb-[1rem] "
      >
        <RiArrowGoBackFill />
        <span>Back</span>
      </Link>
      <div>
        <div className=" text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] font-medium leading-tight ">
          {course?.title}
        </div>
        <div className=" text-lg text-[#0400ff] mt-[1rem] ">
          ${course?.price}
        </div>
      </div>

      <div className=" mt-[2rem] ">
        <h3 className=" text-[1.2rem] md:text-[1.5rem] font-medium ">
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
          <div>
            <div
              onClick={() => setShowModal(true)}
              className="md:hidden cursor-pointer bg-[#0400ff] p-3 rounded-full text-white text-lg shadow"
            >
              <FaPlus />
            </div>

            <div
              onClick={() => setShowModal(true)}
              className="hidden md:inline-block text-nowrap cursor-pointer bg-[#0400ff] px-5 py-2 rounded-md text-white active:scale-95 transition-all duration-300 ease-in-out"
            >
              Add New Module
            </div>
          </div>
        </div>

        {filteredModules.length === 0 ? (
          <div className=" text-[1.1rem] font-medium h-[7rem] flex items-center text-[#969595] ">
            No modules available for this course.
          </div>
        ) : (
          <div className="  ">
            {filteredModules.map((module, idx) => (
              <div
                key={idx}
                className={` flex items-center justify-between py-3  ${
                  modules.length !== idx + 1 && "border-b"
                } `}
              >
                <Link
                  href={`/admin-panel/${adminId}/courses/${courseId}/module/${module._id}`}
                  className=" group transition-all duration-300 ease-in-out "
                >
                  <div className="  ">
                    <div className=" text-[#757575] ">
                      Module {module.moduleNumber}
                    </div>
                    <div className=" line-clamp-1 text-[1.1rem] md:text-[1.3rem] font-medium group-hover:text-[#0400ff] group-hover:underline  ">
                      {module.title}
                    </div>
                  </div>
                </Link>

                <div className=" flex items-center gap-2 text-[1.7rem] ">
                  <div
                    onClick={() => {
                      setSelectedModule(module);
                      setTitleForUpdate(module.title);
                      setShowEditModal(true);
                    }}
                    className=" cursor-pointer text-[#0400ff] p-2 rounded-full hover:bg-[#0400ff]/5 "
                  >
                    <CiEdit />
                  </div>
                  <div
                    onClick={() => {
                      setSelectedModule(module);

                      setShowDeleteModal(true);
                    }}
                    className=" cursor-pointer text-red-500 p-2 rounded-full hover:bg-red-50 "
                  >
                    <MdDeleteOutline />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showEditModal && (
        <div
          onClick={() => {
            setShowEditModal(false);
            setSelectedModule(null);
          }}
          className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-md p-6 w-[90%] max-w-md relative"
          >
            <h2 className="text-lg font-semibold mb-4">Update Module</h2>
            <input
              type="text"
              value={titleForUpdate}
              onChange={(e) => setTitleForUpdate(e.target.value)}
              placeholder="Module Title"
              className=" bg-slate-50 border-2 border-slate-100 px-3 py-2 outline-none w-full rounded-md "
            />
            <div className="flex justify-end gap-3 mt-[1.5rem] ">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedModule(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateModule}
                disabled={loading}
                className="px-4 py-2 bg-[#0400ff] text-white rounded-md"
              >
                Update Module
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedModule && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center"
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedModule(null);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-lg w-[90%] max-w-sm text-center"
          >
            <h2 className="text-lg font-semibold mb-4">Delete Module</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this Module?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedModule(null);
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
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/module/${selectedModule._id}`,
                      {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${userData.token}`,
                        },
                      }
                    );
                    if (!res.ok) throw new Error("Delete failed");
                    toast.success("Module deleted", { id: toastId });
                    setShowDeleteModal(false);
                    setSelectedModule(null);
                    fetchCourse();
                  } catch (err: unknown) {
                    if (err instanceof Error) {
                      console.error("Delete module error:", err.message);
                    }
                    toast.error("Failed to delete module", { id: toastId });
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

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-md p-6 w-[90%] max-w-md relative"
          >
            <h2 className="text-lg font-semibold mb-4">Add New Module</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Module Title"
              className=" bg-slate-50 border-2 border-slate-100 px-3 py-2 outline-none w-full rounded-md "
            />
            <div className="flex justify-end gap-3 mt-[1.5rem] ">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddModule}
                disabled={loading}
                className="px-4 py-2 bg-[#0400ff] text-white rounded-md"
              >
                Add New Module
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
