"use client";

import { useData } from "@/context/Context";
import { FetchLoading } from "@/utils/Loading";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlay } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { IoIosArrowDown, IoMdPause } from "react-icons/io";
import { RiArrowGoBackFill } from "react-icons/ri";
import { useDebounce } from "use-debounce";

interface Course {
  _id: string;
  title: string;
  price: number;
  description: string;
  thumbnail: string;
}

interface Lecture {
  _id: string;
  title: string;
  videoUrl: string;
  pdfNotes: [];
}

interface Module {
  _id: string;
  title: string;
  moduleNumber: number;
  course: string;
  lectures: Lecture[];
}

interface EnrolledLecture {
  lecture: string;
  completed: boolean;
}

interface EnrolledCourse {
  course: string;
  progress: EnrolledLecture[];
}

const Page = () => {
  const searchParams = useSearchParams();
  const lectureIdx = searchParams.get("lecture");
  const moduleIdx = searchParams.get("module");
  const { courseId, userId } = useParams() as {
    courseId: string;
    userId: string;
  };
  const router = useRouter();
  const { userData } = useData();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);
  const [durations, setDurations] = useState<{ [key: string]: string }>({});
  const [toastMessage, setToastMessage] = useState({
    type: "",
    message: "",
  });
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [isOpenModules, setIsOpenModules] = useState(false);

  useEffect(() => {
    const moduleIndex = Number(moduleIdx);
    const lectureIndex = Number(lectureIdx);

    if (
      !isNaN(moduleIndex) &&
      !isNaN(lectureIndex) &&
      modules?.length > 0 &&
      moduleIndex < modules.length
    ) {
      const selectedModule = modules[moduleIndex];

      if (
        selectedModule &&
        selectedModule.lectures &&
        lectureIndex >= 0 &&
        lectureIndex < selectedModule.lectures.length
      ) {
        setSelectedLecture(selectedModule.lectures[lectureIndex]);
      } else {
        setSelectedLecture(null);
      }
    } else {
      setSelectedLecture(null);
    }
  }, [moduleIdx, lectureIdx, modules]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/user/enrolled-course/modules-with-lectures/${courseId}?search=${encodeURIComponent(
          debouncedSearchQuery
        )}`,
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

      setCourse(data?.course || null);
      setModules(data?.moduleWithLectures || []);
      setSelectedLecture(data?.moduleWithLectures[0]?.lectures[0]);
      setEnrolledCourses(data?.enrolledCourses || []);
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
  }, [courseId, debouncedSearchQuery]);

  const toggleModule = (id: string) => {
    setOpenModuleId((prev) => (prev === id ? null : id));
  };

  const isYouTube = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/
    );
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : "";
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleLoadedMetadata = (
    e: React.SyntheticEvent<HTMLVideoElement>,
    id: string
  ) => {
    const videoDuration = e.currentTarget.duration;
    setDurations((prev) => ({
      ...prev,
      [id]: formatDuration(videoDuration),
    }));
  };

  const handleCompleteLecture = async () => {
    if (!userData.token) {
      setToastMessage({
        type: "Error",
        message: "Something went wrong",
      });
      router.push("/login");
    }

    if (!selectedLecture?._id || !courseId) {
      setToastMessage({
        type: "Error",
        message: "Something went wrong",
      });
      toast.error("Something went wrong!!");
      return;
    }

    const isAlreadyCompleted = (userData.enrolledCourses as any[])?.some(
      (courseEntry: any) => {
        return (
          courseEntry.course === courseId &&
          courseEntry.progress?.some(
            (progressItem: any) =>
              progressItem.lecture === selectedLecture._id &&
              progressItem.completed
          )
        );
      }
    );

    if (isAlreadyCompleted) {
      console.log("Lecture already completed — skipping API call.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/complete-lecture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify({
            lectureId: selectedLecture?._id,
            courseId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      console.log("Lecture Completed Successfully");
    } catch (error: any) {
      console.error("Error:", error.message);
      setToastMessage({
        type: "ERROR",
        message: error.message || "Something went wrong!!",
      });
      toast.error("Something went wrong!!");
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
    <div>
      <div className=" flex items-center gap-2 ">
        <Link
          href={`/dashboard/${userId}/enrolled-courses`}
          className=" flex items-center gap-1 text-[#0400ff] "
        >
          <RiArrowGoBackFill />
          <span>Back</span>
        </Link>
        <div className=" text-[1.5rem] font-medium leading-tight flex items-center justify-between gap-3 w-full ">
          <h3 className=" line-clamp-1 ">{course?.title}</h3>
          <div
            onClick={() => setIsOpenModules(true)}
            className=" lg:hidden flex "
          >
            <HiMiniBars3BottomRight />
          </div>
        </div>
      </div>

      <div className=" mt-[2rem] flex gap-5 ">
        {selectedLecture?.videoUrl ? (
          <div className=" w-full relative ">
            <div className=" absolute top-4 left-4 text-[1.3rem] font-medium text-[#9a98e6] ">
              {selectedLecture.title}
            </div>
            {isYouTube(selectedLecture.videoUrl) ? (
              <iframe
                src={getYouTubeEmbedUrl(selectedLecture.videoUrl)}
                className="w-full h-[20rem] rounded"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                src={selectedLecture.videoUrl}
                controls
                className="w-full h-[20rem] md:h-[30rem] xl:h-[35rem] 2xl:h-[40rem] rounded-md overflow-hidden "
              />
            )}
            <div className=" flex items-center gap-3 justify-end py-[1rem] px-[1rem] ">
              {Number(lectureIdx) !== 0 && (
                <Link
                  href={`/dashboard/${userId}/enrolled-courses/${courseId}?module=${Number(
                    moduleIdx
                  )}&lecture=${
                    Number(lectureIdx) !== 0
                      ? Number(lectureIdx) - 1
                      : lectureIdx
                  }`}
                  className=" bg-gradient-to-r from-[#0400ff] to-[#5957af] w-[7rem] py-2 rounded-md text-[#fff] text-center font-medium "
                >
                  Previous
                </Link>
              )}
              {/* {modules[Number(moduleIdx)].lectures.length - 1 !==
                Number(lectureIdx) && ( */}
              <Link
                onClick={handleCompleteLecture}
                href={`/dashboard/${userId}/enrolled-courses/${courseId}?module=${Number(
                  moduleIdx
                )}&lecture=${
                  modules[Number(moduleIdx)].lectures.length - 1 >
                  Number(lectureIdx)
                    ? Number(lectureIdx) + 1
                    : lectureIdx
                }`}
                className=" bg-gradient-to-r from-[#5957af] to-[#0400ff] w-[7rem] py-2 rounded-md text-[#fff] text-center font-medium "
              >
                Next
              </Link>
              {/* )} */}
            </div>
            {selectedLecture.pdfNotes &&
              selectedLecture.pdfNotes.length > 0 && (
                <div className=" space-y-2">
                  <h4 className="text-sm font-semibold">PDF Notes</h4>
                  {selectedLecture.pdfNotes.map((pdf: string, idx: number) => (
                    <a
                      key={idx}
                      href={pdf}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-blue-600 underline hover:text-blue-800"
                    >
                      Download Note {idx + 1}
                    </a>
                  ))}
                </div>
              )}
          </div>
        ) : (
          <div className=" w-full flex items-center justify-center text-[1.2rem] font-medium ">
            There are no lecture
          </div>
        )}

        <div
          className={` ${
            isOpenModules
              ? "translate-x-0"
              : "lg:translate-x-0 translate-x-full"
          } lg:relative fixed lg:bg-transparent bg-[#fff] top-0 right-0 w-full md:w-[25rem] lg:h-auto h-full lg:w-[35rem] min-h-[20rem] border px-[1rem] lg:pt-[1rem] pb-[1rem]  rounded-lg transition-all duration-300 ease-in-out `}
        >
          <div
            onClick={() => setIsOpenModules(false)}
            className=" lg:hidden flex text-[1.5rem] pt-[6rem] pb-[2rem] "
          >
            <HiMiniBars3BottomRight />
          </div>

          <div className=" mb-[1rem] flex items-center justify-between gap-5 ">
            <div className=" text-[1.1rem] text-[#0400ff] text-nowrap ">
              Running Module: {modules[Number(moduleIdx)].moduleNumber}
            </div>
            <ModuleProgress
              setToastMessage={setToastMessage}
              courseId={courseId}
            />
          </div>

          <div className=" my-3 flex justify-between gap-4 ">
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
              {modules.map((module, idx) => {
                const isOpen = openModuleId === module._id;

                return (
                  <div key={module._id} className="border-b">
                    {/* Module header */}
                    <div
                      onClick={() => toggleModule(module._id)}
                      className="flex items-center justify-between py-2 px-[.5rem] md:px-[1rem] rounded-t-md hover:bg-gray-50 transition-colors duration-300 ease-in-out cursor-pointer"
                    >
                      <div className="group transition-all duration-300 ease-in-out">
                        <div className="text-[#757575]">
                          Module {module.moduleNumber}
                        </div>
                        <div
                          className={` ${
                            Number(moduleIdx) === idx && "text-[#0400ff]"
                          } line-clamp-1 text-[1.1rem] md:text-[1.3rem] font-medium `}
                        >
                          {module.title}
                        </div>
                      </div>
                      <div
                        className={`text-[1.4rem] transform transition-transform duration-300 ${
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
                          module.lectures.map((lecture, lcx) => (
                            <Link
                              href={`/dashboard/${userId}/enrolled-courses/${courseId}?module=${idx}&lecture=${lcx}`}
                              key={lecture._id}
                              className=" cursor-pointer hover:bg-gray-100 flex items-center justify-between gap-2 group transition-all duration-300 ease-in-out bg-slate-50 pl-1 py-1 pr-2 rounded-md "
                            >
                              <div className=" flex items-center gap-2 ">
                                <div className=" p-2 rounded-full text-[#0400ff] text-[1.3rem] bg-[#0400ff]/5 group-hover:bg-[#0400ff]/10 ">
                                  {Number(moduleIdx) === idx &&
                                  Number(lectureIdx) === lcx ? (
                                    <IoMdPause />
                                  ) : (
                                    <FaPlay />
                                  )}
                                </div>
                                <div>
                                  <div
                                    className={` ${
                                      Number(moduleIdx) === idx &&
                                      Number(lectureIdx) === lcx &&
                                      "text-[#0400ff]"
                                    } `}
                                  >
                                    {lecture.title}
                                  </div>

                                  <div className=" flex items-center gap-3 text-sm ">
                                    <div className=" text-gray-500 font-medium ">
                                      {durations[lecture._id] && (
                                        <div className="text-xs text-gray-500">
                                          {durations[lecture._id]}
                                        </div>
                                      )}
                                      <video
                                        src={lecture.videoUrl}
                                        onLoadedMetadata={(e) =>
                                          handleLoadedMetadata(e, lecture._id)
                                        }
                                        className="hidden"
                                      />
                                    </div>
                                    <div className=" flex items-center gap-2 ">
                                      <div className=" w-2 h-2 bg-gray-400 rounded-full mt-[2px] "></div>
                                      <div className=" flex items-center gap-1 text-sm ">
                                        <span>notes</span>
                                        <span>{lecture.pdfNotes.length}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {enrolledCourses?.some(
                                (courseEntry) =>
                                  courseEntry.course === courseId &&
                                  courseEntry.progress?.some(
                                    (p) =>
                                      p.lecture === lecture._id && p.completed
                                  )
                              ) && (
                                <GiCheckMark className="text-green-600 text-lg" />
                              )}
                            </Link>
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
              There are no module's yet
            </div>
          )}
        </div>
      </div>

      {toastMessage.type === "Error" && (
        <p className=" text-sm mt-2 text-red-500 ">{toastMessage.message}</p>
      )}
    </div>
  );
};

export default Page;

type ToastMessage = {
  type: string;
  message: string;
};

type ModuleProgressProps = {
  setToastMessage: (msg: ToastMessage) => void;
  courseId?: string;
};

const ModuleProgress: React.FC<ModuleProgressProps> = ({
  setToastMessage,
  courseId,
}) => {
  const { userData } = useData();
  const router = useRouter();

  const [totalModule, setTotalModule] = useState<number>(0);
  const [completedModule, setCompletedModule] = useState<number>(0);

  const handleGetModuleProgress = async () => {
    if (!userData.token) {
      setToastMessage({
        type: "Error",
        message: "User not authenticated",
      });
      router.push("/login");
      return;
    }

    if (!courseId) {
      setToastMessage({
        type: "Error",
        message: "Course ID is missing",
      });
      toast.error("Something went wrong!!");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/progress/${courseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      setTotalModule(data?.totalModules || 0);
      setCompletedModule(data?.completedModules || 0);
      console.log("Module progress fetched successfully!!");
    } catch (error: any) {
      console.error("Error:", error.message);
      setToastMessage({
        type: "ERROR",
        message: error.message || "Something went wrong!!",
      });
    }
  };

  useEffect(() => {
    handleGetModuleProgress();
  }, []);

  const progressPercentage =
    totalModule > 0 ? (completedModule / totalModule) * 100 : 0;

  return (
    <div className="bg-white rounded-lg w-full max-w-xl">
      <div className="flex items-center justify-between">
        <div className="relative w-full h-2 bg-[#0400ff]/20 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#0400ff] to-[#615fdd] transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <span className="ml-2 text-sm font-medium text-gray-700">
          {completedModule}/{totalModule}
        </span>
      </div>
    </div>
  );
};
