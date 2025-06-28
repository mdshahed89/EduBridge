"use client";

import React from "react";
import Slider from "react-slick";
import HeroIcon1 from "@/assets/HeroIcon1.jpg";
import HeroIcon2 from "@/assets/HeroIcon2.jpg";
import HeroIcon3 from "@/assets/HeroIcon3.jpeg";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import Image from "next/image";

type ArrowProps = React.HTMLAttributes<HTMLDivElement>;

const Review = () => {
  const SampleNextArrow = ({ onClick }: ArrowProps) => (
    <div
      onClick={onClick}
      className="absolute top-0 right-0 h-full w-[50px] z-10 flex items-center justify-center cursor-pointer"
    >
      <div className="h-[50px] w-[40px] bg-[#0400ff] flex items-center justify-center rounded-md">
        <MdOutlineKeyboardArrowRight className="text-white text-[2rem]" />
      </div>
    </div>
  );

  const SamplePrevArrow = ({ onClick }: ArrowProps) => (
    <div
      onClick={onClick}
      className="absolute top-0 left-0 h-full w-[50px] z-10 flex items-center justify-center cursor-pointer"
    >
      <div className="h-[50px] w-[40px] bg-[#0400ff] flex items-center justify-center rounded-md">
        <MdOutlineKeyboardArrowLeft className="text-white text-[2rem]" />
      </div>
    </div>
  );

  const reviews = [
    {
      img: HeroIcon1,
      name: "Sarah Jensen",
      designation: "Marketing Manager, Startup Norway",
      message:
        "This platform helped me upskill quickly in digital marketing. The courses are practical, well-structured, and taught by industry professionals.",
    },
    {
      img: HeroIcon2,
      name: "James Patel",
      designation: "Freelance UI/UX Designer",
      message:
        "I've taken several design courses here, and each one has boosted my skills and confidence. I've even landed better freelance gigs because of what I've learned.",
    },
    {
      img: HeroIcon3,
      name: "Amina Khalid",
      designation: "Finance Consultant, Oslo Finance Group",
      message:
        "I recommend this LMS to clients and peers alike. It's an incredible resource for learning in-demand skills with flexible access and expert instructors.",
    },
    {
      img: HeroIcon1,
      name: "Lars Mikkelsen",
      designation: "Software Engineer, Freelance",
      message:
        "The development courses are top-notch. I could learn at my own pace and apply what I learned directly to client projects. Great value!",
    },
    {
      img: HeroIcon2,
      name: "Emily Nguyen",
      designation: "Small Business Owner",
      message:
        "From marketing to finance, I've learned everything I need to grow my business online. The real-world case studies and projects make learning effective.",
    },
    {
      img: HeroIcon3,
      name: "Mohammed Al-Fayed",
      designation: "Digital Nomad & Blogger",
      message:
        "I'm always on the move, and this platform fits my lifestyle perfectly. High-quality courses, mobile-friendly, and I can learn from anywhere.",
    },
  ];

  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    cssEase: "linear",
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="max-w-[1400px] mx-auto px-3 mt-[5rem] ">
      <div className=" text-center ">
        <div className=" bg-[#0400ff]/5 px-3 py-1 rounded-md w-fit mx-auto shadow-inner ">
          Testimonials
        </div>
        <h2 className=" text-[1.5rem] md:text-[2rem] font-medium my-3 ">
          Trusted by Students and Industry Professionals
        </h2>
        <p className=" max-w-[35rem] mx-auto text-[#2c2c2c] ">
          Discover how our platform is helping learners gain new skills, achieve
          career goals, and grow with expert-led courses.
        </p>
      </div>
      <div className="slider-container overflow-hidden mt-[4rem] pb-[3rem] relative">
        <Slider {...settings}>
          {reviews.map((review, idx) => (
            <div key={idx} className=" mb-10 ">
              <div className=" p-1 bg-[#5A6ACF] rounded-full w-fit mx-auto ">
                <Image
                  src={review.img}
                  alt="Review img"
                  className=" w-[8rem] h-[8rem] rounded-full object-cover "
                />
              </div>
              <div className=" text-center mt-2 ">
                <div className=" text-[1.2rem] font-medium ">{review.name}</div>
                <div className=" text-[#3c3c3c] ">{review.designation}</div>
              </div>
              <p className=" mt-[2rem] text-base md:text-lg text-center max-w-[35rem] mx-auto ">
                {review.message}
              </p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Review;
