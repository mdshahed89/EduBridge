import Link from "next/link"
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa"

export const Footer = () => {
  return(
    <footer className=" mt-[4rem] bg-[#0400ff] pt-[4rem] pb-[2rem] text-center text-[#fff] ">
      <h3 className=" text-[1.3rem] font-medium  ">Follow Us</h3>
      <div className=" flex items-center justify-center gap-4 my-[1rem] ">
          <Link href={`#`} target="_blank" className=" bg-[#fff] p-2 rounded-full text-[#0400ff] text-[1.3rem] ">
            <FaLinkedinIn />
          </Link>
          <Link href={`#`} target="_blank" className=" bg-[#fff] p-2 rounded-full text-[#0400ff] text-[1.3rem] ">
            <FaFacebookF />
          </Link>
          <Link href={`#`} target="_blank" className=" bg-[#fff] p-2 rounded-full text-[#0400ff] text-[1.3rem] ">
           <FaInstagram />
          </Link>
      </div>
      <div>
        <p>Copyright @2025 all rights reserved by <Link href={`#`} className=" text-[#fff] underline ">Md Shahed</Link></p>
      </div>
    </footer>
  )
}