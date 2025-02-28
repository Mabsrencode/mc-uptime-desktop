import Link from "next/link";
import React from "react";

const SideBar = () => {
  return (
    <aside className="px-4 py-6 bg-green-900 text-white h-screen">
      <Link href={"/monitors"}>
        <span className="relative flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500"></span>
        </span>
      </Link>
      <nav>
        <ul>
          <li>
            <Link href={""}></Link>
          </li>
          <li>
            <Link href={""}></Link>
          </li>
          <li>
            <Link href={""}></Link>
          </li>
          <li>
            <Link href={""}></Link>
          </li>
          <li>
            <Link href={""}></Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
