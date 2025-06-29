"use client";

import { useData } from "@/context/Context";
import { FetchLoading } from "@/utils/Loading";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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

const Courses = () => {
  const { userData } = useData();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const fetchCourses = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/course`
      );

      const data = await res.json();

      if (!res.ok) {
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
    fetchCourses();
  }, [userData]);

  if (error) {
    return (
      <div className=" max-w-[1400px] mx-auto text-center h-[10rem] flex items-center justify-center ">
        {error}
      </div>
    );
  }

  return (
    <div className=" max-w-[1400px] px-3 mx-auto pt-[6rem] ">
      <div className="text-center mb-[4rem] ">
        <div className=" bg-[#0400ff]/5 px-3 py-1 rounded-md w-fit mx-auto shadow-inner ">
          Feature Courses
        </div>
        <h2 className=" text-[1.5rem] md:text-[2rem] font-medium my-3">
          Explore Courses Trusted by Thousands Worldwide
        </h2>
        <p className="max-w-[35rem] mx-auto text-[#2c2c2c]">
          Browse a wide range of expert-led courses designed to help you
          upskill, switch careers, or deepen your knowledge. Whether you&apos;re
          just starting out or looking to grow, there&apos;s something here for
          everyone.
        </p>
      </div>

      <div className=" flex justify-end ">
        <Link href={`/courses`} className=" text-[#0400ff] underline ">
          View All Courses
        </Link>
      </div>

      {loading ? (
        <div className=" relative min-h-[20rem] ">
          <FetchLoading />
        </div>
      ) : (
        <div className="mt-[2rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {courses.slice(0, 4).map((course, idx) => (
            <div
              key={idx}
              className="w-full rounded-lg overflow-hidden border bg-white flex flex-col relative"
            >
              <div className="w-full h-[15rem] relative">
                <Image
                  src={course.thumbnail}
                  alt="course thumbnail"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col justify-between h-full px-2 py-2 bg-gray-50 flex-1">
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
                  href={`/courses/${course._id}`}
                  className="mt-4 bg-[#0400ff] py-2 w-full block text-center rounded-md text-white active:scale-95 transition-all duration-300 ease-in-out"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
