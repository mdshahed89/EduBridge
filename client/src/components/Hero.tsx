import React from "react";
import HeroImg from "@/assets/HeroImg.png";

import Image from "next/image";
import Link from "next/link";
import { IoStarSharp } from "react-icons/io5";

const Hero = () => {
  return (
    <div className=" bg-[#fff] pt-[8rem]">
      <div className=" px-3 max-w-[1400px] mx-auto  ">
        <div className=" flex items-center gap-10 lg:flex-row flex-col  ">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="lg:text-left text-center text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-semibold leading-tight text-[#353535]">
              Take <span className="text-[#0400ff] italic">Control</span> of
              Your <span className="text-[#0400ff] italic">Learning</span>{" "}
              Journey
            </h1>
            <p className="lg:text-left text-center my-[1.5rem] md:my-[2rem]">
              Access expert-led courses, track your progress, and gain in-demand
              skills — all in one place. Whether you&apos;re growing your career
              or exploring new passions, our platform makes learning flexible,
              practical, and empowering.
            </p>

            <div className=" mb-[2rem] flex lg:justify-start justify-between ">
              <div className="border-r-2 pr-[1rem] lg:pr-[2rem] lg:text-left text-center ">
                <div className="text-[1.4rem] font-semibold">100+</div>
                <div className="font-medium text-[#383838]">
                  Expert-Led Courses
                </div>
              </div>
              <div className="border-r-2 px-[1rem] lg:px-[2rem] lg:text-left text-center ">
                <div className="text-[1.4rem] font-semibold">10K+</div>
                <div className="font-medium text-[#383838]">
                  Students Enrolled
                </div>
              </div>
              <div className=" pl-[1rem] lg:pl-[2rem] lg:text-left text-center ">
                <div className="text-[1.4rem] font-semibold">95%</div>
                <div className="font-medium text-[#383838]">
                  Satisfaction Rate
                </div>
              </div>
            </div>

            <div className=" flex items-center lg:justify-start justify-center gap-2 ">
              <Link
                href={`/courses`}
                className="bg-[#0400ff] px-8 py-2 border-2 border-[#0400ff] hover:bg-transparent hover:text-[#0400ff] rounded-md text-[#fff] shadow-inner transition-colors duration-300 ease-in-out "
              >
                Get Started
              </Link>
            </div>

            <div className=" flex items-center gap-2 lg:justify-start justify-center mt-[2rem] ">
              <div>
                <div className=" flex items-center gap-3 ">
                  <div className=" flex text-yellow-400 text-[1.3rem] ">
                    <IoStarSharp />
                    <IoStarSharp />
                    <IoStarSharp />
                    <IoStarSharp />
                    <IoStarSharp />
                  </div>
                  <span>5/5</span>
                </div>
                <div className=" text-sm font-medium text-[#252525] ">
                  Over 130+ Reviews
                </div>
              </div>
            </div>
          </div>
          <div className=" flex-1 ">
            <Image
              src={HeroImg}
              alt="Hero Img"
              className=" w-full h-full object-contain "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
