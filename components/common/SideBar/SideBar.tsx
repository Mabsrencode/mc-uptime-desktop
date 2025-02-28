import Link from "next/link";
import React from "react";
import { MdOutlineMonitor, MdError } from "react-icons/md";
import { HiOutlineStatusOnline } from "react-icons/hi";
const SideBar = () => {
  return (
    <aside className="px-3 py-6 bg-black/50 text-white h-screen">
      <div className="flex flex-col items-center">
        <Link href={"/"}>
          <span className="relative flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500"></span>
          </span>
        </Link>
        <nav className="mt-12">
          <ul className="grid gap-2 text-5xl">
            <li>
              <Link href={"/monitors"}>
                <MdOutlineMonitor className="p-[14px] bg-green-950/90 rounded text-green-200" />
              </Link>
            </li>
            <li>
              <Link href={"/incidents"}>
                <MdError className="p-[14px] bg-green-950/90 rounded text-green-200" />
              </Link>
            </li>
            <li>
              <Link href={""}>
                <HiOutlineStatusOnline className="p-[14px] bg-green-950/90 rounded text-green-200" />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default SideBar;
