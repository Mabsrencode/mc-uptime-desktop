"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SideBar from "@/components/common/SideBar/SideBar";
import { Toaster } from "react-hot-toast";
const queryClient = new QueryClient();

const publicRoutes = ["/auth/login", "/auth/register"];
const layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);
  return (
    <main className="min-h-screen bg-black/90">
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className={`${!isPublicRoute && "flex"} h-full`}>
        {!isPublicRoute && <SideBar />}
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </div>
    </main>
  );
};

export default layout;
