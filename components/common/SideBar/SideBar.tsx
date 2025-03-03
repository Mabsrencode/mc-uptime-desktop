"use client";
import Link from "next/link";
import React, { useState } from "react";
import { MdOutlineMonitor, MdError } from "react-icons/md";
import { HiOutlineStatusOnline } from "react-icons/hi";
import {
  TbLayoutSidebarLeftExpandFilled,
  TbLayoutSidebarRightExpandFilled,
} from "react-icons/tb";

import { usePathname } from "next/navigation";
const navigationItems = [
  {
    link: "/monitors",
    name: "Monitoring",
    icon: <MdOutlineMonitor />,
  },
  {
    link: "/incidents",
    name: "Incidents",
    icon: <MdError />,
  },
  {
    link: "/status",
    name: "Status pages",
    icon: <HiOutlineStatusOnline />,
  },
];

const SideBar = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>();
  const pathname = usePathname();
  return (
    <aside
      className={`sticky top-0 py-6 bg-black/40 transition-all  text-white h-screen flex flex-col justify-between items-center ${
<<<<<<< HEAD
        isSideBarOpen ? "w-[200px]" : "w-[60px]"
=======
        isSideBarOpen ? "w-[150px]" : "w-[60px]"
>>>>>>> 2da12e0 (Fresh Start)
      }`}
    >
      <div className="flex flex-col items-center">
        <Link href={"/"} className="flex items-center gap-4">
          <div>
            <span className="relative flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500"></span>
            </span>
          </div>
          {isSideBarOpen && (
            <h1 className="text-green-500 font-semibold manrope">MC Uptime</h1>
          )}
        </Link>
        <nav className="mt-12">
          <ul className="grid gap-2 text-xl transition-all">
            {navigationItems.map((navItem) => (
              <li key={navItem.link}>
                <Link
                  className={`flex items-center gap-2 transition-all p-[14px] hover:bg-green-950/90 hover:text-green-200 rounded text-green-200 ${
                    pathname === navItem.link
                      ? "bg-green-950/90"
                      : "text-slate-200/60"
                  }`}
                  title={navItem.name}
                  href={navItem.link}
                >
                  {navItem.icon}
                  <span
<<<<<<< HEAD
                    className={`text-sm text-nowrap ${
=======
                    className={`text-sm text-nowrap text-white ${
>>>>>>> 2da12e0 (Fresh Start)
                      isSideBarOpen ? "block" : "hidden"
                    }`}
                  >
                    {navItem.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div>
        <div></div>
        <div>
          {!isSideBarOpen ? (
            <TbLayoutSidebarLeftExpandFilled
              className="cursor-pointer text-2xl"
              onClick={() => setIsSideBarOpen(!isSideBarOpen)}
            />
          ) : (
            <TbLayoutSidebarRightExpandFilled
              className="cursor-pointer text-2xl"
              onClick={() => setIsSideBarOpen(!isSideBarOpen)}
            />
          )}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
