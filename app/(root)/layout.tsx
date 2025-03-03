"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SideBar from "@/components/common/SideBar/SideBar";
import { Toaster } from "react-hot-toast";
const queryClient = new QueryClient();

const publicRoutes = ["/auth/login", "/auth/register"];
<<<<<<< HEAD
const layout = ({ children }: { children: React.ReactNode }) => {
=======
const Layout = ({ children }: { children: React.ReactNode }) => {
>>>>>>> 2da12e0 (Fresh Start)
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

<<<<<<< HEAD
export default layout;
=======
export default Layout;
>>>>>>> 2da12e0 (Fresh Start)
