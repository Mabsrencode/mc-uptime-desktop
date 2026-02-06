"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SideBar from "@/components/common/SideBar/SideBar";
import { Toaster } from "react-hot-toast";
import { UnauthorizedError } from "@/lib/authFetch";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 401 unauthorized errors
        if (error instanceof UnauthorizedError) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

const publicRoutes = ["/auth/login", "/auth/register"];
const Layout = ({ children }: { children: React.ReactNode }) => {
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

export default Layout;
