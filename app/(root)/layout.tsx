"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SideBar from "@/components/common/SideBar/SideBar";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/stores/useAuthStore";
const queryClient = new QueryClient();

const publicRoutes = ["/auth/login", "/auth/register"];
const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data } = useAuthStore();
  useEffect(() => {
    if (!data?.user) {
      router.push("/auth/login");
    }
  }, [data, router]);
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);
  return (
    <main className="min-h-screen bg-black/90">
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className={`${!isPublicRoute && "flex"} h-full`}>
        {!isPublicRoute && data?.user && <SideBar />}
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </div>
    </main>
  );
};

export default Layout;
