"use client";

import { useData } from "@/context/Context";
import { uploadFile } from "@/utils/imageUpload";
import { FetchLoading } from "@/utils/Loading";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { RiArrowGoBackFill } from "react-icons/ri";

interface FormDataType {
  thumbnail: string;
  title: string;
  description: string;
  price: string;
}

const Page = () => {
  const { userData } = useData();
  const { adminId, courseId } = useParams();
  const [formData, setFormData] = useState<FormDataType>({
    thumbnail: "",
    title: "",
    description: "",
    price: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [toastMessage, setToastMessage] = useState({
    type: "",
    message: "",
  });

  const router = useRouter();

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

      // setCourse(data.course);
      setFormData({
        title: data?.course?.title || "",
        thumbnail: data?.course?.thumbnail || "",
        description: data?.course?.description || "",
        price: data?.course?.price || "",
      });
      // setModules(data.modules);
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

  const handleSubmitUpdateCourse = async () => {
    if (!userData.token) {
      setToastMessage({
        type: "Error",
        message: "You are not authenticated to update course",
      });
      router.push("/admin-login");
    }

    if (
      !formData.thumbnail ||
      !formData.title ||
      !formData.description ||
      !formData.price
    ) {
      setToastMessage({
        type: "Error",
        message: "All Fields are required!!",
      });
      toast.error("");
      return;
    }

    // console.log("workinng");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/course/${courseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            price: Number(formData.price),
            description: formData.description,
            thumbnail: formData.thumbnail,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // throw new Error(data.message || "Course creation failed");
        toast.error(data.message || "Course update failed");
        return;
      }

      if (data?._id) {
        setToastMessage({
          type: "SUCCESS",
          message: "Course Updated successfully!!",
        });
        toast.success("Course updated successfully!!");
        setTimeout(() => {
          router.push(`/admin-panel/${adminId}/courses`);
        }, 2000);
      } else {
        setToastMessage({
          type: "Error",
          message: "Something Went Wrong!!",
        });
        toast.error("Something Went Wrong!!");
        return;
      }
      // Show success toast

      // console.log(data);
    } catch (error: unknown) {
      let message = "Failed to update course";

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

  if (loading) {
    return (
      <div className=" min-h-[20rem] relative ">
        <FetchLoading />
      </div>
    );
  }

  return (
    <div>
      <Link
        href={`/admin-panel/${adminId}/courses`}
        className=" flex items-center gap-1 text-[#0400ff] mb-[1rem] "
      >
        <RiArrowGoBackFill />
        <span>Back</span>
      </Link>
      <h3 className=" text-[1.2rem] ">Update Course</h3>

      {error && <p className=" text-sm text-red-500 mt-2 ">{error}</p>}

      <div className=" mt-10 ">
        <ImageUpload formData={formData} setFormData={setFormData} />

        <div className=" max-w-[30rem] mt-[2rem] space-y-3 ">
          <div className=" space-y-1 ">
            <label htmlFor="">Title*</label>
            <input
              type="text"
              placeholder="Enter Course Title"
              value={formData.title ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className=" bg-slate-50 border-2 border-slate-100 px-3 py-2 outline-none w-full rounded-md "
            />
          </div>
          <div className=" space-y-1 ">
            <label htmlFor="">Price*</label>
            <input
              type="number"
              placeholder="Enter Course Price"
              value={formData.price ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className=" bg-slate-50 border-2 border-slate-100 px-3 py-2 outline-none w-full rounded-md "
            />
          </div>
          <div className=" space-y-1 ">
            <label htmlFor="">Description*</label>
            <textarea
              placeholder="Enter Course Description"
              rows={5}
              value={formData.description ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className=" bg-slate-50 border-2 border-slate-100 px-3 py-2 outline-none w-full rounded-md custom-scrollbar "
            ></textarea>
          </div>

          {toastMessage.type && toastMessage.message && (
            <p
              className={`${
                toastMessage.type === "Error"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {toastMessage.message}
            </p>
          )}

          <div>
            <button
              onClick={handleSubmitUpdateCourse}
              className=" bg-[#0400ff] rounded-md py-2 text-center w-full text-[#fff] "
            >
              Update Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

interface DataProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const ImageUpload: React.FC<DataProps> = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    type: "",
    message: "",
  });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    const maxSize = 5 * 1024 * 1024;

    if (selectedFile) {
      if (selectedFile.size <= maxSize) {
        setToastMessage({
          type: "",
          message: "",
        });
        setLoading(true);

        try {
          const uploadedUrl = await uploadFile(selectedFile);
          if (uploadedUrl) {
            setFormData({
              ...formData,
              thumbnail: uploadedUrl,
            });
          } else {
            setToastMessage({
              type: "Error",
              message: "Failed to upload file to Cloudinary.",
            });
          }
        } catch (error) {
          console.error("Upload error:", error);

          setToastMessage({
            type: "Error",
            message: "An error occurred while uploading the file.",
          });
        } finally {
          setLoading(false);
        }
      } else {
        setToastMessage({
          type: "Error",
          message: "File size must be less than 5 MB.",
        });
      }
    }
  };

  return (
    <div className=" flex gap-10 lg:flex-row flex-col ">
      <div className=" max-w-[30rem] h-[20rem] w-full ">
        <div className=" relative border-2 border-[#0400ff] h-full rounded-lg overflow-hidden ">
          {loading && <FetchLoading />}
          {!loading && formData.thumbnail ? (
            <div>
              <div
                onClick={() => {
                  setFormData({
                    ...formData,
                    thumbnail: "",
                  });
                }}
                className={` ${
                  loading ? "hidden" : ""
                } cursor-pointer absolute right-3 top-3 p-2 z-40 shadow-inner bg-red-500 rounded-full text-[#fff] w-fit text-[1.5rem] `}
              >
                <FaXmark />
              </div>
              <div className=" w-full h-[20rem] relative ">
                <Image
                  src={formData.thumbnail}
                  alt="Course Thumbnail"
                  fill
                  className=" w-full h-full object-cover  "
                />
              </div>
            </div>
          ) : (
            <div className="mt-2 p-4 rounded-md text-center h-full cursor-pointer">
              <div
                onClick={() =>
                  document.getElementById("profileImgClick")?.click()
                }
                className=" h-full flex flex-col items-center justify-center gap-2"
              >
                <FaCloudUploadAlt className="text-[2.5rem] text-[#000000cc]" />
                <p className="text-[#000] font-semibold ">
                  Click to upload photo
                </p>
                <p className="text-[0.75rem] text-gray-700">
                  Supported formats: JPG, PNG, WEBP
                </p>
                <p className="text-[0.75rem] text-gray-700">Max size: 2MB</p>
                <input
                  id="profileImgClick"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          )}
        </div>

        {toastMessage.type && toastMessage.message && (
          <p
            className={` mt-1 ${
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
