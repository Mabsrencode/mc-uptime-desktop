"use client";
<<<<<<< HEAD
import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import z from "zod";
import { GoPlus } from "react-icons/go";
const SystemStatusList = () => {
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
=======
import icons from "@/constants/icons";
import "./style.css";
import { MdArrowDropDownCircle } from "react-icons/md";
import React, { useState } from "react";
import { GoPlus } from "react-icons/go";
import Divider from "@/components/reusable/Divider/Divider";
import { IoIosClose } from "react-icons/io";
import Image from "next/image";
const monitorTypes = [
  {
    label: "HTTP / website monitoring",
    description:
      "Use HTTP(S) monitor to monitor your website, API endpoint, or anything running on HTTP.",
    value: "website",
    image: icons.http,
  },
  {
    label: "Keyword monitoring",
    description:
      "Check the presence or absence of specific text in the request's response body.",
    value: "keyword",
    image: icons.key,
  },
  {
    label: "Ping monitoring",
    description:
      "Make sure your server or any device in the network is always available.",
    value: "ping",
    image: icons.ping,
  },
  {
    label: "Port monitoring",
    description:
      "Monitor any service on your server, useful for SMTP, POP3, FTP, and more.",
    value: "port",
    image: icons.port,
  },
];

const SystemStatusList = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedMonitor, setSelectedMonitor] = useState(monitorTypes[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
>>>>>>> 2da12e0 (Fresh Start)

  return (
    <>
      {showFormModal && (
        <div className="fixed flex justify-center items-center w-full h-full px-24">
          <div
<<<<<<< HEAD
            onClick={() => setShowFormModal(!showFormModal)}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            }}
            className="w-full h-full fixed"
          ></div>
          <form className="w-full bg-white/50 z-[1000]">
            <div>
              <div>
                <label htmlFor="monitor_type">Monitor type</label>
                <select id="monitor_type"></select>
              </div>
            </div>
            <div>
              <label htmlFor=""></label>
=======
            onClick={() => setShowFormModal(false)}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
            className="w-full h-full fixed"
          ></div>

          <form
            style={{
              backgroundColor: "#00170c",
            }}
            className="relative w-[70%] z-[1000] h-[90%] rounded-lg px-8 py-6 text-white border border-white/10"
          >
            <IoIosClose
              onClick={() => setShowFormModal(false)}
              className="absolute top-1 right-1 text-3xl hover:bg-white/20 rounded-full cursor-pointer"
            />

            <div>
              <h1 className="font-bold text-sm">Monitor type</h1>
              <div
                style={{
                  backgroundColor: "#000d07",
                }}
                className={`relative mt-1 cursor-pointer ${
                  isDropdownOpen ? "rounded-t-lg" : "rounded-lg"
                }`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div
                  className={`transition-all flex justify-between gap-4 ${
                    isDropdownOpen
                      ? "rounded-t-lg border-t border-x"
                      : "rounded-lg border"
                  } overflow-hidden border-white/10 items-center px-4 py-3`}
                >
                  <div className="flex gap-3">
                    <Image
                      src={selectedMonitor.image}
                      alt="Monitor Type"
                      className="w-8 h-8 rounded"
                      width={8}
                      height={8}
                    />
                    <div>
                      <h1 className="text-white">{selectedMonitor.label}</h1>
                      <p className="text-gray-400 text-sm">
                        {selectedMonitor.description}
                      </p>
                    </div>
                  </div>
                  <MdArrowDropDownCircle
                    className={`text-4xl transition-all ${
                      isDropdownOpen ? "rotate-180" : "rotate-0 "
                    }`}
                  />
                </div>
                <div
                  style={{
                    backgroundColor: "#000d07",
                  }}
                  className={`absolute left-0 w-full bg-green-950/20 border border-white/10 overflow-hidden rounded-b-lg 
    transition-all duration-300 ease-in-out 
    ${isDropdownOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {monitorTypes.map((type) => (
                    <button
                      key={type.value}
                      className="flex items-start gap-3 p-3 w-full text-left hover:bg-green-950/20 cursor-pointer transition"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedMonitor(type);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Image
                        height={8}
                        width={8}
                        src={type.image}
                        alt={type.label}
                        className="w-8 h-8 rounded"
                      />
                      <div>
                        <p className="text-white font-medium">{type.label}</p>
                        <p className="text-gray-400 text-xs">
                          {type.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <Divider />
              <div className="grid w-full">
                <label htmlFor="monitor_url" className="font-bold text-sm">
                  URL to monitor
                </label>
                <input
                  type="text"
                  placeholder="https://"
                  className="mt-1 transition-all outline-none border border-white/10 hover:border-white/50 bg-[#000d07] rounded-lg py-2 px-4 placeholder:text-white placeholder:text-sm inter text-sm"
                />
              </div>
              <Divider />
              <div>
                <h2 className="font-bold text-sm">How we will notify you?</h2>
                <div className="flex gap-12 flex-wrap mt-2">
                  <div className="flex-1 w-full ">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="email" />
                      <label htmlFor="email" className="text-sm inter">
                        E-mail
                      </label>
                    </div>
                    <p className="text-white/50 text-xs mt-1 overflow-hidden text-ellipsis">
                      rdmababa3646pam@student.fatima.edu.ph
                    </p>
                    <div></div>
                  </div>
                  <div className="flex-1 w-full ">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="sms" />
                      <label htmlFor="sms" className="text-sm inter">
                        SMS message
                      </label>
                    </div>
                  </div>
                </div>
              </div>
>>>>>>> 2da12e0 (Fresh Start)
            </div>
          </form>
        </div>
      )}
<<<<<<< HEAD
=======

>>>>>>> 2da12e0 (Fresh Start)
      <section className="text-white w-full px-4 container mx-auto">
        <div className="w-full flex justify-between items-center mt-6">
          <h1 className="manrope font-bold text-4xl">
            Monitor{" "}
            <div className="inline-block -ml-1 h-2 w-2 bg-green-500 rounded-full"></div>
          </h1>
          <div>
            <button
<<<<<<< HEAD
              onClick={() => setShowFormModal(!showFormModal)}
              className="bg-green-700 hover:bg-green-700/70 cursor-pointer px-3 py-2 rounded text-sm font-medium text-white"
            >
              <GoPlus className="inline text-xl text-white" /> New Monitor
=======
              onClick={() => setShowFormModal(true)}
              className="bg-green-700 hover:bg-green-700/70 cursor-pointer px-3 py-2 rounded text-sm font-medium text-white flex items-center gap-1"
            >
              <GoPlus className="text-xl text-white" /> New Monitor
>>>>>>> 2da12e0 (Fresh Start)
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default SystemStatusList;
