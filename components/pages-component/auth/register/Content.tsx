"use client";
import LoaderSpinner from "@/components/reusable/LoaderSpinner/LoaderSpinner";
import images from "@/constants/images";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaGithub, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import OtpInput from "react-otp-input";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  otp: z.string().min(6, "OTP must be at least 6 characters").optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Content = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const errorResponse = await response.json();
          console.log(errorResponse);
          throw new Error(errorResponse.error.message || "Registration failed");
        }
        setShowOTP(true);
        return response.json();
      } catch (error) {
        return error;
      }
    },
    onSuccess: (data: { message: string }) => {
      if (data instanceof Error) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
    },
    onError: (error) => {
      toast.error("Registration failed. Please check your credentials.");
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error.message || "Verification failed");
        }
        return response.json();
      } catch (error) {
        return error;
      }
    },
    onSuccess: (data) => {
      console.log(data);
      if (data instanceof Error) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        router.push("/");
      }
    },
    onError: () => {
      toast.error("Verification failed. Please check your OTP.");
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    const formData = { ...values, otp };
    if (!showOTP) {
      delete values.otp;
    }
    showOTP
      ? verifyMutation.mutate(formData)
      : registerMutation.mutate(formData);
  };

  return (
    <section className="relative min-h-screen h-full flex lg:flex-row-reverse">
      <div className="w-full lg:w-1/2 p-8 bg-white">
        <h1 className="font-bold text-green-500 tracking-tight text-2xl manrope">
          MC Uptime
        </h1>
        <div className="h-full w-full flex justify-center items-center">
          <div className="w-full md:w-7/12">
            <div>
              <h1 className="inter text-2xl 2xl:text-4xl font-semibold">
                <span className="text-green-500">Register</span> your FREE
                account.
              </h1>
            </div>
            <form
              className="w-full mt-6 2xl:mt-12"
              onSubmit={handleSubmit(onSubmit)}
            >
              {showOTP && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex justify-center items-center">
                  <div className="bg-white p-8 rounded-lg grid gap-2">
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      inputType="text"
                      numInputs={6}
                      containerStyle={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                      }}
                      inputStyle={{
                        border: "1px solid #E5E7EB",
                        height: "80px",
                        width: "60px",
                        color: "black",
                      }}
                      renderInput={(props) => (
                        <input {...register("otp")} {...props} />
                      )}
                    />
                    <button
                      disabled={verifyMutation.isPending}
                      className="font-semibold disabled:opacity-70 cursor-pointer block w-full mt-6 2xl:mt-8 text-white inter py-3 px-6 transition-all hover:bg-green-500/70 bg-green-500"
                      type="submit"
                    >
                      {verifyMutation.isPending ? <LoaderSpinner /> : "Verify"}
                    </button>
                  </div>
                </div>
              )}
              <div className="grid w-full">
                <label
                  htmlFor="email"
                  className="text-base 2xl:text-lg font-semibold inter"
                >
                  Email
                </label>
                <input
                  placeholder="johndoe@gmail.com"
                  className="w-full py-3 px-6 border border-borderColor outline-none"
                  type="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid w-full mt-4">
                <label
                  htmlFor="password"
                  className="text-base 2xl:text-lg font-semibold inter"
                >
                  Password
                </label>
                <div className="relative">
                  {showPassword ? (
                    <FaRegEye
                      className="absolute cursor-pointer right-4 top-[13px] text-2xl"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <FaRegEyeSlash
                      className="absolute cursor-pointer right-4 top-[13px] text-2xl"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )}
                  <input
                    placeholder="******************"
                    className="w-full py-3 pl-6 pr-12 border border-borderColor outline-none"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                className="font-semibold disabled:opacity-70 cursor-pointer block w-full mt-6 2xl:mt-8 text-white inter py-3 px-6 transition-all hover:bg-green-500/70 bg-green-500"
                type="submit"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <LoaderSpinner />
                ) : (
                  "Register now"
                )}
              </button>

              <button
                type="button"
                className="font-semibold cursor-pointer flex justify-center items-center gap-2 w-full mt-4 2xl:mt-8 text-white inter py-3 px-6 transition-all hover:bg-black/70 bg-black"
              >
                <FaGithub className="text-2xl" /> Sign with GitHub
              </button>

              <div>
                <p className="text-right font-semibold mt-4 text-sm text-black-500/70">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="underline text-green-500">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex justify-center items-center lg:w-1/2 bg-green-50 ">
        <Image
          src={images.authPage.registerBanner}
          alt="banner"
          height={500}
          width={500}
        />
      </div>
    </section>
  );
};

export default Content;
