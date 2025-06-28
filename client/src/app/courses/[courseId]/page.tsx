"use client";

import { useData } from "@/context/Context";
import { FetchLoading } from "@/utils/Loading";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlay } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowForward, IoIosStar } from "react-icons/io";
import { IoInformationCircleSharp } from "react-icons/io5";
import { RiArrowGoBackFill } from "react-icons/ri";
import { useDebounce } from "use-debounce";
import MyImage from "@/assets/MyImg.png";
import Image from "next/image";
import { PiStudentBold } from "react-icons/pi";

interface Course {
  _id: string;
  title: string;
  price: number;
  description: string;
  thumbnail: string;
  // Add other fields as needed
}

interface Lecture {
  _id: string;
  title: string;
  videoDuration: string;
  pdfCount: number;
}

interface Module {
  _id: string;
  title: string;
  moduleNumber: number;
  course: string;
  lectures: Lecture[];
}

const Page = () => {
  const { courseId } = useParams();
  const router = useRouter();
  const { userData } = useData();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [toastMessage, setToastMessage] = useState({
    type: "",
    message: "",
  });

  const fetchCourse = async () => {
    try {
      const body = {
        search: debouncedSearchQuery,
        ...(userData._id && { userId: userData._id }),
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/course/modules-with-lectures/${courseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch course");

      setCourse(data?.course || null);
      setModules(data?.moduleWithLectures || []);
      setEnrolledCourses(data?.enrolledCourses || []);
      setError("");
    } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Something went wrong");
  }
}
 finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId, debouncedSearchQuery]);

  const [openModuleId, setOpenModuleId] = useState<string | null>(null);

  const toggleModule = (id: string) => {
    setOpenModuleId((prev) => (prev === id ? null : id));
  };

  const handleEnrollCourse = async () => {
    if (!userData.token) {
      setToastMessage({
        type: "Error",
        message: "You are not authenticated to add course",
      });
      toast.error("Need to login to enroll in course");
      router.push("/login");
    }

    if (!courseId) {
      setToastMessage({
        type: "Error",
        message: "Something went wrong!!",
      });
      toast.error("Something went wrong!!");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/enroll-course/${courseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify({
            courseId,
          }),
        }
      );

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        toast.error("Failed to enroll course!!");
        return;
      }

      if (data?.courseId) {
        setToastMessage({
          type: "SUCCESS",
          message: "Course enrolled successfully!!",
        });
        toast.success("Course enrolled successfully!!");
        setTimeout(() => {
          router.push(
            `/dashboard/${userData._id}/enrolled-courses/${data.courseId}`
          );
        }, 1000);
      } else {
        setToastMessage({
          type: "Error",
          message: "Something Went Wrong!!",
        });
        toast.success("Something went wrong!!");
        return;
      }
    } catch (error: unknown) {
  let message = "Failed to create course";

  if (error instanceof Error && error.message) {
    console.error("Error:", error.message);
    message = error.message;
  } else {
    console.error("Error:", error);
  }

  setToastMessage({
    type: "ERROR",
    message,
  });

  toast.error(message);
}

  };

  // console.log(enrolledCourses);

  if (loading)
    return (
      <div className=" relative min-h-[20rem] ">
        <FetchLoading />
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className=" pt-[7rem] max-w-[1400px] mx-auto px-3 ">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-[#0400ff] mb-[1rem]"
      >
        <RiArrowGoBackFill />
        <span>Back</span>
      </button>
      <div>
        <div className=" md:text-[2rem] text-[1.5rem] lg:text-[2.5rem] font-medium leading-tight ">
          {course?.title}
        </div>
        <div className=" text-lg text-[#0400ff] mt-[1rem] ">
          ${course?.price}
        </div>
      </div>

      {(enrolledCourses as { course: string }[]).some(
        (item) => item.course === courseId
      ) ? (
        <div className="mt-[2rem]">
          <div className="bg-green-600 text-white px-7 py-2 w-fit rounded-md font-semibold">
            Course Enrolled
          </div>
          <Link
            href={`/dashboard/${userData._id}/enrolled-courses/${courseId}`}
            className=" text-green-500 font-medium flex items-center gap-1 mt-4 group "
          >
            <span>Start Learning</span>
            <div className=" group-hover:ml-2 transition-all duration-300 ease-in-out text-[1.2rem] mt-1 ">
              <IoIosArrowForward />
            </div>
          </Link>
        </div>
      ) : (
        <div
          onClick={handleEnrollCourse}
          className="cursor-pointer bg-[#0400ff] px-7 py-2 w-fit text-white font-medium rounded-md mt-[2rem] active:scale-95 transition-all duration-300 ease-in-out"
        >
          Enroll for Free Now
        </div>
      )}
      {
        toastMessage.type === "Error" && <p className=" text-sm text-red-500 mt-2 ">{toastMessage.message}</p>
      }

      <div className=" mt-[2rem] ">
        <h3 className=" text-[1.2rem] md:text-[1.5rem] font-medium ">
          There are {modules.length} modules in this course
        </h3>
        <p className=" text-base md:text-lg text-[#2e2e2e] mt-[.5rem] ">
          {course?.description}
        </p>
      </div>

      <div className=" flex gap-5 mt-[2rem] lg:flex-row flex-col ">
        <div className=" min-h-[20rem] w-full  border p-[1rem] rounded-lg ">
          <div className=" my-3 flex items-center justify-between gap-4 ">
            <div className=" w-full md:max-w-[40rem] relative flex items-center gap-6  ">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by module title, lecture title, or module number..."
                className=" w-full outline-none border-none py-2 pl-4 pr-[3rem] bg-[#F6F6FB] rounded-md "
              />
              <div className=" absolute top-0 right-0 px-4 h-full flex items-center  ">
                <FiSearch className=" text-[#A6ABC8] text-[1.2rem] " />
              </div>
            </div>
          </div>

          {modules.length > 0 ? (
            <div className="  ">
              {modules.map((module) => {
                const isOpen = openModuleId === module._id;

                return (
                  <div key={module._id} className="border-b">
                    {/* Module header */}
                    <div
                      onClick={() => toggleModule(module._id)}
                      className="flex items-center justify-between py-2 px-[.3rem] md:px-[1rem] rounded-t-md hover:bg-gray-50 transition-colors duration-300 ease-in-out cursor-pointer"
                    >
                      <div className="group transition-all duration-300 ease-in-out">
                        <div className="text-[#757575]">
                          Module {module.moduleNumber}
                        </div>
                        <div className="line-clamp-1 text-[1.1rem] md:text-[1.3rem] font-medium ">
                          {module.title}
                        </div>
                      </div>
                      <div
                        className={` text-[1.2rem] md:text-[1.4rem] transform transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        <IoIosArrowDown />
                      </div>
                    </div>

                    {/* Lecture dropdown */}
                    <div
                      className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100 py-2 "
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className={` overflow-hidden px-4 space-y-2 `}>
                        {module.lectures.length > 0 ? (
                          module.lectures.map((lecture) => (
                            // <div
                            //   key={lecture._id}
                            //   className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
                            // >
                            //   <div className="font-semibold">{lecture.title}</div>
                            // </div>
                            <div
                              key={lecture._id}
                              className=" flex items-center gap-2 group transition-all duration-300 ease-in-out cursor-pointer bg-slate-50 p-1 rounded-md "
                            >
                              <div className=" p-2 rounded-full text-[#0400ff] text-[1.3rem] bg-[#0400ff]/5 group-hover:bg-[#0400ff]/10 ">
                                <FaPlay />
                              </div>
                              <div>
                                <div className=" ">{lecture.title}</div>

                                <div className=" flex items-center gap-3 text-sm ">
                                  <div className=" text-gray-500 font-medium ">
                                    0.10
                                  </div>
                                  <div className=" flex items-center gap-2 ">
                                    <div className=" w-2 h-2 bg-gray-400 rounded-full mt-[2px] "></div>
                                    <div className=" flex items-center gap-1 text-sm ">
                                      <span>notes</span>
                                      <span>{lecture.pdfCount}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500">
                            No lectures yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className=" mt-[2rem] text-[1.2rem] font-medium text-[#5e5e5e] ">
              There are no module&apos;s yet
            </div>
          )}
        </div>

        <InstructorInfo />
      </div>
    </div>
  );
};

export default Page;



const InstructorInfo = () => {
  return (
    <div className={` w-full lg:max-w-[25rem] h-fit border rounded-lg p-[1rem] transition-all duration-300 ease-in-out `}>
      <h3 className=" text-[1.2rem] font-medium ">Instractors</h3>
      <div className=" text-sm text-[#4d4d4d] flex items-center gap-3 ">
        <div className=" flex items-center gap-1 ">
          <span>Instractor ratings</span>
          <IoInformationCircleSharp />
        </div>
        <div className=" flex items-center gap-1  ">
          <span>4.9</span>
          <IoIosStar className=" text-[#0400ff] " />
        </div>
        <span>(566 ratings)</span>
      </div>

      <div className=" mt-[1.5rem] flex items-center gap-3 ">
        <div>
          <Image
            src={MyImage}
            alt="My Image"
            className=" w-[3.5rem] h-[3.5rem] object-contain bg-[#0400ff]/5 rounded-full "
          />
        </div>
        <div>
          <div className=" font-medium ">Md Shahed</div>
          <div className=" text-[#4d4d4d] text-sm ">EduBridge</div>
          <div className=" text-xs flex items-center gap-3 text-[#4d4d4d] ">
            <span>35 Courses </span>
            <div className=" flex items-center gap-2 ">
              <div className=" h-2 w-2 rounded-full bg-gray-400 "></div>
              <span>54, 234, 234 Learners</span>
            </div>
          </div>
        </div>
      </div>

      <div className=" h-[2px] bg-[#9a9aa5] mt-[3rem] mb-[2rem] "></div>

      <div>
        <h4 className=" font-medium ">Offered By</h4>
        <div className=" mt-[1.5rem] flex items-center gap-3 ">
          <div className=" text-[#0400ff] text-[1.7rem] p-3 rounded-md bg-[#0400ff]/10 ">
            <PiStudentBold />
          </div>

          <div>
            <div className=" text-[1.1rem] font-medium ">EduBridge</div>
            <Link href={`#`} className=" text-[#0400ff] underline ">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
