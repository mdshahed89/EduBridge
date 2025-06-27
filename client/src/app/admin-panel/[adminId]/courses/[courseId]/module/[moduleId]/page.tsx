"use client";

import { useData } from "@/context/Context";
import { uploadFile, uploadPdf, uploadVideo } from "@/utils/imageUpload";
import { FetchLoading } from "@/utils/Loading";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEdit, AiTwotoneDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaFilePdf, FaPlay, FaPlus, FaVideo, FaXmark } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { RiArrowGoBackFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";

interface Lecture {
  _id: string;
  title: string;
  videoUrl: string;
  pdfNotes: string[];
  module: string;
}

interface LectureFormData {
  title: string;
  videoUrl: string;
  pdfNotes: string[];
}

const Page = () => {
  const { adminId, courseId, moduleId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploadType, setUploadType] = useState<"file" | "link">("file");
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [durations, setDurations] = useState<{ [key: string]: string }>({});
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<LectureFormData>({
    title: "",
    videoUrl: "",
    pdfNotes: [],
  });
  const { userData } = useData();
  const [toastMessage, setToastMessage] = useState({
    type: "",
    message: "",
  });

  const fetchLectures = async () => {
    if (!userData.token) {
      setError("Unauthorized: No token found");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/lecture/${moduleId}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch lectures");
      }

      setLectures(data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (moduleId) {
      fetchLectures();
    }
  }, [moduleId]);

  const handleSubmitCreateLecture = async () => {
    if (!userData.token) {
      setToastMessage({
        type: "Error",
        message: "Unauthorized: No token found",
      });
      return;
    }

    if (!formData.title || !formData.videoUrl) {
      setToastMessage({
        type: "Error",
        message: "Title and Video URL are required.",
      });
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/lecture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            videoUrl: formData.videoUrl,
            pdfNotes: formData.pdfNotes || [],
            moduleId: moduleId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setToastMessage({
          type: "Error",
          message: data.message || "Failed to create lecture",
        });
        return;
      }

      console.log("Lecture created successfully:", data);
      fetchLectures();
      setShowModal(false);
      setFormData({
        title: "",
        videoUrl: "",
        pdfNotes: [],
      });
    } catch (err: any) {
      console.error("Error creating lecture:", err.message);
      setToastMessage({
        type: "Error",
        message: err.message || "Something went wrong",
      });
    }
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

  const filteredLectures = lectures.filter((lecture) =>
    lecture.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // console.log(lectures);

  return (
    <div className=" ">
      <div className=" mb-[2rem] flex items-center justify-between ">
        <Link
          href={`/admin-panel/${adminId}/courses/${courseId}`}
          className=" flex items-center gap-1 text-[#0400ff] "
        >
          <RiArrowGoBackFill />
          <span>Back</span>
        </Link>
        <Link
          href={`/admin-panel/${adminId}/courses`}
          className="  text-[#0400ff] underline "
        >
          All Courses
        </Link>
      </div>
      <div className=" flex items-center justify-between ">
        <h3 className=" text-[1.3rem] ">All Lectures</h3>
      </div>

      <div className=" min-h-[20rem] mt-[2rem] border p-[1rem] rounded-lg ">
        <div className=" my-3 flex justify-between gap-4 ">
          <div className=" w-full md:w-[40%] relative flex items-center gap-6  ">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lecture by title..."
              className=" w-full outline-none border-none py-2 pl-4 pr-[3rem] bg-[#F6F6FB] rounded-md "
            />
            <div className=" absolute top-0 right-0 px-4 h-full flex items-center  ">
              <FiSearch className=" text-[#A6ABC8] text-[1.2rem] " />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              onClick={() => setShowModal(true)}
              className="md:hidden cursor-pointer bg-[#0400ff] p-3 rounded-full text-white text-lg shadow"
            >
              <FaPlus />
            </div>

            <div
              onClick={() => setShowModal(true)}
              className="hidden md:inline-block cursor-pointer bg-[#0400ff] px-5 py-2 rounded-md text-white active:scale-95 transition-all duration-300 ease-in-out"
            >
              Add New Lecture
            </div>
          </div>
        </div>

        <div className=" mt-[1rem] ">
          {filteredLectures.map((lecture, idx) => (
            <div
              key={idx}
              className={` flex items-center justify-between gap-2  py-3 px-2  transition-colors duration-300 ease-in-out ${
                lectures.length !== idx + 1 && "border-b"
              } `}
            >
              <div
                onClick={() => {
                  setSelectedLecture(lecture);
                  setShowDetailsModal(true);
                }}
                className=" flex items-center gap-2 group transition-all duration-300 ease-in-out cursor-pointer "
              >
                <div className=" p-3 rounded-full text-[#0400ff] text-[1.4rem] bg-[#0400ff]/5 group-hover:bg-[#0400ff]/10 ">
                  <FaPlay />
                </div>
                <div>
                  <div className=" group-hover:text-[#0400ff] group-hover:underline ">
                    {lecture.title}
                  </div>
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
              </div>

              <div className=" flex items-center gap-2 text-[1.7rem] ">
                <div
                  onClick={() => {
                    setSelectedLecture(lecture);
                    setShowEditModal(true);
                  }}
                  className=" cursor-pointer text-[#0400ff] p-2 rounded-full hover:bg-[#0400ff]/5 "
                >
                  <CiEdit />
                </div>
                <div
                  onClick={() => {
                    setSelectedLecture(lecture);
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
      </div>

      {showEditModal && selectedLecture && (
        <LectureEditModal
          setShowEditModal={setShowEditModal}
          selectedLecture={selectedLecture}
          moduleId={moduleId as string}
          fetchLectures={fetchLectures}
        />
      )}

      {showDeleteModal && selectedLecture && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center"
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedLecture(null);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-lg w-[90%] max-w-sm text-center"
          >
            <h2 className="text-lg font-semibold mb-4">Delete Lecture</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this lecture?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedLecture(null);
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
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/lecture/${selectedLecture._id}`,
                      {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${userData.token}`,
                        },
                      }
                    );
                    if (!res.ok) throw new Error("Delete failed");
                    toast.success("Lecture deleted", { id: toastId });
                    setShowDeleteModal(false);
                    setSelectedLecture(null);
                    fetchLectures();
                  } catch (err) {
                    toast.error("Failed to delete lecture", { id: toastId });
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

      {showDetailsModal && selectedLecture && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center"
          onClick={() => {
            setShowDetailsModal(false);
            setSelectedLecture(null);
          }}
        >
          <div
            className="bg-white px-4 pt-9 pb-4 rounded-md overflow-hidden w-[90%] max-w-2xl relative "
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-0 right-0 text-xl p-1 hover:bg-red-500 hover:text-[#fff] transition-colors duration-300 ease-in-out "
              onClick={() => {
                setShowDetailsModal(false);
                setSelectedLecture(null);
              }}
            >
              <RxCross2 />
            </button>

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
                className="w-full h-[20rem] rounded"
              />
            )}

            {/* PDF Notes */}
            {selectedLecture.pdfNotes &&
              selectedLecture.pdfNotes.length > 0 && (
                <div className="mt-4 space-y-2">
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
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center"
          onClick={() => setShowModal(false)} // click outside closes modal
        >
          <div
            className="bg-white rounded-md p-6 w-[90%] max-w-md relative"
            onClick={(e) => e.stopPropagation()} // prevent click inside from closing
          >
            <h2 className="text-lg font-semibold mb-4">Add New Lecture</h2>

            <div className=" space-y-3 ">
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                placeholder="Lecture Title"
                className="w-full px-3 py-2 border outline-none rounded-md mb-4"
              />
              {/* <VideoUpload formData={formData} setFormData={setFormData} /> */}
              <div>
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => {
                      setFormData({
                        ...formData,
                        videoUrl: "",
                      });
                      setUploadType("file");
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      uploadType === "file"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    File
                  </button>
                  <button
                    onClick={() => {
                      setFormData({
                        ...formData,
                        videoUrl: "",
                      });
                      setUploadType("link");
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      uploadType === "link"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    Source Link
                  </button>
                </div>

                {/* Conditional Content */}
                {uploadType === "file" ? (
                  <VideoUpload formData={formData} setFormData={setFormData} />
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Enter video source URL"
                      value={formData.videoUrl || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, videoUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 border outline-none rounded-md"
                    />
                  </div>
                )}
              </div>

              {/* Title field */}

              <MultiPdfUpload formData={formData} setFormData={setFormData} />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-[1rem] ">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitCreateLecture}
                className="px-4 py-2 bg-[#0400ff] text-white rounded-md"
              >
                Submit
              </button>
            </div>
            {toastMessage.type && toastMessage.message && (
              <p
                className={` ${
                  toastMessage.type === "Error"
                    ? "text-red-500"
                    : "text-green-500"
                } `}
              >
                {toastMessage.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

interface Props {
  formData: any;
  setFormData: (value: any) => void;
}

interface LectureEditModalProps {
  setShowEditModal: (value: boolean) => void;
  selectedLecture: Lecture;
  moduleId: string;
  fetchLectures: () => Promise<void>;
}

const LectureEditModal: React.FC<LectureEditModalProps> = ({
  setShowEditModal,
  selectedLecture,
  moduleId,
  fetchLectures,
}) => {
  const { userData } = useData();
  const [uploadType, setUploadType] = useState<"file" | "link">("file");
  const [toastMessage, setToastMessage] = useState({
    type: "",
    message: "",
  });
  const [formData, setFormData] = useState({
    title: selectedLecture.title,
    videoUrl: selectedLecture.videoUrl,
    pdfNotes: selectedLecture.pdfNotes,
  });

  const handleSubmitUpdateLecture = async () => {
    if (!selectedLecture._id) {
      setToastMessage({
        type: "Error",
        message: "Something went wrong",
      });
      return;
    }

    if (!userData.token) {
      setToastMessage({
        type: "Error",
        message: "Unauthorized: No token found",
      });
      return;
    }

    if (!formData.title || !formData.videoUrl) {
      setToastMessage({
        type: "Error",
        message: "Title and Video URL are required.",
      });
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/lecture/${selectedLecture._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            videoUrl: formData.videoUrl,
            pdfNotes: formData.pdfNotes || [],
            moduleId: moduleId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setToastMessage({
          type: "Error",
          message: data.message || "Failed to create lecture",
        });
        return;
      }

      console.log("Lecture created successfully:", data);
      toast.success("Lecture Updated Successfully!!");
      fetchLectures();
      setShowEditModal(false);
    } catch (err: any) {
      console.error("Error creating lecture:", err.message);
      setToastMessage({
        type: "Error",
        message: err.message || "Something went wrong",
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center"
      onClick={() => {
        setShowEditModal(false);
        setFormData({
          title: "",
          videoUrl: "",
          pdfNotes: [],
        });
      }}
    >
      <div
        className="bg-white rounded-md p-6 w-[90%] max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Edit Lecture</h2>

        <div className=" space-y-3 ">
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
            placeholder="Lecture Title"
            className="w-full px-3 py-2 border outline-none rounded-md mb-4"
          />
          {/* <VideoUpload formData={formData} setFormData={setFormData} /> */}
          <div>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => {
                  setFormData({
                    ...formData,
                    videoUrl: "",
                  });
                  setUploadType("file");
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  uploadType === "file"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                File
              </button>
              <button
                onClick={() => {
                  setFormData({
                    ...formData,
                    videoUrl: "",
                  });
                  setUploadType("link");
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  uploadType === "link"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Source Link
              </button>
            </div>

            {/* Conditional Content */}
            {uploadType === "file" ? (
              <VideoUpload formData={formData} setFormData={setFormData} />
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Enter video source URL"
                  value={formData.videoUrl || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 border outline-none rounded-md"
                />
              </div>
            )}
          </div>

          {/* Title field */}

          <MultiPdfUpload formData={formData} setFormData={setFormData} />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-[1rem] ">
          <button
            onClick={() => {
              setShowEditModal(false);
              setFormData({
                title: "",
                videoUrl: "",
                pdfNotes: [],
              });
            }}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitUpdateLecture}
            className="px-4 py-2 bg-[#0400ff] text-white rounded-md"
          >
            Submit
          </button>
        </div>
        {toastMessage.type && toastMessage.message && (
          <p
            className={` ${
              toastMessage.type === "Error" ? "text-red-500" : "text-green-500"
            } `}
          >
            {toastMessage.message}
          </p>
        )}
      </div>
    </div>
  );
};

const MultiPdfUpload: React.FC<Props> = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    type: "",
    message: "",
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      return setToastMessage({
        type: "Error",
        message: "Only PDF files are allowed.",
      });
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return setToastMessage({
        type: "Error",
        message: "PDF must be under 10MB.",
      });
    }

    setLoading(true);
    setToastMessage({ type: "", message: "" });

    try {
      const url = await uploadPdf(file);
      if (url) {
        const updated = [...(formData.pdfNotes || []), url];
        setFormData({ ...formData, pdfNotes: updated });
      } else {
        setToastMessage({ type: "Error", message: "Failed to upload PDF." });
      }
    } catch (err) {
      setToastMessage({ type: "Error", message: "Upload failed." });
    } finally {
      setLoading(false);
    }
  };

  const removePdf = (index: number) => {
    const updated = formData.pdfNotes.filter(
      (_: string, i: number) => i !== index
    );
    setFormData({ ...formData, pdfNotes: updated });
  };

  // console.log(formData);

  return (
    <div className="w-full">
      <div className="space-y-2">
        {/* Upload Button */}
        <div
          onClick={() => document.getElementById("pdfInput")?.click()}
          className="relative border-dashed border-2 border-[#0400ff] flex flex-col items-center justify-center h-28 rounded-md cursor-pointer"
        >
          {loading ? (
            <FetchLoading />
          ) : (
            <>
              <FaCloudUploadAlt className="text-xl text-[#000000cc]" />
              <p className="text-xs text-gray-600">Upload PDF</p>
            </>
          )}
          <input
            id="pdfInput"
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </div>

      <div className=" grid grid-cols-2 gap-2 ">
        {(formData.pdfNotes || []).map((pdf: string, index: number) => (
          <div
            key={index}
            className=" mt-2 flex items-center justify-between px-3 py-2 border rounded-md bg-gray-50"
          >
            <a
              href={pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 text-sm"
            >
              <FaFilePdf className="text-red-500 text-lg" />
              {`PDF ${index + 1}`}
            </a>
            <button
              onClick={() => removePdf(index)}
              className="text-red-600 text-lg p-1"
            >
              <FaXmark />
            </button>
          </div>
        ))}
      </div>

      {/* Toast Message */}
      {toastMessage.message && (
        <p
          className={`mt-2 text-sm ${
            toastMessage.type === "Error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {toastMessage.message}
        </p>
      )}
    </div>
  );
};

const VideoUpload: React.FC<Props> = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    type: "",
    message: "",
  });

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 20 * 1024 * 1024; // 20MB max

    if (file.size > maxSize) {
      setToastMessage({
        type: "Error",
        message: "Video must be under 20MB.",
      });
      return;
    }

    setLoading(true);
    setToastMessage({ type: "", message: "" });

    try {
      const uploadedUrl = await uploadVideo(file);
      if (uploadedUrl) {
        setFormData({ ...formData, videoUrl: uploadedUrl });
      } else {
        setToastMessage({
          type: "Error",
          message: "Video upload failed.",
        });
      }
    } catch (err) {
      setToastMessage({
        type: "Error",
        message: "An error occurred while uploading.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full">
      <div className="relative border-2 border-[#909099] h-[10rem] rounded-md overflow-hidden">
        {loading && <FetchLoading />}
        {!loading && formData.videoUrl ? (
          <div className="relative w-full h-full bg-black">
            <div
              onClick={() => setFormData({ ...formData, videoUrl: "" })}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full cursor-pointer z-10"
            >
              <FaXmark />
            </div>
            <video
              src={formData.videoUrl}
              className="w-full h-full object-cover"
              controls
            />
          </div>
        ) : (
          <div
            className="h-full flex flex-col justify-center items-center cursor-pointer"
            onClick={() => document.getElementById("videoInput")?.click()}
          >
            <FaVideo className="text-2xl text-[#000000cc]" />
            <p className="text-sm font-medium text-black">
              Click to upload video
            </p>
            <p className="text-xs text-gray-600">Max size: 20MB</p>
            <input
              id="videoInput"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoUpload}
            />
          </div>
        )}
      </div>

      {toastMessage.message && (
        <p
          className={`mt-1 text-sm ${
            toastMessage.type === "Error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {toastMessage.message}
        </p>
      )}
    </div>
  );
};
