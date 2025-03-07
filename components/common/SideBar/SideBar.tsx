"use client";
import Link from "next/link";
import React, { useState } from "react";
import { MdOutlineMonitor, MdError } from "react-icons/md";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { useAuthStore } from "@/stores/useAuthStore";
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
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);
  const { data } = useAuthStore();
  const pathname = usePathname();
  return (
    <aside
      className={`sticky top-0 py-6 bg-black/40 transition-all  text-white h-screen flex flex-col justify-between items-center ${
        isSideBarOpen ? "w-[150px]" : "w-[60px]"
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
                    className={`text-sm text-nowrap text-white ${
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
        <div className="w-full">
          {data && data.user?.email ? (
            <div className="flex justify-center items-center bg-green-500 text-3xl rounded-full h-11 w-11">
              <h3> {data.user.email.split("")[0].toUpperCase()}</h3>
            </div>
          ) : (
            <div className="rounded-full h-11 w-11 bg-gray-400 animate-pulse"></div>
          )}
        </div>
        <div className="mt-12">
          {!isSideBarOpen ? (
            <TbLayoutSidebarLeftExpandFilled
              className="cursor-pointer text-2xl mx-auto"
              onClick={() => setIsSideBarOpen(!isSideBarOpen)}
            />
          ) : (
            <TbLayoutSidebarRightExpandFilled
              className="cursor-pointer text-2xl mx-auto"
              onClick={() => setIsSideBarOpen(!isSideBarOpen)}
            />
          )}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
