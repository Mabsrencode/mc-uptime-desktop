"use client";
import images from "@/constants/images";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaGithub, FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LoaderSpinner from "@/components/reusable/LoaderSpinner/LoaderSpinner";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Content = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success("Login successful!");
      router.push("/");
    },
    onError: () => {
      toast.error("Login failed. Please check your credentials.");
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <section className="min-h-screen flex w-full">
      <div className="w-full lg:w-1/2 p-8">
        <h1 className="font-bold text-green-500 tracking-tight text-2xl manrope">
          MC Uptime
        </h1>
        <div className="h-full w-full flex justify-center items-center">
          <div className="w-full md:w-7/12">
            <div>
              <h1 className="inter text-2xl 2xl:text-4xl font-semibold">
                Welcome Back!
              </h1>
              <p className="mt-2 2xl:mt-4 text-black-500/70">
                To keep connected with us login with your personal info
              </p>
            </div>
            <form
              className="w-full mt-6 2xl:mt-12"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grid w-full">
                <label
                  htmlFor="email"
                  className="text-base 2xl:text-lg font-semibold inter"
                >
                  Email
                </label>
                <input
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

              <div className="mt-4 text-sm font-medium text-black-500 flex justify-between items-center">
                <div>
                  <input
                    type="checkbox"
                    name="save"
                    id="save"
                    className="mr-1 w-[14px] h-[14px] appearance-none border-2 border-gray-400 rounded-sm checked:bg-green-500 transition-all duration-200 cursor-pointer"
                  />
                  <label htmlFor="save">Remember for 30 days</label>
                </div>
                <div>
                  <Link className="underline" href="/auth/forgot-password">
                    Forgot password
                  </Link>
                </div>
              </div>

              <button
                className="cursor-pointer block w-full mt-6 2xl:mt-8 text-white inter py-3 px-6 transition-all hover:bg-green-500/70 bg-green-500"
                type="submit"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? <LoaderSpinner /> : "Log In"}
              </button>

              <button
                type="button"
                className="cursor-pointer flex justify-center items-center gap-2 w-full mt-4 2xl:mt-8 text-white inter py-3 px-6 transition-all hover:bg-black/70 bg-black"
              >
                <FaGithub className="text-2xl" /> Sign with GitHub
              </button>

              <div>
                <p className="text-right font-medium mt-4 text-sm text-black-500/70">
                  Don't have an account?{" "}
                  <Link href="/auth/register" className="underline">
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex justify-center items-center lg:w-1/2 bg-green-50 ">
        <Image
          src={images.authPage.loginBanner}
          alt="banner"
          height={500}
          width={500}
        />
      </div>
    </section>
  );
};

export default Content;
