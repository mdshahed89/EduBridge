"use client";

import Courses from "@/components/Courses";
import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Review from "@/components/Review";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Courses />
      <Review />
      <Footer />
    </div>
  );
}
