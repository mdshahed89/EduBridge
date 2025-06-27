"use client";

import React, { useEffect, useRef, useState } from "react";
import { BiMessageRoundedDots } from "react-icons/bi";
import { BsCalendar3 } from "react-icons/bs";
import { FaXmark } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { RiApps2Line } from "react-icons/ri";
import { Range, getTrackBackground } from "react-range";

type Filters = {
  page: number;
  limit: number;
  nationality: string;
  eyeColors: string[];
  hairColors: string[];
  heights: string[];
  search: string;
  sortBy: string;
  identity: string[];
};

interface HomeSidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const HomeSidebar: React.FC<HomeSidebarProps> = ({
  filters,
  setFilters,
  isOpen,
  toggleSidebar,
}) => {
  const MIN = 18;
  const MAX = 69;

  const options: string[] = [
    "Man",
    "Woman",
    "Non-binary",
    "Transsexual",
    "BDSM",
    "Gay",
    "Lesbian",
    "Fetish",
    "Other",
  ];

  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const [values, setValues] = useState<number[]>([MIN, MAX]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minAge: String(values[0]),
      maxAge: String(values[1]),
      page: 1,
    }));
  }, [values, setFilters]);

  const handleNationalityClick = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      nationality: value,
      page: 1,
    }));
  };

  const handleIdentityChange = (value: string) => {
    setFilters((prev) => {
      const updated = prev.identity.includes(value)
        ? prev.identity.filter((v) => v !== value)
        : [...prev.identity, value];
      return { ...prev, identity: updated, page: 1 };
    });
  };

  const toggleOption = (label: string) => {
    setToggles((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
    handleIdentityChange(label);
  };

  const nationalities = [
    "Norway",
    "Sweden",
    "Denmark",
    "Finland",
    "Iceland",
    "Other",
  ];

  return (
    <div
      className={`md:relative fixed top-0 left-0 overflow-x-hidden z-[60] bg-[linear-gradient(to_top_right,#1B0206,#1B0206,#1B0206,#2C040B,#2C040B)] md:bg-none md:bg-transparent
  w-[20rem] px-3
  md:h-auto h-[100vh] overflow-y-auto sidebar-scrollbar 
  md:w-[23rem] pt-[9rem] pb-[10rem] md:pt-1 
  transition-transform duration-300 
  ${isOpen ? "translate-x-0" : "-translate-x-full"} 
  md:translate-x-0`}
    >
      <div className=" flex items-center justify-between ">
        <div className=" flex items-center gap-3 text-[1.2rem] text-[#F4F1ED] ">
          <BiMessageRoundedDots className=" mt-1 text-[1.5rem] " />
          <span>Nationality</span>
        </div>

        <div
          onClick={toggleSidebar}
          className=" md:hidden flex p-3 rounded-full text-[#000] bg-[#D6BFA7] shadow-inner text-[1.2rem] "
        >
          <FaXmark />
        </div>
      </div>
      <div
        onClick={() => handleNationalityClick("View All")}
        className={` ${
          filters.nationality === "View All"
            ? "bg-[#D6BFA7] border-[#D6BFA7] text-[#000]"
            : "bg-transparent border-[#BFA07A] text-[#BFA07A]"
        } mt-[1.5rem] px-4 py-1 w-fit border rounded-md  cursor-pointer `}
      >
        View All
      </div>
      <div className=" mt-[.5rem] flex items-center flex-wrap gap-2  text-[#cac8c6]">
        {nationalities.map((nation) => (
          <div
            key={nation}
            onClick={() => handleNationalityClick(nation)}
            className={` ${
              filters.nationality === nation
                ? "bg-[#D6BFA7] border-[#D6BFA7] text-[#000] "
                : "bg-transparent border-[#505050]"
            } py-1 border rounded-md text-center px-4 cursor-pointer hover:bg-[#D6BFA7] hover:border-[#D6BFA7] hover:text-[#000] transition-colors duration-300 ease-in-out  `}
          >
            {nation}
          </div>
        ))}
      </div>

      <div className=" mt-[3rem] ">
        <div className=" flex items-center gap-3 text-[1.2rem] text-[#F4F1ED] ">
          <RiApps2Line className=" mt-1 text-[1.4rem] " />
          <span>Content</span>
        </div>

        <div className=" mt-[1rem] space-y-4 text-[#cac8c6] ">
          {options.map((label) => (
            <div
              key={label}
              className="flex justify-between items-center w-full"
            >
              <span>{label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={toggles[label] || false}
                  onChange={() => toggleOption(label)}
                />
                <div className="w-12 h-6 shadow-inner bg-transparent ring-1 ring-[#6e655b] peer-checked:ring-[#D6BFA7] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D6BFA7] rounded-sm peer peer-checked:bg-[#5e554c] transition-all duration-300"></div>
                <div className="absolute left-[4px] top-1 bg-[#D6BFA7] w-4 h-4 rounded-sm transition-transform duration-300 peer-checked:translate-x-[1.6rem] "></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className=" mt-[3rem] ">
        <div className=" flex items-center gap-3 text-[1.2rem] text-[#F4F1ED] ">
          <BsCalendar3 className=" text-[1.2rem] " />
          <span>Age</span>
        </div>

        <div className=" mt-[.5rem] w-full flex flex-col items-center justify-center px-2 text-[#cac8c6] ">
          <Range
            values={values}
            step={1}
            min={MIN}
            max={MAX}
            onChange={(vals) => setValues(vals)}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className="w-full h-1 my-6 rounded"
                style={{
                  background: getTrackBackground({
                    values,
                    colors: ["#ccc", "#D6BFA7", "#ccc"],
                    min: MIN,
                    max: MAX,
                  }),
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => {
              const { key, ...rest } = props;
              return (
                <div
                  key={key}
                  {...rest}
                  className="w-5 h-5 bg-[#D6BFA7] rounded flex items-center justify-center shadow-md outline-none "
                >
                  <div className="w-2 h-2 bg-[#380a15] rounded-sm" />
                </div>
              );
            }}
          />

          <div className="flex justify-between w-full text-sm">
            <span>{values[0]}</span>
            <span>{values[1]}</span>
          </div>
        </div>
      </div>

      <div className=" mt-[3rem] ">
        <EyeColorSelector filters={filters} setFilters={setFilters} />
      </div>
      <div className=" mt-[3rem] ">
        <HairColorSelector filters={filters} setFilters={setFilters} />
      </div>
      <div className=" mt-[3rem] ">
        <HeightSelector filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default HomeSidebar;

type SelectorProps = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

const EyeColorSelector: React.FC<SelectorProps> = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const ref = useRef<HTMLDivElement | null>(null);

  const eyeColors: string[] = [
    "Black",
    "Brown",
    "Hazel",
    "Amber",
    "Blue",
    "Gray",
    "Green",
    "Other",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEyeColorsChange = (value: string) => {
    setFilters((prev) => {
      const updated = prev.eyeColors.includes(value)
        ? prev.eyeColors.filter((v) => v !== value)
        : [...prev.eyeColors, value];
      return { ...prev, eyeColors: updated, page: 1 };
    });
  };

  const toggleOption = (label: string) => {
    setToggles((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
    handleEyeColorsChange(label);
  };

  const toggleColor = (color: string) => {
    const updatedColors = filters.eyeColors.includes(color)
      ? filters.eyeColors.filter((c) => c !== color)
      : [...filters.eyeColors, color];

    setFilters({ ...filters, eyeColors: updatedColors });
  };

  return (
    <div className="space-y-[1.5rem] w-full">
      {/* <div className="flex items-center gap-3 text-[1.2rem] text-[#F4F1ED]">
        <FaRegEye className="mt-1 text-[1.4rem]" />
        <span>Eye Color</span>
      </div> */}
      <div className={` ${!isOpen && "border-b border-[#b3b1af]"} `}>
        <div className="relative" ref={ref}>
          <div
            className="w-full cursor-pointer flex items-center justify-between gap-3 text-[1.3rem] text-[#F4F1ED]"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>Eye Color</span>
            <IoIosArrowDown
              className={`${
                isOpen ? "rotate-180" : ""
              } transition-all duration-300 ease-in-out text-[1.1rem]`}
            />
          </div>
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              isOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            } overflow-hidden`}
          >
            <ul className="w-full rounded-lg mt-2 pb-1 overflow-hidden *:cursor-pointer pr-2">
              {eyeColors.map((color, idx) => {
                return (
                  <li
                    key={idx}
                    className="flex items-center gap-2 justify-between py-2 cursor-pointer rounded-md transition-all duration-300"
                    onClick={() => toggleColor(color)}
                  >
                    <span className=" text-[1.2rem] text-[#cac8c6] ">
                      {color}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={toggles[color] || false}
                        onChange={() => toggleOption(color)}
                      />
                      <div className="w-12 h-6 shadow-inner bg-transparent ring-1 ring-[#6e655b] peer-checked:ring-[#D6BFA7] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D6BFA7] rounded-sm peer peer-checked:bg-[#D6BFA7]/50 transition-all duration-300"></div>
                      <div className="absolute left-[4px] top-1 bg-[#D6BFA7] w-4 h-4 rounded-sm transition-transform duration-300 peer-checked:translate-x-[1.6rem] "></div>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const HairColorSelector: React.FC<SelectorProps> = ({
  filters,
  setFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const ref = useRef<HTMLDivElement | null>(null);

  const hairColors: string[] = [
    "Black",
    "Dark Brown",
    "Light Brown",
    "Blonde",
    "Red",
    "Gray",
    "White",
    "Dyed / Colored",
    "Bald / No Hair",
    "Other",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleColorsChange = (value: string) => {
    setFilters((prev) => {
      const updated = prev.hairColors.includes(value)
        ? prev.hairColors.filter((v) => v !== value)
        : [...prev.hairColors, value];
      return { ...prev, hairColors: updated, page: 1 };
    });
  };

  const toggleOption = (label: string) => {
    setToggles((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
    handleColorsChange(label);
  };

  const toggleColor = (color: string) => {
    const updatedColors = filters.hairColors.includes(color)
      ? filters.hairColors.filter((c) => c !== color)
      : [...filters.hairColors, color];

    setFilters({ ...filters, hairColors: updatedColors });
  };

  return (
    <div className="space-y-[1.5rem] w-full">
      {/* <div className="flex items-center gap-3 text-[1.2rem] text-[#F4F1ED]">
        <FaRegEye className="mt-1 text-[1.4rem]" />
        <span>Eye Color</span>
      </div> */}
      <div className={` ${!isOpen && "border-b border-[#b3b1af]"} `}>
        <div className="relative" ref={ref}>
          <div
            className="w-full cursor-pointer flex items-center justify-between gap-3 text-[1.3rem] text-[#F4F1ED]"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>Hair Color</span>
            <IoIosArrowDown
              className={`${
                isOpen ? "rotate-180" : ""
              } transition-all duration-300 ease-in-out text-[1.1rem]`}
            />
          </div>
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              isOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            } overflow-hidden`}
          >
            <ul className="w-full rounded-lg mt-2 pb-1 overflow-hidden *:cursor-pointer pr-2">
              {hairColors.map((color, idx) => {
                return (
                  <li
                    key={idx}
                    className="flex items-center gap-2 justify-between py-2 cursor-pointer rounded-md transition-all duration-300"
                    onClick={() => toggleColor(color)}
                  >
                    <span className=" text-[1.2rem] text-[#cac8c6] ">
                      {color}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={toggles[color] || false}
                        onChange={() => toggleOption(color)}
                      />
                      <div className="w-12 h-6 shadow-inner bg-transparent ring-1 ring-[#6e655b] peer-checked:ring-[#D6BFA7] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D6BFA7] rounded-sm peer peer-checked:bg-[#D6BFA7]/50 transition-all duration-300"></div>
                      <div className="absolute left-[4px] top-1 bg-[#D6BFA7] w-4 h-4 rounded-sm transition-transform duration-300 peer-checked:translate-x-[1.6rem] "></div>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeightSelector: React.FC<SelectorProps> = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const ref = useRef<HTMLDivElement | null>(null);

  const heights: string[] = [
    "Under 4'10\"",
    "4'10\" - 5'0\"",
    "5'1\" - 5'3\"",
    "5'4\" - 5'6\"",
    "5'7\" - 5'9\"",
    "5'10\" - 6'0\"",
    "6'1\" - 6'3\"",
    "Above 6'3\"",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleColorsChange = (value: string) => {
    setFilters((prev) => {
      const updated = prev.heights.includes(value)
        ? prev.heights.filter((v) => v !== value)
        : [...prev.heights, value];
      return { ...prev, heights: updated, page: 1 };
    });
  };

  const toggleOption = (label: string) => {
    setToggles((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
    handleColorsChange(label);
  };

  const toggleColor = (color: string) => {
    const updatedColors = filters.heights.includes(color)
      ? filters.heights.filter((c) => c !== color)
      : [...filters.heights, color];

    setFilters({ ...filters, heights: updatedColors });
  };

  return (
    <div className="space-y-[1.5rem] w-full">
      {/* <div className="flex items-center gap-3 text-[1.2rem] text-[#F4F1ED]">
        <FaRegEye className="mt-1 text-[1.4rem]" />
        <span>Eye Color</span>
      </div> */}
      <div className={` ${!isOpen && "border-b border-[#b3b1af]"} `}>
        <div className="relative" ref={ref}>
          <div
            className="w-full cursor-pointer flex items-center justify-between gap-3 text-[1.3rem] text-[#F4F1ED]"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>Height</span>
            <IoIosArrowDown
              className={`${
                isOpen ? "rotate-180" : ""
              } transition-all duration-300 ease-in-out text-[1.1rem]`}
            />
          </div>
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              isOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            } overflow-hidden`}
          >
            <ul className="w-full rounded-lg mt-2 pb-1 overflow-hidden *:cursor-pointer pr-2">
              {heights.map((height, idx) => {
                return (
                  <li
                    key={idx}
                    className="flex items-center gap-2 justify-between py-2 cursor-pointer rounded-md transition-all duration-300"
                    onClick={() => toggleColor(height)}
                  >
                    <span className=" text-[1.2rem] text-[#cac8c6] ">
                      {height}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={toggles[height] || false}
                        onChange={() => toggleOption(height)}
                      />
                      <div className="w-12 h-6 shadow-inner bg-transparent ring-1 ring-[#6e655b] peer-checked:ring-[#D6BFA7] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D6BFA7] rounded-sm peer peer-checked:bg-[#D6BFA7]/50 transition-all duration-300"></div>
                      <div className="absolute left-[4px] top-1 bg-[#D6BFA7] w-4 h-4 rounded-sm transition-transform duration-300 peer-checked:translate-x-[1.6rem] "></div>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
