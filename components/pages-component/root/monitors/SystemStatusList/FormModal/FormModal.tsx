import Divider from "@/components/reusable/Divider/Divider";
import icons from "@/constants/icons";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiRefreshCw } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import { MdArrowDropDownCircle } from "react-icons/md";
import { z } from "zod";

const monitorTypes = [
  {
    label: "HTTP / website monitoring",
    description:
      "Use HTTP(S) monitor to monitor your website, API endpoint, or anything running on HTTP.",
    value: "HTTP",
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

export const urlSchema = z.object({
  url: z.string(),
  notifyBy_email: z.boolean(),
  notifyBy_number: z.boolean(),
});

type FormValues = z.infer<typeof urlSchema>;

const MonitorDropdownItem = React.memo(
  ({
    type,
    onSelect,
  }: {
    type: (typeof monitorTypes)[0];
    onSelect: (type: (typeof monitorTypes)[0]) => void;
  }) => (
    <button
      className="flex items-start gap-3 p-3 w-full text-left hover:bg-green-950/20 cursor-pointer transition"
      onClick={(e) => {
        e.preventDefault();
        onSelect(type);
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
        <p className="text-gray-400 text-xs">{type.description}</p>
      </div>
    </button>
  )
);
MonitorDropdownItem.displayName = "MonitorDropdownItem";

const FormModal: React.FC<{ setShowFormModal: (value: boolean) => void }> = ({
  setShowFormModal,
}) => {
  const { data } = useAuthStore();
  const [value, setValue] = useState(5);
  const options = useMemo(() => [1, 5, 30, 60, 720, 1440], []);
  const labels = useMemo(() => ["1m", "5m", "30m", "1h", "12h", "24h"], []);
  const [selectedMonitor, setSelectedMonitor] = useState(monitorTypes[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const memoizedMonitorTypes = useMemo(() => monitorTypes, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  const queryClient = useQueryClient();

  const handleAddURL = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await fetch("/api/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: values.url,
          userID: data?.user?.userID,
          email: data?.user?.email,
          interval: value,
          monitorType: selectedMonitor.value,
        }),
      });
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Adding URL successful!");
      setShowFormModal(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
    onError: (error: { message: string }) => {
      console.log(error);
      toast.error(
        error.message ||
          "Something when wrong from the server. Adding URL failed!"
      );
    },
  });

  const onSubmit = (data: FormValues) => {
    handleAddURL.mutate(data);
  };

  const handleMonitorSelect = useCallback((type: (typeof monitorTypes)[0]) => {
    setSelectedMonitor(type);
    setIsDropdownOpen(false);
  }, []);

  const handleRangeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(options[Number(e.target.value)]);
    },
    [options]
  );

  const handleClose = useCallback(() => {
    setShowFormModal(false);
  }, [setShowFormModal]);

  return (
    <div className="fixed flex justify-center items-center w-full h-full px-24 z-[1000]">
      <div
        onClick={handleClose}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        className="w-full h-full fixed"
      ></div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          backgroundColor: "#00170c",
        }}
        className="relative w-[70%] z-[1000] rounded-lg px-8 py-6 text-white border border-white/10"
      >
        <IoIosClose
          onClick={handleClose}
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
              {memoizedMonitorTypes.map((type) => (
                <MonitorDropdownItem
                  key={type.value}
                  type={type}
                  onSelect={handleMonitorSelect}
                />
              ))}
            </div>
          </div>
          <Divider />
          <div className="grid w-full">
            <label htmlFor="monitor_url" className="font-bold text-sm">
              URL to monitor
            </label>
            <input
              {...register("url", {
                required: {
                  value: true,
                  message: "Please enter the URL to monitor",
                },
                pattern: {
                  value: /^(https?:\/\/)?([\da-z.-]+\.)+[a-z]{2,}$/i,
                  message: "Please enter a valid URL",
                },
              })}
              type="text"
              placeholder="https://"
              className="mt-1 transition-all outline-none border border-white/10 hover:border-white/50 bg-[#000d07] rounded-lg py-2 px-4 placeholder:text-white placeholder:text-sm inter text-sm"
            />
            {errors.url && (
              <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>
            )}
          </div>
          <Divider />
          <div>
            <h2 className="font-bold text-sm">How we will notify you?</h2>
            <div className="flex gap-6 flex-wrap mt-2">
              <div className="flex-1 w-full bg-green-950/50 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="email"
                    {...register("notifyBy_email", {
                      required: {
                        value: data?.user?.email ? true : false,
                        message: "Email is required",
                      },
                    })}
                    checked={data?.user?.email ? true : false}
                  />
                  <label htmlFor="email" className="text-sm inter">
                    E-mail
                  </label>
                </div>
                <p className="text-white/50 text-xs mt-1 overflow-hidden text-ellipsis">
                  {data && data.user?.email}
                </p>
                <div className="flex gap-2 items-center mt-1">
                  <FiRefreshCw className="bg-[#000d07] shadow p-2 rounded-md text-3xl" />{" "}
                  <p className="text-white/50 text-xs">No delay, no repeat</p>
                </div>
                {errors.notifyBy_email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.notifyBy_email.message}
                  </p>
                )}
              </div>
              <div className="flex-1 w-full  bg-green-950/50 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <input
                    {...register("notifyBy_number")}
                    type="checkbox"
                    disabled={data?.user?.number ? false : true}
                    id="sms"
                  />
                  <label
                    htmlFor="sms"
                    className={`text-sm inter ${
                      data?.user?.number ? "text-white" : "text-gray-400"
                    }`}
                  >
                    SMS message
                  </label>
                </div>
                <p className="text-white/50 text-xs mt-1 overflow-hidden text-ellipsis">
                  {data && data.user?.number ? (
                    data.user.number
                  ) : (
                    <button className="text-green-500 underline text-xs">
                      Add phone number
                    </button>
                  )}
                </p>
                <div className="flex gap-2 items-center mt-1">
                  <FiRefreshCw className="bg-[#000d07] shadow p-2 rounded-md text-3xl" />{" "}
                  <p className="text-white/50 text-xs">No delay, no repeat</p>
                </div>
                {errors.notifyBy_number && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.notifyBy_number.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <Divider />
          <div className="">
            <h3 className="text-sm font-bold">Monitor interval</h3>
            <p className="text-sm text-gray-400 mt-1">
              Your monitor will be checked every{" "}
              <span className="font-semibold text-white">{value} minutes</span>.
              We recommend at least 1-minute checks.
            </p>
            <div className="mt-4">
              <input
                type="range"
                min="0"
                max={options.length - 1}
                value={options.indexOf(value)}
                onChange={handleRangeChange}
                className="w-full cursor-pointer accent-green-500"
              />
            </div>
            <div className="flex justify-between text-gray-400 text-xs mt-2">
              {labels.map((label, index) => (
                <span
                  key={index}
                  className={
                    value === options[index] ? "text-white font-bold" : ""
                  }
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="text-sm px-12 py-3 bg-green-700 hover:bg-green-700/70 mt-6 rounded-lg cursor-pointer"
          >
            Create Monitor
          </button>
        </div>
      </form>
    </div>
  );
};
FormModal.displayName = "FormModal";
export default FormModal;
