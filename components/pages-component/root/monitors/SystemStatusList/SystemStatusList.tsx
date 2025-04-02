"use client";
import "./style.css";
import React, { useCallback, useState } from "react";
import { GoPlus } from "react-icons/go";
import SystemStatusListTable from "../SystemStatusListTable/SystemStatusListTable";
import SystemStatusCard from "../SystemStatusCard/SystemStatusCard";
import { useStatusStore } from "@/stores/useStatusStore";
import FormModal from "./FormModal/FormModal";

const SystemStatusList = () => {
  const { status } = useStatusStore();
  const [showFormModal, setShowFormModal] = useState(false);
  const handleShowForm = useCallback(() => {
    setShowFormModal(true);
  }, []);
  const handleCloseModal = useCallback(() => {
    setShowFormModal(false);
  }, []);
  return (
    <div className="flex w-full h-full pr-4">
      {showFormModal && <FormModal setShowFormModal={handleCloseModal} />}
      <section className="text-white w-full px-4 container mx-auto">
        <div className="w-full flex justify-between items-center mt-6">
          <h1 className="manrope font-bold text-4xl">
            Monitor{" "}
            <div className="inline-block -ml-1 h-2 w-2 bg-green-500 rounded-full"></div>
          </h1>
          <div>
            <button
              onClick={handleShowForm}
              className="bg-green-700 hover:bg-green-700/70 cursor-pointer px-3 py-2 rounded text-sm font-medium text-white flex items-center gap-1"
            >
              <GoPlus className="text-xl text-white" /> New Monitor
            </button>
          </div>
        </div>
        <SystemStatusListTable handleShowForm={handleShowForm} />
      </section>
      {status && status.sites.length > 0 && (
        <SystemStatusCard monitors={status.sites} />
      )}
    </div>
  );
};

export default SystemStatusList;
