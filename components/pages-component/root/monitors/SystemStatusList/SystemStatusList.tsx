"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import z from "zod";
import { GoPlus } from "react-icons/go";
const SystemStatusList = () => {
  const [showFormModal, setShowFormModal] = useState<boolean>(false);

  return (
    <>
      {showFormModal && (
        <div className="fixed flex justify-center items-center w-full h-full px-24">
          <div
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
            </div>
          </form>
        </div>
      )}
      <section className="text-white w-full px-4 container mx-auto">
        <div className="w-full flex justify-between items-center mt-6">
          <h1 className="manrope font-bold text-4xl">
            Monitor{" "}
            <div className="inline-block -ml-1 h-2 w-2 bg-green-500 rounded-full"></div>
          </h1>
          <div>
            <button
              onClick={() => setShowFormModal(!showFormModal)}
              className="bg-green-700 hover:bg-green-700/70 cursor-pointer px-3 py-2 rounded text-sm font-medium text-white"
            >
              <GoPlus className="inline text-xl text-white" /> New Monitor
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default SystemStatusList;
